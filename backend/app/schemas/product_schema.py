
from app.schemas.base_schema import BaseSchema


class ProductCreateSchema(BaseSchema):
    name: str
    count: int