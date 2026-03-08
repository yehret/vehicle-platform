import axios from 'axios';

export const vehicleClient = axios.create({
  baseURL: 'http://localhost:3002',
  withCredentials: true,
});

vehicleClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
