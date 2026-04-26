import { Film } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { useServerFilteredMovies } from '../hooks/useServerFilteredMovies';
import { DataGrid } from './headless/DataGrid';
import type { Movie } from '../types/movie';

interface MoviesGridProps {
  searchQuery: string;
  emptyMessage?: string;
  onMovieClick?: (movie: Movie) => void;
  onMovieMenuClick?: (movie: Movie) => void;
}

/**
 * MoviesGrid - Uses headless DataGrid pattern
 * DataGrid handles loading/error/empty states and pagination logic
 * Consumer controls 100% of the UI via render props
 */
export function MoviesGrid({
  searchQuery,
  emptyMessage = 'No movies found',
  onMovieClick,
  onMovieMenuClick,
}: MoviesGridProps) {
  const { movies, loading, error } = useServerFilteredMovies(searchQuery);

  return (
    <DataGrid
      items={movies}
      loading={loading}
      error={error}
      renderItem={(movie) => (
        <MovieCard
          movie={movie}
          onClick={onMovieClick}
          onMenuClick={onMovieMenuClick}
        />
      )}
      renderLoading={() => (
        <div className="movies-empty">
          <Film size={64} />
          <h3>Loading movies...</h3>
        </div>
      )}
      renderError={(err) => (
        <div className="movies-empty">
          <Film size={64} />
          <h3>Error loading movies</h3>
          <p>{err}</p>
        </div>
      )}
      renderEmpty={() => (
        <div className="movies-empty">
          <Film size={64} />
          <h3>{emptyMessage}</h3>
          <p>Try adjusting your search or add a new movie.</p>
        </div>
      )}
      className="movies-grid"
    />
  );
}
