import re
from pydantic import field_validator, EmailStr
from datetime import datetime
from fastapi import HTTPException, status
from pydantic import field_validator

from app.schemas.base_schema import BaseSchema

LETTER_MATCH_PATTERN = re.compile(r"^[а-яА-Яa-zA-Z\-]+$")
USERNAME_LETTER_MATCH_PATTERN = re.compile(r"^[a-zA-Z]")
MAX_PASSWORD_LENGTH = 3


class UserCreationSchema(BaseSchema):
    password: str
    email: EmailStr
    first_name: str
    last_name: str
    @field_validator("password")
    def validate_password(cls, value):
        if len(value) < MAX_PASSWORD_LENGTH:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Password can not contain less than {MAX_PASSWORD_LENGTH} symbols",
            )
        return value


class UserAuthSchema(BaseSchema):
    email: str
    password: str



class UserViewSchema(BaseSchema):
    id: int
    email: str
    first_name: str
    is_first_login: bool
    last_login: datetime | None = None


class EmployeeCreateResponseSchema(BaseSchema):
    id: int
    email: str
    first_name: str
    last_name: str
    invite_link: str

class EmployeeCreationSchema(BaseSchema):
    email: EmailStr
    first_name: str
    last_name: str
