import { create } from "zustand";

// GET/PATCH /members/me 연동 전(8주차)까지 내 정보 화면에 보여줄 임시 값이에요.
interface MyInfoStore {
  email: string;
  nickname: string;
  createdAt: string;
  updateNickname: (nickname: string) => void;
}

export const useMyInfoStore = create<MyInfoStore>()((set) => ({
  email: "movie@umc.com",
  nickname: "영화광",
  createdAt: "2026-09-02T21:14:03",
  updateNickname: (nickname) => set({ nickname }),
}));
