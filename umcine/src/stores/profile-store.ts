import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Profile {
  email: string;
  nickname: string;
}

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  updateNickname: (nickname: string) => void;
  clearProfile: () => void;
}

// 7주차에는 로그인 API를 연결하지 않아요(8주차). 내 정보 조회·수정 화면이 "입력한 값이 반영되는지"를
// 확인할 수 있도록, 회원가입·로그인 폼에서 입력한 값을 브라우저에 저장해 두는 임시 store예요.
// 8주차에 로그인 API와 토큰이 생기면 GET /members/me 응답으로 대체해요.
export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      updateNickname: (nickname) =>
        set((state) => (state.profile ? { profile: { ...state.profile, nickname } } : state)),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: "umcine-profile-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
