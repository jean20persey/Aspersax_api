import api from './axiosConfig';

// ============================================================
// Interfaces que reflejan los modelos reales del backend Django
// ============================================================

export interface Robot {
  id_robot: number;
  /** Finca a la que pertenece el robot. Siempre 'Finca La Riverita' */
  finca: string;
  nombre: string;
  estado: 'Disponible' | 'En Mantenimiento' | 'En Operación' | 'Fuera de Servicio';
  bateria: number;
  ultima_actividad: string;
  activo: boolean;
}

export interface Tanque {
  id_tanque: number;
  nombre: string;
  capacidad: number;
  nivel_actual: number;
  estado: 'Lleno' | 'Medio' | 'Bajo' | 'Vacío';
  ultima_recarga: string;
  activo: boolean;
}

export interface Jornada {
  id_jornada: number;
  /** Finca donde se realizó la jornada. Siempre 'Finca La Riverita' */
  finca: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  duracion: string; // DurationField se serializa como string "HH:MM:SS"
  area_tratada: number;
  robot: number; // FK id
  tanque: number; // FK id
  activo: boolean;
}

export interface Maleza {
  id_maleza: number;
  /** Finca donde se detectó la romaza. Siempre 'Finca La Riverita' */
  finca: string;
  /** Área de trabajo dentro de la finca (ej: Lote 1, Sector Norte) */
  nombre: string;
  /** Nombre científico de la maleza. Por defecto: Rumex crispus */
  nombre_cientifico: string | null;
  /** Número de plantas de Romaza (Rumex crispus) detectadas en el área */
  cantidad_romaza: number;
  /** Observaciones del área de trabajo */
  descripcion: string | null;
  temporada: string | null;
  resistencia_herbicida: boolean;
  activo: boolean;
  informacion_tecnica?: {
    id: number;
    imagen_url: string | null;
    metodo_control: string | null;
    quimico_recomendado: string | null;
    nivel_peligro: 'Bajo' | 'Medio' | 'Alto';
  };
}

export interface MalezaDetectada {
  id: number;
  jornada: number;
  maleza: number;
  ubicacion: string;
  densidad: string;
  activo: boolean;
}

// ============================================================
// Servicios de autenticación
// ============================================================
export const authService = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/token/', credentials),
  refreshToken: (refresh: string) =>
    api.post('/token/refresh/', { refresh }),
};

// ============================================================
// Servicios de robots
// URLs backend: GET/POST '', GET '<id>/', PATCH '<id>/actualizar/', DELETE '<id>/eliminar/'
// ============================================================
export const robotsService = {
  getAll: () => api.get<Robot[]>('/robots/'),
  getById: (id: number) => api.get<Robot>(`/robots/${id}/`),
  create: (data: Partial<Robot>) => api.post<Robot>('/robots/crear/', data),
  update: (id: number, data: Partial<Robot>) => api.patch<Robot>(`/robots/${id}/actualizar/`, data),
  delete: (id: number) => api.delete(`/robots/${id}/eliminar/`),
  getAlertas: () => api.get<Robot[]>('/robots/alertas/'),
};

// ============================================================
// Servicios de tanques (ViewSet con DefaultRouter)
// URLs: GET/POST '', GET/PUT/PATCH/DELETE '<id>/'
// ============================================================
export const tanquesService = {
  getAll: () => api.get<Tanque[]>('/tanques/'),
  getById: (id: number) => api.get<Tanque>(`/tanques/${id}/`),
  create: (data: Partial<Tanque>) => api.post<Tanque>('/tanques/', data),
  update: (id: number, data: Partial<Tanque>) => api.patch<Tanque>(`/tanques/${id}/`, data),
  delete: (id: number) => api.delete(`/tanques/${id}/`),
};

// ============================================================
// Servicios de jornadas
// URLs: GET '', POST 'crear/', GET '<pk>/', PATCH '<id>/actualizar/', DELETE '<id>/eliminar/'
// ============================================================
export const jornadasService = {
  getAll: () => api.get<Jornada[]>('/jornadas/'),
  getById: (id: number) => api.get<Jornada>(`/jornadas/${id}/`),
  create: (data: Partial<Jornada>) => api.post<Jornada>('/jornadas/crear/', data),
  update: (id: number, data: Partial<Jornada>) => api.patch<Jornada>(`/jornadas/${id}/actualizar/`, data),
  delete: (id: number) => api.delete(`/jornadas/${id}/eliminar/`),
  buscarPorFecha: (fecha: string) => api.get<Jornada[]>(`/jornadas/buscar/?fecha=${fecha}`),
};

// ============================================================
// Servicios de malezas (ViewSet con DefaultRouter)
// URLs: GET/POST '', GET/PUT/PATCH/DELETE '<id>/', detalle, buscar, por_tipo
// ============================================================
export const malezasService = {
  getAll: () => api.get<Maleza[]>('/malezas/'),
  getById: (id: number) => api.get<Maleza>(`/malezas/${id}/`),
  create: (data: Partial<Maleza>) => api.post<Maleza>('/malezas/', data),
  update: (id: number, data: Partial<Maleza>) => api.patch<Maleza>(`/malezas/${id}/`, data),
  delete: (id: number) => api.delete(`/malezas/${id}/`),
  getDetalle: (id: number) => api.get(`/malezas/${id}/detalle/`),
  updateDetalle: (id: number, data: any) => api.post(`/malezas/${id}/detalle/`, data),
  getDetectadas: () => api.get<MalezaDetectada[]>('/malezas/detectadas/'),
  getDetectadasPorJornada: (jornadaId: number) => api.get<MalezaDetectada[]>(`/malezas/detectadas/jornada/${jornadaId}/`),
};

// ============================================================
// Servicios de reportes
// ============================================================
export const reportesService = {
  getAll: () => api.get('/reportes/'),
  getById: (id: number) => api.get(`/reportes/${id}/`),
  create: (data: any) => api.post('/reportes/', data),
  update: (id: number, data: any) => api.patch(`/reportes/${id}/`, data),
  exportar: (id: number) => api.get(`/reportes/${id}/exportar/`),
};

// ============================================================
// Servicios de dashboard
// ============================================================
export const dashboardService = {
  getStats: (start: string, end: string) => api.get(`/dashboard/stats/?start_date=${start}&end_date=${end}`),
  getActivity: (start: string, end: string) => api.get(`/dashboard/activity/?start_date=${start}&end_date=${end}`),
  getRobotsStats: () => api.get('/dashboard/robots/'),
  getTanksStats: () => api.get('/dashboard/tanks/'),
  getWeedsStats: () => api.get('/dashboard/weeds/'),
};

// ============================================================
// Servicios de notificaciones
// ============================================================
export const notificacionesService = {
  getAll: () => api.get('/notificaciones/'),
  markAsRead: (id: number) => api.patch(`/notificaciones/${id}/marcar_leida/`),
  markAllAsRead: () => api.post('/notificaciones/marcar_todas_leidas/'),
  getUnreadCount: () => api.get('/notificaciones/no_leidas/'),
};

export default api;