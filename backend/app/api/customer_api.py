import os
from typing import Annotated
from fastapi import APIRouter, Depends

from app.dependencies.user_dependencies import get_user_service
from app.schemas.user_schema import UserCreationSchema

from app.schemas.user_schema import UserViewSchema

from app.services.user_service import UsersService

from app.dependencies.roles_dependencies import get_roles_repo

from app.repositories.roles_repository import RolesRepository

from app.schemas.customer_schema import CustomerCreateResponseSchema, CustomerCreationSchema

from app.schemas.set_password_schema import SetPasswordSchema
from app.utils.password_utils import hash_password

FRONTEND_API = os.getenv("FRONTEND_API")
router = APIRouter()


@router.post("/create", response_model=CustomerCreateResponseSchema)
async def create_customer(
        user: CustomerCreationSchema,
        role_repo: Annotated[RolesRepository, Depends(get_roles_repo)],
        user_service: Annotated[UsersService, Depends(get_user_service)]
):
    role = await role_repo.get_or_create(name="customer")

    created_user, token = await user_service.create_invite(
        user,
        roles=[role]
    )

    invite_link = f"{FRONTEND_API}/invite/{token}"

    return {
        "id": created_user.id,
        "email": created_user.email,
        "first_name": created_user.first_name,
        "last_name": created_user.last_name,
        "invite_link": invite_link,
    }


@router.get("", response_model=list[UserViewSchema])
async def get_customer(
        user_service: Annotated[UsersService, Depends(get_user_service)]
):
    return await user_service.get_customers()