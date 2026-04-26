import { useMemo, useDeferredValue } from 'react';
import type { Movie } from '../types/movie';

interface UseFilteredMoviesOptions {
  simulateHeavyComputation?: boolean;
  computationIterations?: number;
  useDeferred?: boolean; // Toggle useDeferredValue to showcase difference
}

/**
 * Custom hook for filtering movies with optional heavy computation simulation.
 * Can toggle useDeferredValue to showcase difference between immediate vs deferred filtering.
 */
export function useFilteredMovies(
  movies: Movie[],
  searchQuery: string,
  options: UseFilteredMoviesOptions = {}
): Movie[] {
  const { 
    simulateHeavyComputation = false, 
    computationIterations = 10000,
    useDeferred = true 
  } = options;
  
  // Conditionally defer the search query based on useDeferred option
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const effectiveSearchQuery = useDeferred ? deferredSearchQuery : searchQuery;

  const filteredMovies = useMemo(() => {
    const search = effectiveSearchQuery.toLowerCase();
    
    return movies.filter(movie => {
      // Simulate heavy computation if enabled (for testing concurrent features)
      if (simulateHeavyComputation) {
        let hash = 0;
        for (let i = 0; i < computationIterations; i++) {
          hash = ((hash << 5) - hash) + movie.title.charCodeAt(i % movie.title.length);
          hash = hash & hash;
        }
      }

      // Empty search returns all movies
      if (!search) return true;
      
      return (
        movie.title.toLowerCase().includes(search) ||
        movie.genre.some(g => g.toLowerCase().includes(search))
      );
    });
  }, [movies, effectiveSearchQuery, simulateHeavyComputation, computationIterations]);

  return filteredMovies;
}
