import { create } from 'zustand';
import { userClient } from '../api/userClient';
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
      const { data } = await userClient.get<User>('/auth/me');
      set({ user: data, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      await userClient.post('/auth/login', credentials);
      const { data } = await userClient.get<User>('/auth/me');
      set({ user: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await userClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, isLoading: false });

      window.location.href = '/login';
    }
  },
}));
