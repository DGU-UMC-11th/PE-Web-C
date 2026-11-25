import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
      // 서버에는 localStorage가 없어서, 처음 HTML은 항상 로그아웃 상태로 만들고
      // 브라우저에서 화면이 붙은 뒤(Providers의 useEffect)에 저장된 토큰을 읽어요.
      // 바로 읽으면 서버 HTML과 첫 화면이 달라 hydration 오류가 나요.
      skipHydration: true,
    },
  ),
);

// 저장된 토큰을 다 읽었는지 알려 줘요. 읽기 전에는 "로그인 안 함"과 "아직 모름"을 구분할 수 없어요.
export function useAuthHydrated() {
  return useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
