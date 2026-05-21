from app.api.auth_api import router as auth_router
from fastapi import APIRouter

v1 = APIRouter()

v1.include_router(auth_router, prefix='/auth', tags=["auth"])