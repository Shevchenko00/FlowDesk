from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi.middleware import SlowAPIMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.api.routers import v1
from app.core.project_config import settings
from app.core.database_config import async_session
from app.core.seed import create_admin_if_not_exists

from starlette.staticfiles import StaticFiles


limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["10/minute"]  # 👈 ВОТ ОН
)


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
    lifespan=lifespan,
    title="Flow Desk API",
    swagger_ui_parameters={
        "persistAuthorization": True
    },
)


# Подключаем slowapi
app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)


app.mount(
    "/media",
    StaticFiles(directory="media"),
    name="media"
)


app.include_router(v1)


app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=settings.ALLOWED_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)