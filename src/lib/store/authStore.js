import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenStorage } from '@/lib/utils/tokenStorage';

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: tokenStorage.get('access_token'),
      refreshToken: tokenStorage.get('refresh_token'),
      user: null,
      mode: null,
      setAuth: (access, refresh, user, remember = true) => {
        tokenStorage.setRemember(remember);
        tokenStorage.set('access_token', access);
        tokenStorage.set('refresh_token', refresh);
        set({ accessToken: access, refreshToken: refresh, user });
      },
      setAccessToken: (access) => {
        tokenStorage.set('access_token', access);
        set({ accessToken: access });
      },
      setUser: (user) => set({ user }),
      setMode: (mode) => set({ mode }),
      logout: () => {
        tokenStorage.clear();
        set({ accessToken: null, refreshToken: null, user: null, mode: null });
      },
    }),
    {
      name: 'skillpadi-auth',
      partialize: (state) => ({ user: state.user, mode: state.mode }),
    }
  )
);