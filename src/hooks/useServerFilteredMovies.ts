import { useState, useEffect, useCallback, useRef } from 'react';
import { movieService } from '../services/movieService';
import type { Movie } from '../types/movie';

interface UseServerFilteredMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for server-side filtering simulation.
 * Every search input change triggers an API request with simulated delay.
 * Includes debouncing to avoid excessive requests while typing.
 */
export function useServerFilteredMovies(
  searchQuery: string,
  debounceMs: number = 300
): UseServerFilteredMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Use ref for timeout to handle cleanup properly
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchFilteredMovies = useCallback(async (query: string, signal: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const results = await movieService.searchMovies(query);

      // Check if request was aborted before updating state
      if (!signal.aborted) {
        setMovies(results);
      }
    } catch (err) {
      if (!signal.aborted) {
        setError(err instanceof Error ? err.message : 'Failed to search movies');
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // Cancel any pending debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Debounce the API call
    debounceTimeoutRef.current = setTimeout(() => {
      fetchFilteredMovies(searchQuery, abortController.signal);
    }, debounceMs);

    // Cleanup on unmount or when query changes
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      abortController.abort();
    };
  }, [searchQuery, debounceMs, fetchFilteredMovies]);

  return {
    movies,
    loading,
    error
  };
}
