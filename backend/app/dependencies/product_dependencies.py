from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database_config import get_session
from app.repositories.product_repository import ProductRepository
from app.services.product_service import ProductService


def get_product_service(
        session: AsyncSession = Depends(get_session),
):
    repo = ProductRepository(session)
    return ProductService(repo)