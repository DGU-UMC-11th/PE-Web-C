
import { create } from "zustand";
import { useBookmarkNoticeStore } from "./bookmark-notice-store";

const storageFailureMessage = "북마크를 이 브라우저에 저장하지 못했어요. 새로고침하면 변경 내용이 사라질 수 있어요.";
const bookmarkStorage = {
  getItem: (name: string) => {
    try { return localStorage.getItem(name); }
    catch {
      useBookmarkNoticeStore.getState().setMessage("저장된 북마크를 불러오지 못했어요.");
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
      useBookmarkNoticeStore.getState().setMessage("");
    } catch {
      useBookmarkNoticeStore.getState().setMessage(storageFailureMessage);
    }
  },
  removeItem: (name: string) => {
    try { localStorage.removeItem(name); }
    catch { useBookmarkNoticeStore.getState().setMessage(storageFailureMessage); }
  },
};
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
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
      storage: createJSONStorage(() => bookmarkStorage),
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),

      merge: (persistedState, currentState) => {
        const saved = persistedState as {
          bookmarkedMovieIds?: unknown;
        } | null;

        const ids = saved?.bookmarkedMovieIds;

        return {
          ...currentState,
          bookmarkedMovieIds: Array.isArray(ids)
            ? ids.filter(
                (id): id is number =>
                  typeof id === "number" &&
                  Number.isInteger(id)
              )
            : [],
        };
      },
    }
  )
);
