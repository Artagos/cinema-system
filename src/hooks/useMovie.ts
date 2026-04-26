import { useState, useEffect, useCallback } from 'react';
import { movieService } from '../services/movieService';
import type { Movie } from '../types/movie';

interface UseMovieResult {
  movie: Movie | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching a single movie by ID.
 * Includes loading state, error handling, and refetch capability.
 *
 * Usage:
 * const { movie, loading, error, refetch } = useMovie(movieId);
 *
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} onRetry={refetch} />;
 * if (!movie) return <NotFound />;
 *
 * return <MovieDetails movie={movie} />;
 */
export function useMovie(movieId: string | undefined): UseMovieResult {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovie = useCallback(async () => {
    if (!movieId) {
      setMovie(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await movieService.getMovieById(movieId);
      if (result) {
        setMovie(result);
      } else {
        setError('Movie not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movie');
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  return {
    movie,
    loading,
    error,
    refetch: fetchMovie,
  };
}

export default useMovie;
