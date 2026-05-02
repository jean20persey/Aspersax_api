import axios from './axiosConfig';

const dashboardService = {
  getStats: async (startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return axios.get(`/dashboard/stats/?${params.toString()}`);
  },

  getActivityData: async (startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return axios.get(`/dashboard/activity/?${params.toString()}`);
  },

  getRobotStats: async () => {
    return axios.get('/dashboard/robots/');
  },

  getTankStats: async () => {
    return axios.get('/dashboard/tanks/');
  },

  getWeedStats: async () => {
    return axios.get('/dashboard/weeds/');
  }
};

export default dashboardService; 