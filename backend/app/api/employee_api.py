import os
from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Response

from app.dependencies.user_dependencies import get_user_service
from app.schemas.user_schema import UserCreationSchema

from app.schemas.user_schema import UserViewSchema

from app.services.user_service import UsersService

from app.dependencies.roles_dependencies import get_roles_repo

from app.repositories.roles_repository import RolesRepository

from app.schemas.employee_schema import EmployeeCreateResponseSchema, EmployeeCreationSchema

from app.schemas.set_password_schema import SetPasswordSchema
from app.utils.password_utils import hash_password

FRONTEND_API = os.getenv("FRONTEND_API")
router = APIRouter()



@router.post("/create", response_model=EmployeeCreateResponseSchema)
async def create_employee(
        user: EmployeeCreationSchema,
        role_repo: Annotated[RolesRepository, Depends(get_roles_repo)],
        user_service: Annotated[UsersService, Depends(get_user_service)]
):
    role = await role_repo.get_or_create(name="employee")

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
@router.get("/invite/{token}")
async def get_invite(token: str, user_service: UsersService = Depends(get_user_service)):
    user = await user_service.get_single(invite_token=token)

    if not user:
        raise HTTPException(status_code=404, detail="Invalid invite")

    if user.invite_expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="Invite expired")

    return {
        "email": user.email
    }

@router.get("", response_model=list[UserViewSchema])
async def get_employees(
        user_service: Annotated[UsersService, Depends(get_user_service)]
):
    return await user_service.get_employees()




@router.post("/invite/{token}")
async def set_password(
        token: str,
        data: SetPasswordSchema,
        user_service: Annotated[UsersService, Depends(get_user_service)]
):
    user = await user_service.get_single(invite_token=token)

    if not user:
        raise HTTPException(status_code=404, detail="Invalid invite link")

    if user.invite_expires_at and user.invite_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invite expired")

    await user_service.update_user(user.id, {
        "password": hash_password(data.new_password),
        "invite_token": None,
        "invite_expires_at": None,
        "is_active": True,
        "is_first_login": False
    })

    return {"message": "Password set successfully"}