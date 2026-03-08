import axios from 'axios';

export const userClient = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

userClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
