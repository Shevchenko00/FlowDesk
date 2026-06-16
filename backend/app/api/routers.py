from app.api.auth_api import router as auth_router
from app.api.employee_api import router as employees_router
from app.api.customer_api import router as customer_router
from app.api.product_api import router as product_router
from fastapi import APIRouter
from app.api.order_api import router as order_router
v1 = APIRouter()

v1.include_router(auth_router, prefix='/auth', tags=["auth"])
v1.include_router(employees_router, prefix='/employee', tags=["employee"])
v1.include_router(customer_router, prefix='/customer', tags=["customer"])
v1.include_router(product_router, prefix='/product', tags=["product"])
v1.include_router(order_router, prefix='/order', tags=["order"])