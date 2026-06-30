from datetime import datetime
from decimal import Decimal

from app.models.order_model import OrderStatus

from pydantic import Field

from app.schemas.base_schema import BaseSchema


class AddressSchema(BaseSchema):
    country: str
    city: str
    street: str
    postal_code: str


class OrderCreateSchema(BaseSchema):
    product_id: int
    delivery_method_id: int
    quantity: int = Field(default=1, gt=0)
    # Указывается, только если у пользователя ещё нет постоянного адреса,
    # либо он явно его редактирует.
    address: AddressSchema | None = None


class OrderStatusUpdateSchema(BaseSchema):
    status: OrderStatus

class DeliveryMethodCreateSchema(BaseSchema):
    name: str
    price: Decimal

class DeliveryMethodSchema(BaseSchema):
    id: int
    name: str

    class Config:
        from_attributes = True


class OrderResponseSchema(BaseSchema):
    id: int
    product_id: int
    customer_id: int
    delivery_method: DeliveryMethodSchema
    status: OrderStatus
    quantity: int
    is_processed: bool
    is_successful: bool | None
    ordered_at: datetime

    class Config:
        from_attributes = True