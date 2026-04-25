import { useState, useEffect } from 'react';
import { MoviesGrid } from '../components/MoviesGrid';
import LoginButton from '../components/LoginButton';
import { movieService } from '../services/movieService';
import type { Movie } from '../types/movie';

export default function PublicMovies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActiveMovies = async () => {
      try {
        setLoading(true);
        const activeMovies = await movieService.getActiveMovies();
        setMovies(activeMovies);
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActiveMovies();
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleMovieClick = (movie: Movie) => {
    console.log('Movie clicked:', movie.title);
    // Future: Navigate to movie details
  };

  if (loading) {
    return (
      <div className="public-movies">
        <div className="public-header">
          <h1>Now Showing</h1>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-movies">
      <LoginButton />
      <header className="public-header">
        <h1>Now Showing</h1>
        <p>Browse our current movie selection</p>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </header>

      <MoviesGrid
        movies={filteredMovies}
        onMovieClick={handleMovieClick}
        onMovieMenuClick={undefined}
      />
    </div>
  );
}
