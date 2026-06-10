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
            product: ProductCreateSchema,  # <-- было product_data, теперь везде product
            file: UploadFile,
            user: UserModel
    ):
        existing = await self.repo.get_by_name(product.name)  # <-- было product_data.name
        if existing:
            raise HTTPException(status_code=409, detail="Product with this name already exists")

        image_path = await save_image(file)

        data = {
            "name": product.name,
            "count": product.count,
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