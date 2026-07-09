from decimal import Decimal

from app.repositories.product_repository import ProductRepository
from app.services.files import save_image
from app.models.user_model import UserModel
from fastapi import UploadFile, HTTPException

from app.schemas.product_schema import ProductCreateSchema


class ProductService:
    def __init__(self, repo: ProductRepository):
        self.repo = repo

    async def create_product(
            self,
            product: ProductCreateSchema,
            file: UploadFile,
            user: UserModel
    ):
        existing = await self.repo.get_by_name(product.name)
        if existing:
            raise HTTPException(status_code=409, detail="Product with this name already exists")

        image_path = await save_image(file)

        data = {
            "name": product.name,
            "count": product.count,
            "price": product.price,
            "image_path": image_path,
            "created_by_id": user.id
        }

        return await self.repo.create(data)

    async def get_all(self):
        return await self.repo.get_all()

    async def delete_product(self, product_id: int, user: UserModel):
        product = await self.repo.get_single(id=product_id)

        if not product:
            return None

        if product.created_by_id != user.id:
            raise PermissionError("You cannot delete this product")

        await self.repo.delete(id=product_id)
        return True

    async def update_price(self, product_id: int, price: Decimal, user: UserModel):
        product = await self.repo.get_single(id=product_id)

        if not product:
            return None

        role_names = [r.name.lower() for r in user.roles]

        if "admin" not in role_names and "employee" not in role_names:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        return await self.repo.update(
            obj=product,
            data={"price": price}
        )

    async def order_product(self, product_id: int, user: UserModel):
        product = await self.repo.get_single(id=product_id)

        if not product:
            return None

        role_names = [r.name.lower() for r in user.roles]

        if "customer" not in role_names and "admin" not in role_names:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        if product.count <= 0:
            raise HTTPException(status_code=400, detail="Product is not available")

        return await self.repo.update(obj=product, data={"count": product.count - 1})

    async def update_count(self, product_id: int, new_count: int, user: UserModel):
        product = await self.repo.get_single(id=product_id)

        if not product:
            return None

        role_names = [r.name.lower() for r in user.roles]

        if "admin" not in role_names and "employee" not in role_names:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        return await self.repo.update(
            obj=product,
            data={
                "count": new_count,
                "is_available": new_count > 0,
            }
        )

    async def toggle_availability(self, product_id: int, user: UserModel):
        product = await self.repo.get_single(id=product_id)

        if not product:
            return None

        role_names = [r.name.lower() for r in user.roles]

        if "admin" not in role_names and "employee" not in role_names:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        if product.count <= 0:
            raise HTTPException(status_code=400, detail="Cannot enable product with zero count")

        return await self.repo.update(
            obj=product,
            data={"is_available": not product.is_available}
        )