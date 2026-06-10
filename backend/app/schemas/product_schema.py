
from app.schemas.base_schema import BaseSchema
from pydantic import field_validator


class ProductCreateSchema(BaseSchema):
    name: str
    count: int
    @field_validator("name")
    @classmethod
    def normalize_name(cls, v: str) -> str:
        return " ".join(v.strip().lower().split())