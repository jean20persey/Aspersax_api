import axios from 'axios';

const API_URL = 'http://localhost:8000/api';  // Ajusta esto según tu configuración

interface Robot {
    id: string;
    nombre: string;
    estado: string;
    bateria: number;
    ultima_actividad: string;
}

interface CreateRobotData {
    nombre: string;
    estado: string;
}

const robotsService = {
    getAll: () => {
        return axios.get<Robot[]>(`${API_URL}/robots/`);
    },

    getById: (id: string) => {
        return axios.get<Robot>(`${API_URL}/robots/${id}/`);
    },

    create: (data: CreateRobotData) => {
        return axios.post<Robot>(`${API_URL}/robots/`, data);
    },

    update: (id: string, data: Partial<CreateRobotData>) => {
        return axios.patch<Robot>(`${API_URL}/robots/${id}/`, data);
    },

    delete: (id: string) => {
        return axios.delete(`${API_URL}/robots/${id}/`);
    }
};

export default robotsService; 