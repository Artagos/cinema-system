import { useState, Suspense, useDeferredValue } from 'react';
import { MoviesGrid } from '../components/MoviesGrid';
import LoginButton from '../components/LoginButton';
import type { Movie } from '../types/movie';

export default function PublicMovies() {
  const [searchQuery, setSearchQuery] = useState('');

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleMovieClick = (movie: Movie) => {
    console.log('Movie clicked:', movie.title);
    // Future: Navigate to movie details
  };

  return (
    <div className="public-movies">
      <LoginButton />
      <header className="public-header">
        <h1>Now Showing</h1>
        <p>Browse our current movie selection</p>
        <input
          type="text"
          placeholder="Search movies by title or genre..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-input"
        />
      </header>

      <Suspense fallback={'Loading movies...'}>
        <MoviesGrid
          searchQuery={deferredSearchQuery}
          onMovieClick={handleMovieClick}
        />
      </Suspense>

      {/* Concurrent Mode debug indicator */}
      {searchQuery !== deferredSearchQuery && (
        <div className="concurrency-debug">
          <small>
            🔄 Concurrent Mode Active: Input="{searchQuery}" | Grid filtering="{deferredSearchQuery}"
          </small>
        </div>
      )}
    </div>
  );
}
