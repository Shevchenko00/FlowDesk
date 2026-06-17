from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, Boolean, String

from app.models.associations import user_roles
from app.models.base_model import BaseModel
from app.models.roles_model import RolesModel


class UserModel(BaseModel):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        index=True
    )

    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str] = mapped_column(String)

    is_active: Mapped[bool] = mapped_column(Boolean, default=False)

    password: Mapped[str | None] = mapped_column(String, nullable=True)

    invite_token: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    invite_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    last_login: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    is_first_login: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )

    roles: Mapped[list[RolesModel]] = relationship(
        secondary=user_roles,
        lazy="selectin",
        backref="users"
    )


    country: Mapped[str | None] = mapped_column(String, nullable=True)
    city: Mapped[str | None] = mapped_column(String, nullable=True)
    street: Mapped[str | None] = mapped_column(String, nullable=True)
    postal_code: Mapped[str | None] = mapped_column(String, nullable=True)