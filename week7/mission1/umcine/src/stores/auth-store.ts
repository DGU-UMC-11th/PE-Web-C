import { create } from "zustand";
import { cancelPendingLogin } from "../utils/login-request";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  nickname: string;
  signIn: (accessToken: string, nickname: string) => void;
  signOut: () => void;
  setNickname: (nickname: string) => void;
}

// 같은 탭에서 새로고침해도 로그인을 유지해요. 비밀번호는 저장하지 않아요.
export const useAuthStore = create<AuthState>()(persist((set) => ({
  accessToken: null,
  nickname: "",
  signIn: (accessToken, nickname) => set({ accessToken, nickname }),
  signOut: () => {
    cancelPendingLogin();
    set({ accessToken: null, nickname: "" });
  },
  setNickname: (nickname) => set({ nickname }),
}), {
  name: "umcine-auth",
  storage: createJSONStorage(() => sessionStorage),
  partialize: ({ accessToken, nickname }) => ({ accessToken, nickname }),
}));
