export interface Product {
    id: number
    name: string
    count: number
    price: number;
    image_path: string | null
    created_by: number
}

export interface DeleteResponse {
    status: string
}