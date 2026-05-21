from app.schemas.base_schema import BaseSchema
from pydantic import EmailStr


class UserLoginSchema(BaseSchema):
    email: EmailStr
    password: str


class TokenSchema(BaseSchema):
    token_type: str = "bearer"
