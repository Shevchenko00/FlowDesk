from fastapi import Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database_config import get_session
from app.services.user_service import UsersService
from app.models.user_model import UserModel


def get_user_service(
        session: AsyncSession = Depends(get_session),
):
    return UsersService(session)


async def get_current_user(
        request: Request,
        user_service: UsersService = Depends(get_user_service),
) -> UserModel:

    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if token.startswith("Bearer "):
        token = token.split(" ")[1]

    payload = user_service.verify_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid access token")

    user = await user_service.get_by_email(payload.get("sub"))

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user