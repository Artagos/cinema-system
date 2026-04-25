import { Film } from 'lucide-react';
import { MovieCard } from './MovieCard';
import type { Movie } from '../types/movie';

interface MoviesGridProps {
  movies: Movie[];
  emptyMessage?: string;
  onMovieClick?: (movie: Movie) => void;
  onMovieMenuClick?: (movie: Movie) => void;
}

export function MoviesGrid({
  movies,
  emptyMessage = 'No movies found',
  onMovieClick,
  onMovieMenuClick
}: MoviesGridProps) {
  if (movies.length === 0) {
    return (
      <div className="movies-empty">
        <Film size={64} />
        <h3>{emptyMessage}</h3>
        <p>Try adjusting your search or add a new movie.</p>
      </div>
    );
  }

  return (
    <div className="movies-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={onMovieClick}
          onMenuClick={onMovieMenuClick}
        />
      ))}
    </div>
  );
}
