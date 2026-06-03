
from app.schemas.base_schema import BaseSchema


class SetPasswordSchema(BaseSchema):
    new_password: str