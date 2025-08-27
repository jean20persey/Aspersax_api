import axios from 'axios';

const API_URL = '/api';

// Interfaces
interface CreateRobotData {
  nombre: string;
  estado: string;
  bateria: number;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/token/', credentials),
  refreshToken: (refresh: string) =>
    api.post('/token/refresh/', { refresh }),
};

// Servicios de robots
export const robotsService = {
  getAll: () => api.get('/robots/'),
  getById: (id: number) => api.get(`/robots/${id}/`),
  create: (data: CreateRobotData) => api.post('/robots/', data),
  update: (id: number, data: Partial<CreateRobotData>) => api.put(`/robots/${id}/`, data),
  delete: (id: number) => api.delete(`/robots/${id}/`),
};

// Servicios de tanques
export const tanquesService = {
  getAll: () => api.get('/tanques/'),
  getById: (id: number) => api.get(`/tanques/${id}/`),
  create: (data: any) => api.post('/tanques/', data),
  update: (id: number, data: any) => api.put(`/tanques/${id}/`, data),
  delete: (id: number) => api.delete(`/tanques/${id}/`),
};

// Servicios de jornadas
export const jornadasService = {
  getAll: () => api.get('/jornadas/'),
  getById: (id: number) => api.get(`/jornadas/${id}/`),
  create: (data: any) => api.post('/jornadas/', data),
  update: (id: number, data: any) => api.put(`/jornadas/${id}/`, data),
  delete: (id: number) => api.delete(`/jornadas/${id}/`),
};

// Servicios de malezas
export const malezasService = {
  getAll: () => api.get('/malezas/'),
  getById: (id: number) => api.get(`/malezas/${id}/`),
  create: (data: any) => api.post('/malezas/', data),
  update: (id: number, data: any) => api.put(`/malezas/${id}/`, data),
  delete: (id: number) => api.delete(`/malezas/${id}/`),
};

export default api; 