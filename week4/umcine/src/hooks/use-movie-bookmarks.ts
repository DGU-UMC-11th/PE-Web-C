import { useMemo } from "react";
import { movies } from "../data/movies";
import { useBookmarkStore } from "../stores/bookmark-store";

export function useMovieBookmarks() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const movieList = useMemo(
    () =>
      movies.map((movie) => ({
        ...movie,
        isBookmarked: bookmarkedMovieIds.includes(movie.id),
      })),
    [bookmarkedMovieIds],
  );

  return { movieList, toggleBookmark };
}