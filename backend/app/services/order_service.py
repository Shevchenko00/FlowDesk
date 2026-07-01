from decimal import Decimal

from fastapi import HTTPException
from app.models.user_model import UserModel
from app.models.order_model import OrderStatus
from app.repositories.order_repository import OrderRepository
from app.repositories.product_repository import ProductRepository
from app.repositories.delivery_method_repository import DeliveryMethodRepository
from app.repositories.user_repository import UsersRepository
from app.schemas.order_schema import AddressSchema
from sqlalchemy import select

from app.models.delivery_method_model import DeliveryMethodModel

FINAL_STATUSES = {OrderStatus.delivered, OrderStatus.canceled}

CUSTOMER_CANCELABLE_STATUSES = {OrderStatus.pending, OrderStatus.confirmed}


class OrderService:
    def __init__(
            self,
            order_repo: OrderRepository,
            product_repo: ProductRepository,
            delivery_repo: DeliveryMethodRepository,
            user_repo: UsersRepository,
    ):
        self.order_repo = order_repo
        self.product_repo = product_repo
        self.delivery_repo = delivery_repo
        self.user_repo = user_repo

    def _role_names(self, user: UserModel) -> list[str]:
        return [r.name.lower() for r in user.roles]

    def _has_address(self, user: UserModel) -> bool:
        return bool(user.street)

    async def create_order(
            self,
            product_id: int,
            delivery_method_id: int,
            user: UserModel,
            quantity: int = 1,
            address: AddressSchema | None = None,
    ):
        roles = self._role_names(user)
        if "customer" not in roles and "admin" not in roles:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        if quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be positive")

        product = await self.product_repo.get_single(id=product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if not product.is_available or product.count <= 0:
            raise HTTPException(status_code=400, detail="Product is not available")
        if product.count < quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Only {product.count} item(s) left in stock",
            )

        delivery = await self.delivery_repo.get_single(id=delivery_method_id)
        if not delivery or not delivery.is_active:
            raise HTTPException(status_code=404, detail="Delivery method not found")


        if address is not None:
            await self.user_repo.update(
                obj=user,
                data={
                    "country": address.country,
                    "city": address.city,
                    "street": address.street,
                    "postal_code": address.postal_code,
                }
            )

        new_count = product.count - quantity
        await self.product_repo.update(
            obj=product,
            data={
                "count": new_count,
                # Если раскупили весь остаток — товар автоматически становится недоступным.
                "is_available": product.is_available and new_count > 0,
            }
        )

        return await self.order_repo.create({
            "product_id": product_id,
            "customer_id": user.id,
            "delivery_method_id": delivery_method_id,
            "quantity": quantity,
            "status": OrderStatus.pending,
            "is_processed": False,
            "is_successful": None,
        })

    async def get_my_orders(self, user: UserModel):
        return await self.order_repo.get_by_customer(user.id)

    async def create_delivery_method(self, name: str, price: Decimal):
        existing = await self.delivery_repo.get_single(name=name, price=price)
        if existing:
            raise HTTPException(status_code=409, detail="Delivery method already exists")

        return await self.delivery_repo.create({"name": name, "price": price, "is_active": True})
    async def update_delivery_method(
            self,
            method_id: int,
            name: str,
            price: Decimal,
            is_active: bool
    ):
        method = await self.delivery_repo.get_single(id=method_id)

        if not method:
            raise HTTPException(status_code=404, detail="Delivery method not found")

        return await self.delivery_repo.update(
            obj=method,
            data={
                "name": name,
                "price": price,
                "is_active": is_active
            }
        )

    async def get_all_orders(self, user: UserModel, status: OrderStatus | None = None):
        roles = self._role_names(user)
        if "admin" not in roles and "employee" not in roles:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return await self.order_repo.get_all(status=status)

    async def update_status(self, order_id: int, status: OrderStatus, user: UserModel):
        # Этот метод предназначен только для сотрудников/админов —
        # он управляет полным циклом обработки заказа.
        # Клиенты используют отдельный метод cancel_order.
        roles = self._role_names(user)
        if "admin" not in roles and "employee" not in roles:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        order = await self.order_repo.get_single(id=order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.status in FINAL_STATUSES:
            raise HTTPException(
                status_code=400,
                detail="Order is already finalized and cannot be modified",
            )

        data: dict = {"status": status, "is_processed": True}

        if status == OrderStatus.delivered:
            data["is_successful"] = True
        elif status == OrderStatus.confirmed:
            data["is_successful"] = None  # ещё в процессе
        elif status == OrderStatus.canceled:
            data["is_successful"] = False

        return await self.order_repo.update(obj=order, data=data)

    async def cancel_order(self, order_id: int, user: UserModel):
        # Клиент может отменить только свой собственный заказ,
        # и только пока он не подтверждён сотрудником на отправку/доставку.
        roles = self._role_names(user)
        if "customer" not in roles and "admin" not in roles:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        order = await self.order_repo.get_single(id=order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if "admin" not in roles and order.customer_id != user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        if order.status in FINAL_STATUSES:
            raise HTTPException(
                status_code=400,
                detail="Order is already finalized and cannot be canceled",
            )

        if order.status not in CUSTOMER_CANCELABLE_STATUSES:
            raise HTTPException(
                status_code=400,
                detail="Order can no longer be canceled at this stage",
            )

        return await self.order_repo.update(
            obj=order,
            data={
                "status": OrderStatus.canceled,
                "is_processed": True,
                "is_successful": False,
            },
        )