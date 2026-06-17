from datetime import datetime
from app.models.order_model import OrderStatus

from app.schemas.base_schema import BaseSchema


class AddressSchema(BaseSchema):
    country: str
    city: str
    street: str
    postal_code: str


class OrderCreateSchema(BaseSchema):
    product_id: int
    delivery_method_id: int
    # Указывается, только если у пользователя ещё нет постоянного адреса.
    # Если адрес в профиле уже есть, это поле игнорируется сервисом.
    address: AddressSchema | None = None


class OrderStatusUpdateSchema(BaseSchema):
    status: OrderStatus

class DeliveryMethodCreateSchema(BaseSchema):
    name: str

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
    is_processed: bool
    is_successful: bool | None
    ordered_at: datetime

    class Config:
        from_attributes = True