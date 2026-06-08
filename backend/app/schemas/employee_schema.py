from app.schemas.base_schema import BaseSchema
from pydantic import EmailStr


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