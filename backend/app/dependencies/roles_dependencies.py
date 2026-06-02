from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.roles_repository import RolesRepository

from app.core.database_config import get_session


from app.models.roles_model import RolesModel

async def get_roles_repo(
        db: Annotated[AsyncSession, Depends(get_session)]
) -> RolesRepository:
    return RolesRepository(db, RolesModel)