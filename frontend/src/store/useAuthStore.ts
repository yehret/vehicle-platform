import { create } from 'zustand';
import { apiClient } from '../api/axios';
import type { User } from '../types/User';

interface LoginCredentials {
  email: string;
  password?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const { data } = await apiClient.get<User>('/auth/me');
      set({ user: data, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  login: async (credentials) => {
    await apiClient.post('/auth/login', credentials);
    const { data } = await apiClient.get<User>('/auth/me');
    set({ user: data });
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      set({ user: null });
      window.location.href = '/login';
    }
  },
}));
