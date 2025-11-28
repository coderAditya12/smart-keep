import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        login: (userData) => set({ user: userData }),
        logout: () => set({ user: null }),
      }),
      {
        name: "smartkeep-storage", // Key name in localStorage
      }
    )
  )
);
