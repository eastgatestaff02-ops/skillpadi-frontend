import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const readToken = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: readToken('access_token'),
      refreshToken: readToken('refresh_token'),
      user: null,
      mode: null,
      setAuth: (access, refresh, user) => {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        set({ accessToken: access, refreshToken: refresh, user });
      },
      setAccessToken: (access) => {
        localStorage.setItem('access_token', access);
        set({ accessToken: access });
      },
      setUser: (user) => set({ user }),
      setMode: (mode) => set({ mode }),
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ accessToken: null, refreshToken: null, user: null, mode: null });
      },
    }),
    {
      name: 'skillpadi-auth',
      partialize: (state) => ({ user: state.user, mode: state.mode }),
    }
  )
);