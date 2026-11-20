import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * 토큰은 서버가 원본을 가진 값이 아니라 "이 브라우저가 들고 다니는 출입증"이라
 * 서버 상태(query 캐시)가 아니라 클라이언트 상태(store)에 둬요.
 * persist로 localStorage에 저장해서 새로고침해도 로그인이 유지돼요.
 */
interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
