import enum
from datetime import datetime

from sqlalchemy import ForeignKey, DateTime, Enum, func, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.delivery_method_model import DeliveryMethodModel
from app.models.product_model import ProductModel
from app.models.user_model import UserModel

from app.models.base_model import BaseModel


class OrderStatus(str, enum.Enum):
    canceled = "canceled"
    pending = "pending"
    confirmed = "confirmed"
    shipped = "shipped"
    delivered = "delivered"


class OrderModel(BaseModel):
    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint("quantity > 0", name="ck_orders_quantity_positive"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    delivery_method_id: Mapped[int] = mapped_column(ForeignKey("delivery_methods.id"), nullable=False)
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus),
        default=OrderStatus.pending,
        nullable=False
    )

    quantity: Mapped[int] = mapped_column(default=1, nullable=False)

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