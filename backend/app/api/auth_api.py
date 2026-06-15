from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.exc import IntegrityError
from starlette import status

from app.dependencies.user_dependencies import get_user_service, get_current_user
from app.schemas.auth_schema import UserLoginSchema, TokenSchema
from app.schemas.user_schema import UserCreationSchema, UserViewSchema
from app.services.user_service import UsersService, REFRESH_TOKEN_EXPIRE_DAYS

from app.utils.password_utils import hash_password

from app.schemas.set_password_schema import SetPasswordSchema

router = APIRouter()


@router.post(
    "/sign_up",
    response_model=UserViewSchema,
    status_code=status.HTTP_201_CREATED
)
async def sign_up(
        user: UserCreationSchema,
        response: Response,
        user_service: Annotated[UsersService, Depends(get_user_service)],
):
    try:
        created_user = await user_service.create(user)

        await user_service.update_user(
            created_user.id,
            {
                "is_first_login": False,
                "last_login": datetime.utcnow(),
            },
        )

        access_token = user_service.create_access_token(
            {"sub": user.email}
        )

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=60 * 60,
            path="/",
        )

        return created_user

    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists",
        )

# """ In FUTURE must me 'forgot password' function """
# @router.post("/set-password")
# async def set_password(
#         data: SetPasswordSchema,
#         user_service: Annotated[UsersService, Depends(get_user_service)],
#         current_user=Depends(get_current_user),
# ):
#     user = await user_service.get_single(id=current_user.id)
#
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#
#     user.password = hash_password(data.new_password)
#     user.is_first_login = False
#     user.last_login = datetime.utcnow()
#
#     await user_service.session.commit()
#     await user_service.session.refresh(user)
#
#     return {"message": "Password set successfully"}


@router.post("/sign_in", response_model=TokenSchema)
async def sign_in(
        user: UserLoginSchema,
        response: Response,
        user_service: Annotated[UsersService, Depends(get_user_service)],
):
    db_user = await user_service.authenticate(user.email, user.password)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if db_user.is_first_login:
        access_token = user_service.create_access_token(
            {"sub": db_user.email, "first_login": True}
        )

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=60 * 60,
            path="/",
        )

        return {
            "token_type": "bearer",
            "first_login": True
        }

    access_token = user_service.create_access_token({"sub": db_user.email})
    refresh_token = user_service.create_refresh_token({"sub": db_user.email})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60,
        path="/",
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/",
    )

    return {"token_type": "bearer", "first_login": False}



@router.post("/refresh")
async def refresh_token(
        request: Request,
        response: Response,
        user_service: Annotated[UsersService, Depends(get_user_service)],
):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing refresh token",
        )

    payload = user_service.verify_refresh_token(refresh_token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    new_access_token = user_service.create_access_token(
        {"sub": payload["sub"]}
    )

    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60,
        path="/",
    )

    return {"accessToken": new_access_token}

@router.get("/me", response_model=UserViewSchema)
async def get_me(
        user_service: Annotated[UsersService, Depends(get_user_service)],
        current_user=Depends(get_current_user),
):
    await user_service.update_last_activity(current_user.id)

    return UserViewSchema.model_validate(current_user)

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")

    return {"message": "Logged out"}