import os
from fastapi import UploadFile

UPLOAD_DIR = "media/products"


async def save_image(file: UploadFile) -> str:
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return file_path