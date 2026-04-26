/**
 * MovieCard Compound Component Pattern
 * 
 * This allows consumers to control the layout while the component
 * provides the data context and default sub-components.
 * 
 * Usage:
 * <MovieCardCompound movie={movie}>
 *   <MovieCardCompound.Poster />
 *   <MovieCardCompound.Content>
 *     <MovieCardCompound.Header>
 *       <MovieCardCompound.Title />
 *       <MovieCardCompound.MenuButton onClick={handleMenu} />
 *     </MovieCardCompound.Header>
 *     <MovieCardCompound.Director />
 *     <MovieCardCompound.Meta />
 *     <MovieCardCompound.Genres />
 *   </MovieCardCompound.Content>
 * </MovieCardCompound>
 * 
 * Or use the default layout:
 * <MovieCardCompound movie={movie} onClick={handleClick} onMenuClick={handleMenu} />
 */

import { createContext, useContext, useState, type ReactNode } from 'react';
import { Film, Clock, Star, CalendarDays, MoreVertical } from 'lucide-react';
import type { Movie } from '../../types/movie';

// --- Context for data sharing between compound components ---
interface MovieCardContextValue {
  movie: Movie;
  onClick?: (movie: Movie) => void;
  onMenuClick?: (movie: Movie) => void;
}

const MovieCardContext = createContext<MovieCardContextValue | null>(null);

function useMovieCard() {
  const context = useContext(MovieCardContext);
  if (!context) {
    throw new Error('MovieCard sub-components must be used within MovieCardCompound');
  }
  return context;
}

// --- Layout Components ---

interface MovieCardCompoundProps {
  movie: Movie;
  children?: ReactNode;
  onClick?: (movie: Movie) => void;
  onMenuClick?: (movie: Movie) => void;
}

function MovieCardRoot({ movie, children, onClick, onMenuClick }: MovieCardCompoundProps) {
  const value: MovieCardContextValue = { movie, onClick, onMenuClick };

  // If no children provided, render default layout
  if (!children) {
    return (
      <MovieCardContext.Provider value={value}>
        <div className="movie-card" onClick={() => onClick?.(movie)}>
          <MovieCardPoster />
          <MovieCardContent>
            <MovieCardHeader>
              <MovieCardTitle />
              {onMenuClick && <MovieCardMenuButton />}
            </MovieCardHeader>
            <MovieCardDirector />
            <MovieCardMeta />
            <MovieCardGenres />
          </MovieCardContent>
        </div>
      </MovieCardContext.Provider>
    );
  }

  return (
    <MovieCardContext.Provider value={value}>
      <div className="movie-card" onClick={() => onClick?.(movie)}>
        {children}
      </div>
    </MovieCardContext.Provider>
  );
}

// --- Sub-components ---

function MovieCardPoster() {
  const { movie } = useMovieCard();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="movie-poster">
      {movie.posterUrl && !imageError ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          onError={handleImageError}
        />
      ) : (
        <div className="poster-placeholder">
          <Film size={48} />
        </div>
      )}
      <span className={`movie-status ${movie.isActive ? 'active' : 'inactive'}`}>
        {movie.isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
}

function MovieCardContent({ children }: { children?: ReactNode }) {
  return <div className="movie-info">{children}</div>;
}

function MovieCardHeader({ children }: { children?: ReactNode }) {
  return <div className="movie-header">{children}</div>;
}

function MovieCardTitle() {
  const { movie } = useMovieCard();
  return <h3>{movie.title}</h3>;
}

function MovieCardMenuButton() {
  const { movie, onMenuClick } = useMovieCard();

  if (!onMenuClick) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuClick(movie);
  };

  return (
    <button className="menu-btn" onClick={handleClick}>
      <MoreVertical size={18} />
    </button>
  );
}

function MovieCardDirector() {
  const { movie } = useMovieCard();
  return <p className="movie-director">Directed by {movie.director}</p>;
}

function MovieCardMeta() {
  const { movie } = useMovieCard();

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

  return (
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
  );
}

function MovieCardGenres({ limit = 3 }: { limit?: number }) {
  const { movie } = useMovieCard();

  return (
    <div className="movie-genres">
      {movie.genre.slice(0, limit).map((g, i) => (
        <span key={i} className="genre-tag">{g}</span>
      ))}
    </div>
  );
}

// --- Attach sub-components to root ---

export const MovieCardCompound = Object.assign(MovieCardRoot, {
  Poster: MovieCardPoster,
  Content: MovieCardContent,
  Header: MovieCardHeader,
  Title: MovieCardTitle,
  MenuButton: MovieCardMenuButton,
  Director: MovieCardDirector,
  Meta: MovieCardMeta,
  Genres: MovieCardGenres,
});

export default MovieCardCompound;
