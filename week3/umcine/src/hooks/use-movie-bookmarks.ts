import { useEffect, useState } from "react";
import { movies } from "../data/movies";

const STORAGE_KEY = "umcine:bookmarks";

function readBookmarks(): Record<string, boolean> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([, bookmarked]) => typeof bookmarked === "boolean"));
  } catch {
    return {};
  }
}

export function useMovieBookmarks() {
  const [bookmarks, setBookmarks] = useState(readBookmarks);
  useEffect(() => {
      function syncBookmarks(event: StorageEvent) {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      setBookmarks(readBookmarks());
    }
    window.addEventListener("storage", syncBookmarks);
    return () => window.removeEventListener("storage", syncBookmarks);
  }, []);
  const movieList = movies.map((movie) => ({ ...movie, isBookmarked: bookmarks[movie.id] ?? movie.isBookmarked }));

  function toggleBookmark(movieId: number) {
    const movie = movieList.find((item) => item.id === movieId);
    if (!movie) return;
    const next = { ...readBookmarks(), [movieId]: !movie.isBookmarked };
    setBookmarks(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Bookmark toggling still works when browser storage is unavailable.
    }
  }

  return { movieList, toggleBookmark };
}
