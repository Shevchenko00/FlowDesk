from pydantic import BaseModel, Extra


class BaseSchema(BaseModel):
    class Config:
        from_attributes = True
        extra = Extra.forbid