import { MovieCardCompound } from './compound';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onMenuClick?: (movie: Movie) => void;
  onClick?: (movie: Movie) => void;
}

/**
 * MovieCard - Simple wrapper around MovieCardCompound
 *
 * Uses the compound component's default layout which includes:
 * - Image error handling (fallback to placeholder)
 * - Poster with status badge
 * - Title, director, meta info (duration, rating, date)
 * - Genre tags
 * - Optional menu button
 */
export function MovieCard({ movie, onMenuClick, onClick }: MovieCardProps) {
  return (
    <MovieCardCompound
      movie={movie}
      onClick={onClick}
      onMenuClick={onMenuClick}
    />
  );
}
