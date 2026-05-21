from sqlalchemy import Table, Column, ForeignKey
from app.models.base_model import BaseModel

user_roles = Table(
    "user_roles",
    BaseModel.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("role_id", ForeignKey("roles.id"), primary_key=True),
)