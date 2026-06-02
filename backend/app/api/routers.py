from app.api.auth_api import router as auth_router
from app.api.employees_api import router as employees_router
from fastapi import APIRouter

v1 = APIRouter()

v1.include_router(auth_router, prefix='/auth', tags=["auth"])
v1.include_router(employees_router, prefix='/employee', tags=["employee"])