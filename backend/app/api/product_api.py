from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException

from app.models.user_model import UserModel
from app.dependencies.user_dependencies import get_current_user
from app.dependencies.product_dependencies import get_product_service
from app.services.product_service import ProductService

from app.schemas.product_schema import ProductCreateSchema

router = APIRouter()

@router.post("/create")
async def create_product(
        name: str = Form(...),
        count: int = Form(...),
        file: UploadFile = File(...),

        current_user: UserModel = Depends(get_current_user),
        service: ProductService = Depends(get_product_service),
):
    normalized_name = " ".join(name.strip().lower().split())
    product_data = ProductCreateSchema(
        name=normalized_name,
        count=count
    )

    created_product = await service.create_product(
        product_data,
        file=file,
        user=current_user
    )

    return {
        "id": created_product.id,
        "name": created_product.name,
        "count": created_product.count,
        "image_path": created_product.image_path,
        "created_by": created_product.created_by_id
    }

@router.get("/get_all")
async def get_products(
        service: ProductService = Depends(get_product_service),
):
    return await service.get_all()


@router.delete("/{product_id}")
async def delete_product(
        product_id: int,
        current_user: UserModel = Depends(get_current_user),
        service: ProductService = Depends(get_product_service),
):
    result = await service.delete_product(product_id, current_user)

    if not result:
        raise HTTPException(status_code=404, detail="Product not found")

    return {"status": "deleted"}