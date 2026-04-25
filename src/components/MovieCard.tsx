import { Film, Clock, Star, CalendarDays, MoreVertical } from 'lucide-react';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onMenuClick?: (movie: Movie) => void;
  onClick?: (movie: Movie) => void;
}

export function MovieCard({ movie, onMenuClick, onClick }: MovieCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuClick?.(movie);
  };

  return (
    <div className="movie-card" onClick={() => onClick?.(movie)}>
      <div className="movie-poster">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} />
        ) : (
          <div className="poster-placeholder">
            <Film size={48} />
          </div>
        )}
        <span className={`movie-status ${movie.isActive ? 'active' : 'inactive'}`}>
          {movie.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="movie-info">
        <div className="movie-header">
          <h3>{movie.title}</h3>
          {onMenuClick && (
            <button className="menu-btn" onClick={handleMenuClick}>
              <MoreVertical size={18} />
            </button>
          )}
        </div>
        <p className="movie-director">Directed by {movie.director}</p>
        <div className="movie-meta">
          <span className="meta-item">
            <Clock size={14} />
            {formatDuration(movie.duration)}
          </span>
          <span className="meta-item">
            <Star size={14} />
            {movie.rating}
          </span>
          <span className="meta-item">
            <CalendarDays size={14} />
            {formatDate(movie.releaseDate)}
          </span>
        </div>
        <div className="movie-genres">
          {movie.genre.slice(0, 3).map((g, i) => (
            <span key={i} className="genre-tag">{g}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
