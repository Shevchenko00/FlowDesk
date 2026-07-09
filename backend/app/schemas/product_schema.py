from decimal import Decimal
from typing import Optional

from app.schemas.base_schema import BaseSchema
from pydantic import field_validator, Field


class ProductCreateSchema(BaseSchema):
    name: str
    count: int = Field(ge=0)
    price: Decimal
    @field_validator("name")
    @classmethod
    def normalize_name(cls, v: str) -> str:
        return " ".join(v.strip().lower().split())

class ProductUpdateCountSchema(BaseSchema):
    count: int = Field(..., ge=0)

class ProductUpdatePriceSchema(BaseSchema):
    price: Decimal

class ProductResponseSchema(BaseSchema):
    id: int
    name: str
    count: int
    image_path: Optional[str] = None
    is_available: bool

    class Config:
        from_attributes = True