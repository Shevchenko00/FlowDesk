from typing import Optional, Type
from sqlalchemy import select, delete, update
from sqlalchemy.ext.asyncio import AsyncSession

from .base_repository import AbstractRepository
from app.models.product_model import ProductModel


class ProductRepository(AbstractRepository):
    def __init__(self, session: AsyncSession):
        self.session = session
        self.model: Type[ProductModel] = ProductModel

    async def create(self, data: dict) -> ProductModel:
        instance = self.model(**data)

        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)

        return instance

    async def get_single(self, **filters) -> Optional[ProductModel]:
        stmt = select(self.model).filter_by(**filters)

        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(
            self,
            limit: int = 100,
            offset: int = 0,
            order: str = "id"
    ) -> list[ProductModel]:

        stmt = (
            select(self.model)
            .order_by(getattr(self.model, order))
            .limit(limit)
            .offset(offset)
        )

        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def update(self, obj: ProductModel, data: dict) -> ProductModel:
        for key, value in data.items():
            setattr(obj, key, value)

        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)

        return obj

    async def delete(self, **filters) -> None:
        await self.session.execute(
            delete(self.model).filter_by(**filters)
        )
        await self.session.commit()