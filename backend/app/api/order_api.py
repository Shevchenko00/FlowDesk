from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.user_dependencies import get_current_user
from app.dependencies.order_dependencies import get_order_service
from app.models.user_model import UserModel
from app.models.order_model import OrderStatus
from app.schemas.order_schema import (
    OrderCreateSchema,
    OrderStatusUpdateSchema,
    DeliveryMethodCreateSchema,
)
from app.services.order_service import OrderService

router = APIRouter()


@router.post("/create")
async def create_order(
        data: OrderCreateSchema,
        current_user: UserModel = Depends(get_current_user),
        service: OrderService = Depends(get_order_service),
):
    return await service.create_order(
        product_id=data.product_id,
        delivery_method_id=data.delivery_method_id,
        user=current_user,
        address=data.address,
    )


@router.get("/my")
async def get_my_orders(
        current_user: UserModel = Depends(get_current_user),
        service: OrderService = Depends(get_order_service),
):
    return await service.get_my_orders(current_user)


@router.get("/all")
async def get_all_orders(
        status: OrderStatus | None = None,
        current_user: UserModel = Depends(get_current_user),
        service: OrderService = Depends(get_order_service),
):
    roles = [r.name.lower() for r in current_user.roles]

    if "employee" not in roles and "admin" not in roles:
        raise HTTPException(status_code=403)

    return await service.get_all_orders(current_user, status=status)


@router.patch("/{order_id}/status")
async def update_order_status(
        order_id: int,
        data: OrderStatusUpdateSchema,
        current_user: UserModel = Depends(get_current_user),
        service: OrderService = Depends(get_order_service),
):
    return await service.update_status(order_id, data.status, current_user)


@router.post("/delivery-methods/create")
async def create_delivery_method(
        data: DeliveryMethodCreateSchema,
        current_user: UserModel = Depends(get_current_user),
        service: OrderService = Depends(get_order_service),
):
    roles = [r.name.lower() for r in current_user.roles]
    if "admin" not in roles:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return await service.create_delivery_method(data.name)


@router.get("/delivery-methods")
async def get_delivery_methods(
        service: OrderService = Depends(get_order_service),
):
    return await service.delivery_repo.get_all_active()