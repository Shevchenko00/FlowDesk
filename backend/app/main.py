from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import v1
from app.core.project_config import settings
from app.core.database_config import async_session
from app.core.seed import create_admin_if_not_exists


@asynccontextmanager
async def lifespan(app: FastAPI):

    async with async_session() as db:
        await create_admin_if_not_exists(
            db,
            settings.ADMIN_EMAIL,
            settings.ADMIN_PASSWORD
        )

    yield




app = FastAPI(
    debug=settings.DEBUG,
    lifespan=lifespan
)

app.include_router(v1)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=settings.ALLOWED_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)