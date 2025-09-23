import axios from 'axios';

const API_BASE = 'http://localhost:9500/api/v1';

export const fetchWrapper = {
  get: (url) => axios.get(`${API_BASE}${url}`),
  post: (url, data) => axios.post(`${API_BASE}${url}`, data),
  put: (url, data) => axios.put(`${API_BASE}${url}`, data),
  delete: (url) => axios.delete(`${API_BASE}${url}`),
};
