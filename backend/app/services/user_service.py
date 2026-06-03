import os
from datetime import datetime, timedelta

from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import jwt
from jwt import PyJWTError
from fastapi import HTTPException
from app.models.user_model import UserModel
from app.repositories.user_repository import UsersRepository
from app.schemas.user_schema import UserCreationSchema
from app.utils.password_utils import hash_password

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv('SECRET_KEY', 'secret')
ALGORITHM = os.getenv('ALGORITHM', 'HS256')
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 5


class UsersService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.user_repo = UsersRepository(session, model=UserModel)

    async def get_by_email(self, email: str):
        return await self.get_single(email=email)

    async def get_employees(self):
        return await self.user_repo.get_employees()

    def create_access_token(self, data: dict, expires_delta: timedelta | None = None) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({
            "exp": expire,
            "type": "access"
        })
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    def create_refresh_token(self, data: dict, expires_delta: timedelta | None = None) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
        to_encode.update({
            "exp": expire,
            "type": "refresh"
        })
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    def verify_access_token(self, token: str) -> dict | None:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            if payload.get("type") != "access":
                return None
            return payload
        except PyJWTError:
            return None

    def verify_refresh_token(self, token: str) -> dict | None:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            if payload.get("type") != "refresh":
                return None
            if datetime.utcfromtimestamp(payload["exp"]) < datetime.utcnow():
                return None
            return payload
        except PyJWTError:
            return None

    async def authenticate(self, email: str, password: str) -> UserModel | None:
        result = await self.session.execute(
            select(UserModel).where(UserModel.email == email)
        )
        user = result.scalars().first()

        if not user or not pwd_context.verify(password, user.password):
            return None


        return user

    async def create(self, user: UserCreationSchema, roles=None) -> tuple[UserModel, str]:

        user_dict = user.model_dump()
        user_dict["password"] = hash_password(user_dict["password"])

        new_user = await self.user_repo.create(user_dict)

        if roles:
            new_user.roles = roles
            await self.session.commit()
            await self.session.refresh(new_user)


        return new_user



    async def update_user(self, user_id: int, data):
        user = await self.user_repo.get_single(id=user_id)

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        update_data = data.model_dump(exclude_unset=True)



        await self.user_repo.update(user, update_data)
        return user

    async def get_single(self, **filters):
        result = await self.session.execute(select(UserModel).filter_by(**filters))
        return result.scalars().first()

    async def get_all(self) -> list[UserModel]:
        return await self.user_repo.get_all()