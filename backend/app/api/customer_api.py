import os
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.user_dependencies import get_user_service
from app.schemas.user_schema import UserCreationSchema

from app.schemas.user_schema import UserViewSchema

from app.services.user_service import UsersService

from app.dependencies.roles_dependencies import get_roles_repo

from app.repositories.roles_repository import RolesRepository

from app.schemas.customer_schema import CustomerCreateResponseSchema, CustomerCreationSchema

from app.schemas.set_password_schema import SetPasswordSchema
from app.utils.password_utils import hash_password
from sqlalchemy.exc import IntegrityError

from app.models.user_model import UserModel

from app.dependencies.user_dependencies import get_current_user

FRONTEND_API = os.getenv("FRONTEND_API")
router = APIRouter()


@router.post("/create", response_model=CustomerCreateResponseSchema)
async def create_customer(
        user: CustomerCreationSchema,
        role_repo: Annotated[RolesRepository, Depends(get_roles_repo)],
        user_service: Annotated[UsersService, Depends(get_user_service)],
        current_user: UserModel = Depends(get_current_user),
):
    role = await role_repo.get_or_create(name="customer")
    roles = [r.name.lower() for r in current_user.roles]

    if "employee" not in roles and "admin" not in roles:
        raise HTTPException(status_code=403)
    try:
        created_user, token = await user_service.create_invite(
            user,
            roles=[role]
        )
    except IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="User with this email already exists"
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