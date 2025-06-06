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
    return axios.get(`/api/dashboard/stats/activity/?${params.toString()}`);
  },

  getRobotStats: async () => {
    return axios.get('/api/dashboard/stats/robots/');
  },

  getTankStats: async () => {
    return axios.get('/api/dashboard/stats/tanks/');
  },

  getWeedStats: async () => {
    return axios.get('/api/dashboard/stats/weeds/');
  }
};

export default dashboardService; 