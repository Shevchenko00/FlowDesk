from fastapi import HTTPException
from app.models.user_model import UserModel
from app.models.order_model import OrderStatus
from app.repositories.order_repository import OrderRepository
from app.repositories.product_repository import ProductRepository
from app.repositories.delivery_method_repository import DeliveryMethodRepository


class OrderService:
    def __init__(
            self,
            order_repo: OrderRepository,
            product_repo: ProductRepository,
            delivery_repo: DeliveryMethodRepository,
    ):
        self.order_repo = order_repo
        self.product_repo = product_repo
        self.delivery_repo = delivery_repo

    def _role_names(self, user: UserModel) -> list[str]:
        return [r.name.lower() for r in user.roles]

    async def create_order(self, product_id: int, delivery_method_id: int, user: UserModel):
        roles = self._role_names(user)
        if "customer" not in roles and "admin" not in roles:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        product = await self.product_repo.get_single(id=product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if not product.is_available or product.count <= 0:
            raise HTTPException(status_code=400, detail="Product is not available")

        delivery = await self.delivery_repo.get_single(id=delivery_method_id)
        if not delivery or not delivery.is_active:
            raise HTTPException(status_code=404, detail="Delivery method not found")

        await self.product_repo.update(
            obj=product,
            data={"count": product.count - 1}
        )

        return await self.order_repo.create({
            "product_id": product_id,
            "customer_id": user.id,
            "delivery_method_id": delivery_method_id,
            "status": OrderStatus.pending,
            "is_processed": False,
            "is_successful": None,
        })

    async def get_my_orders(self, user: UserModel):
        return await self.order_repo.get_by_customer(user.id)

    async def create_delivery_method(self, name: str):
        existing = await self.delivery_repo.get_single(name=name)
        if existing:
            raise HTTPException(status_code=409, detail="Delivery method already exists")

        return await self.delivery_repo.create({"name": name, "is_active": True})

    async def get_all_orders(self, user: UserModel):
        roles = self._role_names(user)
        if "admin" not in roles and "employee" not in roles:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return await self.order_repo.get_all()

    async def update_status(self, order_id: int, status: OrderStatus, user: UserModel):
        roles = self._role_names(user)
        if "admin" not in roles and "employee" not in roles:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        order = await self.order_repo.get_single(id=order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        data: dict = {"status": status, "is_processed": True}

        if status == OrderStatus.delivered:
            data["is_successful"] = True
        elif status == OrderStatus.confirmed:
            data["is_successful"] = None  # ещё в процессе

        return await self.order_repo.update(obj=order, data=data)