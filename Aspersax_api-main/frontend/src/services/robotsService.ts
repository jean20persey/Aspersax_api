import api from './api';

interface Robot {
    id_robot: number;
    nombre: string;
    estado: string;
    bateria: number;
    ultima_actividad: string;
    activo: boolean;
}

interface CreateRobotData {
    nombre: string;
    estado: string;
    bateria: number;
}

const robotsService = {
    getAll: () => {
        return api.get<Robot[]>('/robots/');
    },

    getById: (id: number) => {
        return api.get<Robot>(`/robots/${id}/`);
    },

    create: (data: CreateRobotData) => {
        const robotData = {
            ...data,
            bateria: Number(data.bateria)
        };
        return api.post<Robot>('/robots/crear/', robotData);
    },

    update: (id: number, data: Partial<CreateRobotData>) => {
        return api.patch<Robot>(`/robots/${id}/actualizar/`, data);
    },

    delete: (id: number) => {
        return api.delete(`/robots/${id}/eliminar/`);
    }
};

export default robotsService; 