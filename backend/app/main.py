from fastapi import FastAPI

from app.core.project_config import settings

from app.api.routers import v1

app = FastAPI(debug=settings.DEBUG)

app.include_router(v1)
