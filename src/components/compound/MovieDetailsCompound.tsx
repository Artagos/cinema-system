/**
 * MovieDetails Compound Component Pattern
 *
 * Allows consumers to control the layout while the component
 * provides the data context and default sub-components for detailed movie views.
 *
 * Usage:
 * <MovieDetailsCompound movie={movie}>
 *   <MovieDetailsCompound.Header>
 *     <MovieDetailsCompound.BackButton onClick={handleBack} />
 *     <MovieDetailsCompound.Poster />
 *   </MovieDetailsCompound.Header>
 *   <MovieDetailsCompound.Content>
 *     <MovieDetailsCompound.Title />
 *     <MovieDetailsCompound.Meta />
 *     <MovieDetailsCompound.Genres />
 *     <MovieDetailsCompound.Description />
 *     <MovieDetailsCompound.Cast />
 *   </MovieDetailsCompound.Content>
 * </MovieDetailsCompound>
 *
 * Or use the default layout:
 * <MovieDetailsCompound movie={movie} onBack={handleBack} />
 */

import { createContext, useContext, useState, type ReactNode } from 'react';
import { Clock, Star, CalendarDays, Users, ArrowLeft, Film } from 'lucide-react';
import type { Movie } from '../../types/movie';

// --- Context for data sharing between compound components ---
interface MovieDetailsContextValue {
  movie: Movie;
  onBack?: () => void;
}

const MovieDetailsContext = createContext<MovieDetailsContextValue | null>(null);

function useMovieDetails() {
  const context = useContext(MovieDetailsContext);
  if (!context) {
    throw new Error('MovieDetails sub-components must be used within MovieDetailsCompound');
  }
  return context;
}

// --- Layout Components ---

interface MovieDetailsCompoundProps {
  movie: Movie;
  children?: ReactNode;
  onBack?: () => void;
}

function MovieDetailsRoot({ movie, children, onBack }: MovieDetailsCompoundProps) {
  const value: MovieDetailsContextValue = { movie, onBack };

  // If no children provided, render default layout
  if (!children) {
    return (
      <MovieDetailsContext.Provider value={value}>
        <div className="movie-details">
          <MovieDetailsHeader>
            <MovieDetailsBackButton />
          </MovieDetailsHeader>
          <div className="movie-details-layout">
            <MovieDetailsPoster large />
            <MovieDetailsContent>
              <MovieDetailsTitle />
              <MovieDetailsMeta detailed />
              <MovieDetailsGenres />
              <MovieDetailsDescription />
              <MovieDetailsCast />
            </MovieDetailsContent>
          </div>
        </div>
      </MovieDetailsContext.Provider>
    );
  }

  return (
    <MovieDetailsContext.Provider value={value}>
      <div className="movie-details">{children}</div>
    </MovieDetailsContext.Provider>
  );
}

// --- Sub-components ---

function MovieDetailsHeader({ children }: { children?: ReactNode }) {
  return <div className="movie-details-header">{children}</div>;
}

function MovieDetailsBackButton() {
  const { onBack } = useMovieDetails();

  if (!onBack) return null;

  return (
    <button className="back-button" onClick={onBack}>
      <ArrowLeft size={20} />
      <span>Back to Movies</span>
    </button>
  );
}

interface PosterProps {
  large?: boolean;
}

function MovieDetailsPoster({ large = false }: PosterProps) {
  const { movie } = useMovieDetails();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`movie-details-poster ${large ? 'large' : ''}`}>
      {movie.posterUrl && !imageError ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          onError={handleImageError}
        />
      ) : (
        <div className="poster-placeholder-large">
          <Film size={large ? 64 : 32} />
        </div>
      )}
      <span className={`movie-status-large ${movie.isActive ? 'active' : 'inactive'}`}>
        {movie.isActive ? 'Now Showing' : 'Coming Soon'}
      </span>
    </div>
  );
}

function MovieDetailsContent({ children }: { children?: ReactNode }) {
  return <div className="movie-details-content">{children}</div>;
}

function MovieDetailsTitle() {
  const { movie } = useMovieDetails();
  return <h1 className="movie-details-title">{movie.title}</h1>;
}

interface MetaProps {
  detailed?: boolean;
}

function MovieDetailsMeta({ detailed = false }: MetaProps) {
  const { movie } = useMovieDetails();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`movie-details-meta ${detailed ? 'detailed' : ''}`}>
      <div className="meta-block">
        <Clock size={detailed ? 20 : 16} />
        <div>
          <span className="meta-label">Duration</span>
          <span className="meta-value">{formatDuration(movie.duration)}</span>
        </div>
      </div>
      <div className="meta-divider" />
      <div className="meta-block">
        <Star size={detailed ? 20 : 16} />
        <div>
          <span className="meta-label">Rating</span>
          <span className="meta-value">{movie.rating}</span>
        </div>
      </div>
      <div className="meta-divider" />
      <div className="meta-block">
        <CalendarDays size={detailed ? 20 : 16} />
        <div>
          <span className="meta-label">Release Date</span>
          <span className="meta-value">{formatDate(movie.releaseDate)}</span>
        </div>
      </div>
      {detailed && (
        <>
          <div className="meta-divider" />
          <div className="meta-block">
            <Users size={20} />
            <div>
              <span className="meta-label">Cast</span>
              <span className="meta-value">{movie.cast.length} Actors</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MovieDetailsGenres() {
  const { movie } = useMovieDetails();

  return (
    <div className="movie-details-genres">
      {movie.genre.map((g, i) => (
        <span key={i} className="genre-tag-large">
          {g}
        </span>
      ))}
    </div>
  );
}

function MovieDetailsDescription() {
  const { movie } = useMovieDetails();

  return (
    <div className="movie-details-description">
      <h3>Synopsis</h3>
      <p>{movie.description}</p>
    </div>
  );
}

function MovieDetailsDirector() {
  const { movie } = useMovieDetails();

  return (
    <div className="movie-details-director">
      <h3>Director</h3>
      <p>{movie.director}</p>
    </div>
  );
}

function MovieDetailsCast() {
  const { movie } = useMovieDetails();

  return (
    <div className="movie-details-cast">
      <h3>Cast</h3>
      <div className="cast-list">
        {movie.cast.map((actor, i) => (
          <div key={i} className="cast-item">
            <div className="cast-avatar">
              <Users size={16} />
            </div>
            <span className="cast-name">{actor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Attach sub-components to root ---

export const MovieDetailsCompound = Object.assign(MovieDetailsRoot, {
  Header: MovieDetailsHeader,
  BackButton: MovieDetailsBackButton,
  Poster: MovieDetailsPoster,
  Content: MovieDetailsContent,
  Title: MovieDetailsTitle,
  Meta: MovieDetailsMeta,
  Genres: MovieDetailsGenres,
  Description: MovieDetailsDescription,
  Director: MovieDetailsDirector,
  Cast: MovieDetailsCast,
});

export default MovieDetailsCompound;
