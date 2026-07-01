from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.delivery_method_model import DeliveryMethodModel


class DeliveryMethodRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all_active(self) -> list[DeliveryMethodModel]:
        stmt = select(DeliveryMethodModel)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_single(self, **filters) -> DeliveryMethodModel | None:
        stmt = select(DeliveryMethodModel).filter_by(**filters)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, data: dict) -> DeliveryMethodModel:
        instance = DeliveryMethodModel(**data)
        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)
        return instance
    async def update(
            self,
            obj: DeliveryMethodModel,
            data: dict,
    ) -> DeliveryMethodModel:
        for key, value in data.items():
            setattr(obj, key, value)

        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)

        return obj