import axios from 'axios';
import { LoginCredentials, LoginResponse, User } from '../interfaces/User';

const API_URL = 'http://localhost:8000/api/auth';

class AuthService {
    async register(userData: any): Promise<any> {
        try {
            console.log('Intentando registrar usuario con datos:', userData);
            const response = await axios.post(`${API_URL}/registro/`, userData);
            console.log('Respuesta del servidor:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error en el registro:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    async login(credentials: LoginCredentials): Promise<any> {
        try {
            const response = await axios.post<LoginResponse>(`${API_URL}/token/`, credentials);
            if (response.data.access) {  // JWT devuelve 'access' y 'refresh'
                const userData = {
                    token: response.data.access,
                    refresh: response.data.refresh,
                    user: credentials.username
                };
                localStorage.setItem('user', JSON.stringify(userData));
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                return userData;
            }
            throw new Error('Token no recibido');
        } catch (error: any) {
            console.error('Error en el login:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    logout(): void {
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    }

    getCurrentUser(): any {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
            return userData;
        }
        return null;
    }

    isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }
}

export default new AuthService(); 