/**
 * MoviesGridCompound - Alternative using MovieCardCompound
 *
 * This demonstrates the compound component pattern for layout flexibility.
 * Compare with MoviesGrid.tsx which uses standard MovieCard.
 *
 * Usage: Switch between them to see different layouts
 * <MoviesGridCompound searchQuery={query} onMovieClick={handleClick} />
 */

import { Film, Star, Clock } from 'lucide-react';
import { useServerFilteredMovies } from '../hooks/useServerFilteredMovies';
import { DataGrid } from './headless/DataGrid';
import { MovieCardCompound } from './compound/MovieCardCompound';
import type { Movie } from '../types/movie';

interface MoviesGridCompoundProps {
  searchQuery: string;
  emptyMessage?: string;
  onMovieClick?: (movie: Movie) => void;
  onMovieMenuClick?: (movie: Movie) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * Compact Card Layout
 * Uses compound components to show minimal info
 */
function CompactMovieCard({ movie, onClick }: { movie: Movie; onClick?: (m: Movie) => void }) {
  return (
    <MovieCardCompound movie={movie} onClick={onClick}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px' }}>
        <div style={{ width: '60px', flexShrink: 0 }}>
          <MovieCardCompound.Poster />
        </div>
        <div style={{ minWidth: 0 }}>
          <MovieCardCompound.Title />
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '12px', color: '#666' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={12} />
              {movie.rating}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              {movie.duration}m
            </span>
          </div>
        </div>
      </div>
    </MovieCardCompound>
  );
}

/**
 * Detailed Card Layout
 * Uses compound components with custom arrangement
 */
function DetailedMovieCard({
  movie,
  onClick,
  onMenuClick
}: {
  movie: Movie;
  onClick?: (m: Movie) => void;
  onMenuClick?: (m: Movie) => void;
}) {
  return (
    <MovieCardCompound movie={movie} onClick={onClick} onMenuClick={onMenuClick}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <MovieCardCompound.Poster />
        <MovieCardCompound.Content>
          {/* Custom header: Menu button first */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <MovieCardCompound.MenuButton />
            <MovieCardCompound.Title />
          </div>
          <MovieCardCompound.Director />
          <MovieCardCompound.Meta />
          {/* Show more genres */}
          <MovieCardCompound.Genres limit={10} />
        </MovieCardCompound.Content>
      </div>
    </MovieCardCompound>
  );
}

/**
 * MoviesGridCompound - Headless DataGrid + Compound MovieCard
 *
 * Demonstrates:
 * 1. Headless DataGrid for state management
 * 2. Compound MovieCard for layout flexibility
 * 3. Multiple layout variants without prop drilling
 */
export function MoviesGridCompound({
  searchQuery,
  emptyMessage = 'No movies found',
  onMovieClick,
  onMovieMenuClick,
  variant = 'default'
}: MoviesGridCompoundProps) {
  const { movies, loading, error } = useServerFilteredMovies(searchQuery);

  // Select card component based on variant
  const renderMovieCard = (movie: Movie) => {
    switch (variant) {
      case 'compact':
        return <CompactMovieCard movie={movie} onClick={onMovieClick} />;
      case 'detailed':
        return (
          <DetailedMovieCard
            movie={movie}
            onClick={onMovieClick}
            onMenuClick={onMovieMenuClick}
          />
        );
      default:
        // Default: Use MovieCardCompound with standard layout
        return (
          <MovieCardCompound
            movie={movie}
            onClick={onMovieClick}
            onMenuClick={onMovieMenuClick}
          />
        );
    }
  };

  return (
    <DataGrid
      items={movies}
      loading={loading}
      error={error}
      renderItem={renderMovieCard}
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

export default MoviesGridCompound;
