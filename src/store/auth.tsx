// src/store/auth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  email: string;
  name?: string;
  id?: string;
};

type AuthStore = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
};

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      // Development mode - comment out these lines for production
      user: { email: "dev@example.com", name: "Dev User", id: "dev-123" },
      token: "dev-token-12345",
      isAuthenticated: true,

      // Production mode - uncomment these lines for production
      // user: null,
      // token: null,
      // isAuthenticated: false,

      setAuth: (user: User, token: string) => {
        localStorage.setItem("token", token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        window.location.href = "/login";
      },

      initializeAuth: () => {
        const token = localStorage.getItem("token");
        if (token) {
          // You can decode JWT here to get user info or make API call
          // For now, just check if token exists
          try {
            // Basic JWT decode (you might want to use a library like jwt-decode)
            const payload = JSON.parse(atob(token.split(".")[1]));
            const isExpired = payload.exp * 1000 < Date.now();

            if (!isExpired) {
              set({
                token,
                isAuthenticated: true,
                user: payload.user || { email: payload.email },
              });
            } else {
              // Token expired, remove it
              localStorage.removeItem("token");
              set({ user: null, token: null, isAuthenticated: false });
            }
          } catch (error) {
            // Invalid token, remove it
            localStorage.removeItem("token");
            set({ user: null, token: null, isAuthenticated: false });
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
