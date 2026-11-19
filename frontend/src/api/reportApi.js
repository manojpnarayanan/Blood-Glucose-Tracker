import api from './client';

export const reportApi = {
  getDailyReport: async (date) => {
    const res = await api.get(`/reports/daily?date=${date}`);
    return res.data;
  },

  getMonthToDateReport: async (date) => {
    const res = await api.get(`/reports/month-to-date?date=${date}`);
    return res.data;
  },

  getMonthlyReport: async (date) => {
    const res = await api.get(`/reports/monthly?date=${date}`);
    return res.data;
  },
};