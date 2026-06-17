export type OrderStatus =
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered";

export interface DeliveryMethod {
    id: number;
    name: string;
    is_active: boolean;
}

export interface ProcessedBy {
    id: number;
    name: string;
}
interface Address {
    country: string;
    city: string;
    street: string;
    postal_code: string;
}
export interface Role {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    is_first_login: boolean;
    last_login: string | null;
    invite_token: string | null;
    invite_expires_at: string | null;
    roles: Role[];
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    count: number;
    is_available: boolean;
    image_path: string;
    created_by_id: number;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    product_id: number;
    customer_id: number;
    delivery_method_id: number;
    delivery_method: DeliveryMethod;
    customer: Customer;
    product: Product;
    status: string;
    is_processed: boolean;
    is_successful: boolean | null;
    ordered_at: string;
    created_at: string;
    updated_at: string;
    processed_by?: ProcessedBy | null;
}

export interface CreateOrderPayload {
    product_id: number;
    delivery_method_id: number;
}
