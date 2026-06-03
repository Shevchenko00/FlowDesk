export interface User {
    is_first_login: boolean
    last_login: string | null // ISO datetime
    id: string
    email: string
    first_name: string
}

export interface AuthResponse {
    accessToken: string
    user: User
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
}

