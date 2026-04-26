import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService } from '../services/movieService';
import type { MovieFormData, Movie } from '../types/movie';

interface UseCreateMovieResult {
  createMovie: (data: MovieFormData) => Promise<Movie | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

/**
 * Hook for creating a new movie
 *
 * Handles the creation flow with loading, error, and success states.
 * Automatically navigates to the movie details page on success.
 *
 * Usage:
 * const { createMovie, loading, error, success, reset } = useCreateMovie();
 *
 * const handleSubmit = async (formData: MovieFormData) => {
 *   const movie = await createMovie(formData);
 *   if (movie) {
 *     // Success - automatically navigates to /movie/:id
 *   }
 * };
 */
export function useCreateMovie(): UseCreateMovieResult {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createMovie = useCallback(
    async (data: MovieFormData): Promise<Movie | null> => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const newMovie = await movieService.createMovie(data);
        setSuccess(true);

        // Navigate to the new movie's details page
        navigate(`/movie/${newMovie.id}`, {
          state: { message: 'Movie created successfully!' },
        });

        return newMovie;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create movie';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    createMovie,
    loading,
    error,
    success,
    reset,
  };
}

export default useCreateMovie;
