from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order_model import OrderModel, OrderStatus


class OrderRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, data: dict) -> OrderModel:
        order = OrderModel(**data)
        self.session.add(order)
        await self.session.commit()
        await self.session.refresh(order)
        return order

    async def get_single(self, **filters) -> Optional[OrderModel]:
        stmt = select(OrderModel).filter_by(**filters)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(self, status: OrderStatus | None = None) -> List[OrderModel]:
        stmt = select(OrderModel)

        if status is not None:
            stmt = stmt.where(OrderModel.status == status)

        stmt = stmt.order_by(OrderModel.ordered_at.desc())

        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_by_customer(self, customer_id: int) -> List[OrderModel]:
        stmt = (
            select(OrderModel)
            .where(OrderModel.customer_id == customer_id)
            .order_by(OrderModel.ordered_at.desc())
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def update(self, obj: OrderModel, data: dict) -> OrderModel:
        for key, value in data.items():
            setattr(obj, key, value)

        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj