from app.models.base_model import BaseModel
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String


class ProductModel(BaseModel):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    count: Mapped[int]
    name: Mapped[str] = mapped_column(unique=True, nullable=False)

    created_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    is_available: Mapped[bool] = mapped_column(default=True, nullable=False)
    image_path: Mapped[str | None] = mapped_column(String, nullable=True)