from sqlalchemy import select
from app.models.user_model import UserModel
from app.models.roles_model import RolesModel
from app.utils.password_utils import hash_password


async def create_admin_if_not_exists(db, email: str, password: str):

    result = await db.execute(
        select(UserModel).where(UserModel.email == email)
    )
    user = result.scalar_one_or_none()

    if user:
        return

    role_result = await db.execute(
        select(RolesModel).where(RolesModel.name == "admin")
    )
    admin_role = role_result.scalar_one_or_none()

    if not admin_role:
        admin_role = RolesModel(
            name="admin",
        )
        db.add(admin_role)
        await db.flush()

    admin = UserModel(
        email=email,
        password=hash_password(password),
        first_name="Admin",
        last_name="System",
        is_active=True,
        is_first_login=False,
    )

    admin.roles.append(admin_role)

    db.add(admin)
    await db.commit()