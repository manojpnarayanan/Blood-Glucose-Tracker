import api from './client';

export const reportApi = {
  getDailyReport: async (date, page = 1) => {
    const res = await api.get(`/reports/daily?date=${date}&page=${page}&limit=10`);
    return res.data;
  },

  getMonthToDateReport: async (date, page = 1) => {
    const res = await api.get(`/reports/month-to-date?date=${date}&page=${page}&limit=10`);
    return res.data;
  },

  getMonthlyReport: async (date, page = 1) => {
    const res = await api.get(`/reports/monthly?date=${date}&page=${page}&limit=10`);
    return res.data;
  },
};