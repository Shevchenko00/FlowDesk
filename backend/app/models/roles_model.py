from sqlalchemy.orm import mapped_column, Mapped

from app.models.base_model import BaseModel


class RolesModel(BaseModel):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)