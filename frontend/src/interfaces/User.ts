export interface User {
    id?: number;
    username: string;
    email?: string;
    token?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
    user?: {
        username: string;
        email: string;
        rol: string;
        full_name: string;
    };
} 