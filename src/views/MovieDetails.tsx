import { useParams, useNavigate } from 'react-router-dom';
import { Film, RefreshCw } from 'lucide-react';
import { useMovie } from '../hooks/useMovie';
import { MovieDetailsCompound } from '../components/compound';
// import { DataGrid } from '../components/headless';
import LoginButton from '../components/LoginButton';

/**
 * MovieDetails View - Public Movie Details Page
 *
 * Uses composition patterns:
 * - MovieDetailsCompound: Compound component for flexible movie details layout
 * - DataGrid (headless): For loading/error/empty state management
 * - useMovie hook: For data fetching with loading/error states
 *
 * Features:
 * - Public access (no authentication required)
 * - Deep linkable (/movie/:id)
 * - Loading and error states
 * - Responsive design
 */
export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { movie, loading, error, refetch } = useMovie(id);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Render content using headless DataGrid pattern for state management
  const renderContent = () => {
    // Loading state
    if (loading) {
      return (
        <div className="movie-details-loading">
          <Film size={64} />
          <h2>Loading movie details...</h2>
          <div className="loading-spinner" />
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="movie-details-error">
          <Film size={64} />
          <h2>Error Loading Movie</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={refetch}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      );
    }

    // Empty/not found state
    if (!movie) {
      return (
        <div className="movie-details-empty">
          <Film size={64} />
          <h2>Movie Not Found</h2>
          <p>The movie you're looking for doesn't exist or has been removed.</p>
          <button className="back-button-primary" onClick={() => navigate('/public-movies')}>
            Browse Movies
          </button>
        </div>
      );
    }

    // Success state - render movie details using compound component
    return (
      <MovieDetailsCompound movie={movie} onBack={handleBack}>
        <MovieDetailsCompound.Header>
          <MovieDetailsCompound.BackButton />
        </MovieDetailsCompound.Header>
        <div className="movie-details-layout">
          <MovieDetailsCompound.Poster large />
          <MovieDetailsCompound.Content>
            <MovieDetailsCompound.Title />
            <MovieDetailsCompound.Meta detailed />
            <MovieDetailsCompound.Genres />
            <MovieDetailsCompound.Description />
            <MovieDetailsCompound.Director />
            <MovieDetailsCompound.Cast />
          </MovieDetailsCompound.Content>
        </div>
      </MovieDetailsCompound>
    );
  };

  return (
    <div className="movie-details-page">
      <LoginButton />
      <div className="movie-details-container">
        {renderContent()}
      </div>
    </div>
  );
}
