from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker

from app.models.base_model import BaseModel

from .project_config import Settings

settings = Settings()
DATABASE_URL = settings.database_url

engine = create_async_engine(DATABASE_URL, echo=settings.DB_ECHO)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.create_all)


async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session