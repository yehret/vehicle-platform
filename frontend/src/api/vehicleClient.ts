import axios from 'axios';

export const vehicleClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_VEHICLE,
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
