import { create } from "zustand";

// 알림은 저장하지 않아, 저장 실패를 알리다가 다시 저장하는 순환을 막아요.
export const useBookmarkNoticeStore = create<{
  message: string;
  setMessage: (message: string) => void;
}>((set) => ({ message: "", setMessage: (message) => set({ message }) }));
