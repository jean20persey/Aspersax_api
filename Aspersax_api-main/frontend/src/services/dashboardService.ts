import axios from './axiosConfig';
import { mockStats, mockActivityData, mockRobotStats, mockTankStats, mockWeedStats } from './mockData';

const USE_MOCK = true; // Cambiar a false cuando el backend esté listo

const dashboardService = {
  getStats: async (startDate: string, endDate: string) => {
    if (USE_MOCK) {
      return Promise.resolve({ data: mockStats });
    }
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return axios.get(`/api/dashboard/stats/?${params.toString()}`);
  },

  getActivityData: async (startDate: string, endDate: string) => {
    if (USE_MOCK) {
      return Promise.resolve({ data: mockActivityData });
    }
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return axios.get(`/api/dashboard/stats/activity/?${params.toString()}`);
  },

  getRobotStats: async () => {
    if (USE_MOCK) {
      return Promise.resolve({ data: mockRobotStats });
    }
    return axios.get('/api/dashboard/stats/robots/');
  },

  getTankStats: async () => {
    if (USE_MOCK) {
      return Promise.resolve({ data: mockTankStats });
    }
    return axios.get('/api/dashboard/stats/tanks/');
  },

  getWeedStats: async () => {
    if (USE_MOCK) {
      return Promise.resolve({ data: mockWeedStats });
    }
    return axios.get('/api/dashboard/stats/weeds/');
  }
};

export default dashboardService; 