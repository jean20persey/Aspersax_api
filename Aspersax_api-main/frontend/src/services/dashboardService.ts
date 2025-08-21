import axios from './axiosConfig';
<<<<<<< HEAD
import { mockStats, mockActivityData, mockRobotStats, mockTankStats, mockWeedStats } from './mockData';

const USE_MOCK = true; // Cambiar a false cuando el backend esté listo

const dashboardService = {
  getStats: async (startDate: string, endDate: string) => {
    if (USE_MOCK) {
      return Promise.resolve({ data: mockStats });
    }
=======

const dashboardService = {
  getStats: async (startDate: string, endDate: string) => {
>>>>>>> 30311b5 (Primer commit: API Aspersax)
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return axios.get(`/api/dashboard/stats/?${params.toString()}`);
  },

  getActivityData: async (startDate: string, endDate: string) => {
<<<<<<< HEAD
    if (USE_MOCK) {
      return Promise.resolve({ data: mockActivityData });
    }
=======
>>>>>>> 30311b5 (Primer commit: API Aspersax)
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return axios.get(`/api/dashboard/stats/activity/?${params.toString()}`);
  },

  getRobotStats: async () => {
<<<<<<< HEAD
    if (USE_MOCK) {
      return Promise.resolve({ data: mockRobotStats });
    }
=======
>>>>>>> 30311b5 (Primer commit: API Aspersax)
    return axios.get('/api/dashboard/stats/robots/');
  },

  getTankStats: async () => {
<<<<<<< HEAD
    if (USE_MOCK) {
      return Promise.resolve({ data: mockTankStats });
    }
=======
>>>>>>> 30311b5 (Primer commit: API Aspersax)
    return axios.get('/api/dashboard/stats/tanks/');
  },

  getWeedStats: async () => {
<<<<<<< HEAD
    if (USE_MOCK) {
      return Promise.resolve({ data: mockWeedStats });
    }
    return axios.get('/api/dashboard/stats/weeds/');
=======
    return axios.get('/api/dashboard/stats/weeds/');
  },

  // Nuevos métodos para datos mejorados
  getEnhancedStats: async (startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return axios.get(`/api/dashboard/enhanced-stats/?${params.toString()}`);
  },

  getRealTimeData: async () => {
    return axios.get('/api/dashboard/realtime/');
  },

  getPerformanceMetrics: async (startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return axios.get(`/api/dashboard/performance/?${params.toString()}`);
  },

  // Método de prueba para verificar conexión
  testConnection: async () => {
    return axios.get('/api/dashboard/test/');
>>>>>>> 30311b5 (Primer commit: API Aspersax)
  }
};

export default dashboardService; 