import axios from "axios";

export const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  async (error) => await Promise.reject(error),
);