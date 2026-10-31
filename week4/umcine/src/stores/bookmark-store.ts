import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

function isValidMovieId(movieId: unknown): movieId is number {
  return typeof movieId === "number" && Number.isInteger(movieId) && movieId > 0;
}

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
      name: "umcine-bookmark-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
      // 저장값은 사용자가 바꿀 수 있으므로 양의 정수 ID만 복원해요.
      merge: (persistedState, currentState) => {
        const storedIds = (persistedState as { bookmarkedMovieIds?: unknown })
          ?.bookmarkedMovieIds;

        return {
          ...currentState,
          bookmarkedMovieIds: Array.isArray(storedIds)
            ? storedIds.filter(isValidMovieId)
            : [],
        };
      },
    },
  ),
);
