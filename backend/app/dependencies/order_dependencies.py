from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database_config import get_session
from app.repositories.order_repository import OrderRepository
from app.repositories.product_repository import ProductRepository
from app.repositories.delivery_method_repository import DeliveryMethodRepository
from app.repositories.user_repository import UsersRepository
from app.models.user_model import UserModel
from app.services.order_service import OrderService


def get_order_service(session: AsyncSession = Depends(get_session)) -> OrderService:
    return OrderService(
        order_repo=OrderRepository(session),
        product_repo=ProductRepository(session),
        delivery_repo=DeliveryMethodRepository(session),
        user_repo=UsersRepository(session, UserModel),
    )