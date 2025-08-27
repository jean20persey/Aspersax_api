import axios from './axiosConfig';
import { LoginCredentials, LoginResponse } from '../interfaces/User';

const API_URL = '/api/auth';

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
            console.log('Intentando login con credenciales:', credentials);
            const response = await axios.post<LoginResponse>(`${API_URL}/token/`, credentials);
            console.log('Respuesta del login:', response.data);
            
            if (response.data.access) {  // JWT devuelve 'access' y 'refresh'
                const userData = {
                    token: response.data.access,
                    refresh: response.data.refresh,
                    user: credentials.username
                };
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', response.data.access); // También guardar como 'token' para compatibilidad
                console.log('Token guardado en localStorage:', response.data.access);
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
        localStorage.removeItem('token');
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
        const user = this.getCurrentUser();
        console.log('Verificando autenticación, usuario:', user);
        return user !== null;
    }

    // Métodos para recuperación de contraseña
    async enviarCodigoRecuperacion(email: string): Promise<any> {
        try {
            console.log('Enviando código de recuperación a:', email);
            
            // Simular verificación de email existente
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            const usuarioExiste = usuarios.find((u: any) => u.email === email);
            
            if (!usuarioExiste) {
                throw new Error('Email no registrado en el sistema');
            }

            // Generar código de 6 dígitos
            const codigo = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Guardar código temporalmente (en producción sería en el backend)
            const codigoData = {
                email,
                codigo,
                timestamp: Date.now(),
                usado: false
            };
            
            localStorage.setItem('codigoRecuperacion', JSON.stringify(codigoData));
            
            // Simular envío de email (en producción se enviaría realmente)
            console.log(`Código enviado por email: ${codigo}`);
            alert(`SIMULACIÓN: Código enviado por email: ${codigo}`); // Solo para desarrollo
            
            return { message: 'Código enviado exitosamente' };
        } catch (error: any) {
            console.error('Error al enviar código:', error);
            throw { detail: error.message || 'Error al enviar código de recuperación' };
        }
    }

    async verificarCodigoRecuperacion(email: string, codigo: string): Promise<any> {
        try {
            console.log('Verificando código para:', email);
            
            const codigoData = JSON.parse(localStorage.getItem('codigoRecuperacion') || '{}');
            
            if (!codigoData.email || codigoData.email !== email) {
                throw new Error('No hay código pendiente para este email');
            }

            if (codigoData.usado) {
                throw new Error('Este código ya ha sido utilizado');
            }

            // Verificar que el código no haya expirado (10 minutos)
            const tiempoExpiracion = 10 * 60 * 1000; // 10 minutos
            if (Date.now() - codigoData.timestamp > tiempoExpiracion) {
                localStorage.removeItem('codigoRecuperacion');
                throw new Error('El código ha expirado. Solicita uno nuevo');
            }

            if (codigoData.codigo !== codigo) {
                throw new Error('Código incorrecto');
            }

            return { message: 'Código verificado correctamente' };
        } catch (error: any) {
            console.error('Error al verificar código:', error);
            throw { detail: error.message || 'Error al verificar código' };
        }
    }

    async cambiarPasswordConCodigo(email: string, codigo: string, nuevaPassword: string): Promise<any> {
        try {
            console.log('Cambiando contraseña para:', email);
            
            const codigoData = JSON.parse(localStorage.getItem('codigoRecuperacion') || '{}');
            
            if (!codigoData.email || codigoData.email !== email || codigoData.codigo !== codigo) {
                throw new Error('Código inválido o expirado');
            }

            if (codigoData.usado) {
                throw new Error('Este código ya ha sido utilizado');
            }

            // Actualizar contraseña del usuario
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            const usuarioIndex = usuarios.findIndex((u: any) => u.email === email);
            
            if (usuarioIndex === -1) {
                throw new Error('Usuario no encontrado');
            }

            usuarios[usuarioIndex].password = nuevaPassword;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            
            // Marcar código como usado
            codigoData.usado = true;
            localStorage.setItem('codigoRecuperacion', JSON.stringify(codigoData));
            
            // Limpiar código después de un tiempo
            setTimeout(() => {
                localStorage.removeItem('codigoRecuperacion');
            }, 5000);

            return { message: 'Contraseña cambiada exitosamente' };
        } catch (error: any) {
            console.error('Error al cambiar contraseña:', error);
            throw { detail: error.message || 'Error al cambiar contraseña' };
        }
    }
}

export default new AuthService(); 