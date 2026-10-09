import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const safeStorage = {
  getItem: (name: string) => {
    try {
      return localStorage.getItem(name);
    } catch (error) {
      console.warn("localStorage 읽기에 실패했습니다.", error);
      return null;
    }
  },

  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.warn("localStorage 저장에 실패했습니다.", error);
    }
  },

  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.warn("localStorage 삭제에 실패했습니다.", error);
    }
  },
};

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

      storage: createJSONStorage(() => safeStorage),

      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
    },
  ),
);
