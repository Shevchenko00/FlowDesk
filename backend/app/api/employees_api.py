

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.exc import IntegrityError
from starlette import status

from app.dependencies.user_dependencies import get_user_service
from app.schemas.user_schema import UserCreationSchema

from app.schemas.user_schema import UserViewSchema

from app.services.user_service import UsersService

from app.dependencies.roles_dependencies import get_roles_repo

from app.repositories.roles_repository import RolesRepository

router = APIRouter()



@router.post("/create", response_model=UserViewSchema)
async def sign_up(
        user: UserCreationSchema,
        role_repo: Annotated[RolesRepository, Depends(get_roles_repo)],
        user_service: Annotated[UsersService, Depends(get_user_service)]
):
    role = await role_repo.get_or_create(name="employee")

    created_user = await user_service.create(user, roles=[role])

    return created_user