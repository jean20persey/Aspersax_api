import axios from './axiosConfig';

const dashboardService = {
  getStats: async (startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return axios.get(`/api/dashboard/stats/?${params.toString()}`);
  },

  getActivityData: async (startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return axios.get(`/api/dashboard/activity/?${params.toString()}`);
  },

  getRobotStats: async () => {
    return axios.get('/api/dashboard/robots/');
  },

  getTankStats: async () => {
    return axios.get('/api/dashboard/tanks/');
  },

  getWeedStats: async () => {
    return axios.get('/api/dashboard/weeds/');
  }
};

export default dashboardService; 