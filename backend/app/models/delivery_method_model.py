from sqlalchemy.orm import Mapped, mapped_column

from app.models.base_model import BaseModel


class DeliveryMethodModel(BaseModel):
    __tablename__ = "delivery_methods"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)  
    is_active: Mapped[bool] = mapped_column(default=True)