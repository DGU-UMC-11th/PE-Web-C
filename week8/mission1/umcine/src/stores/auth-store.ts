import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { cancelPendingLogin } from "../utils/login-request";

interface AuthState {
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      signOut: () => {
        cancelPendingLogin();
        set({ accessToken: null });
      },
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ accessToken }) => ({ accessToken }),
    },
  ),
);
