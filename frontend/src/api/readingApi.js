import api from './client';

export const readingApi = {
  
  getDailyReadings: async (date) => {
    const res = await api.get(`/readings?date=${date}`);
    return res.data;
  },

  
  createReading: async ({ date, slot, value }) => {
    const res = await api.post('/readings', { date, slot, value });
    return res.data;
  },

  
  updateReading: async (id, { date, slot, value }) => {
    const res = await api.put(`/readings/${id}`, { date, slot, value });
    return res.data;
  },

  
  deleteReading: async (id) => {
    const res = await api.delete(`/readings/${id}`);
    return res.data;
  },
};