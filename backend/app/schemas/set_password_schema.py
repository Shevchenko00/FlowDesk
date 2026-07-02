
from app.schemas.base_schema import BaseSchema


class SetPasswordSchema(BaseSchema):
    old_password: str
    new_password: str