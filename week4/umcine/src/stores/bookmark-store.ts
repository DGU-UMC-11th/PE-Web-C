import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const BOOKMARK_STORE_KEY = "umcine-bookmark-store";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

// 목록·검색·상세 화면이 같은 북마크 상태를 공유하는 전역 store예요.
// persist로 북마크 ID 배열만 localStorage에 저장해서 새로고침/브라우저 재실행 뒤에도 유지돼요.
export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarkedMovieIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: BOOKMARK_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      // action(함수)은 저장할 수 없으니 북마크 ID 배열만 골라 저장해요.
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
      // 사용자가 개발자 도구에서 값을 망가뜨려도 양의 정수 ID만 복원해요.
      merge: (persistedState, currentState) => {
        const storedIds = (persistedState as Partial<BookmarkStore> | undefined)
          ?.bookmarkedMovieIds;

        return {
          ...currentState,
          bookmarkedMovieIds: Array.isArray(storedIds)
            ? storedIds.filter(
                (movieId): movieId is number =>
                  typeof movieId === "number" &&
                  Number.isInteger(movieId) &&
                  movieId > 0,
              )
            : [],
        };
      },
    },
  ),
);

// 컴포넌트에서 "이 영화가 북마크됐는지"만 골라 쓰는 selector 훅이에요.
export function useIsBookmarked(movieId: number) {
  return useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
}
