export interface Role {
    id: number;
    name: string;
}

export interface UserMe {
    id: number;
    email: string;
    first_name: string;
    last_login: string | null;
    is_first_login: boolean;
    roles: Role[];
}