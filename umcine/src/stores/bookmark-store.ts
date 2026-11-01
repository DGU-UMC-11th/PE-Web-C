import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkState {
  bookmarkedIds: number[];
  toggleBookmark: (movieId: number) => void;
}

// 목록·검색·상세 화면이 같은 북마크 상태를 쓰도록 전역 store로 관리해요.
// persist 미들웨어로 북마크한 영화 ID를 localStorage에 저장하고, 앱을 다시 열 때 복원해요.
export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set) => ({
      bookmarkedIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedIds: state.bookmarkedIds.includes(movieId)
            ? state.bookmarkedIds.filter((id) => id !== movieId)
            : [...state.bookmarkedIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",
      storage: createJSONStorage(() => localStorage),
      // 함수는 저장할 수 없으니 영화 ID 배열만 저장해요.
      partialize: (state) => ({ bookmarkedIds: state.bookmarkedIds }),
    },
  ),
);

// 컴포넌트가 특정 영화의 북마크 여부만 구독하도록 selector hook을 제공해요.
export function useIsBookmarked(movieId: number) {
  return useBookmarkStore((state) => state.bookmarkedIds.includes(movieId));
}
