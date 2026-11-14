import { create } from "zustand";

/**
 * 7주차에는 내 정보 API를 아직 붙이지 않아요(8주차 예정).
 * 화면을 먼저 만들어 두기 위해 값을 임시로 들고 있는 store예요.
 */
interface ProfileState {
  email: string;
  nickname: string;
  updateNickname: (nickname: string) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  email: "movie@umc.com",
  nickname: "영화광",
  updateNickname: (nickname) => set({ nickname }),
}));
