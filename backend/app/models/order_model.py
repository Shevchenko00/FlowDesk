import enum
from datetime import datetime

from sqlalchemy import ForeignKey, DateTime, Enum, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.delivery_method_model import DeliveryMethodModel
from app.models.product_model import ProductModel
from app.models.user_model import UserModel

from app.models.base_model import BaseModel


class OrderStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    shipped = "shipped"
    delivered = "delivered"


class OrderModel(BaseModel):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    delivery_method_id: Mapped[int] = mapped_column(ForeignKey("delivery_methods.id"), nullable=False)

    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus),
        default=OrderStatus.pending,
        nullable=False
    )

    is_processed: Mapped[bool] = mapped_column(default=False)
    is_successful: Mapped[bool | None] = mapped_column(nullable=True)

    ordered_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    product: Mapped[ProductModel] = relationship(lazy="selectin")
    customer: Mapped[UserModel] = relationship(lazy="selectin")
    delivery_method: Mapped[DeliveryMethodModel] = relationship(lazy="selectin")