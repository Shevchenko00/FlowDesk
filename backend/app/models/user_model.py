from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.associations import user_roles
from app.models.base_model import BaseModel
from app.models.role_model import RoleModel


class UserModel(BaseModel):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    first_name: Mapped[str]
    last_name: Mapped[str]
    is_active: Mapped[bool] = mapped_column(default=True)
    password: Mapped[str]
    roles: Mapped[list[RoleModel]] = relationship(
        secondary=user_roles,
        backref="users"
    )