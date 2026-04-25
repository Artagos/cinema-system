import { useState } from 'react';
import { MoviesGrid } from '../components/MoviesGrid';
import { sampleMovies } from '../data/sampleMovies';
import type { Movie } from '../types/movie';

export default function PublicMovies() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Only show active movies for public view
  const activeMovies = sampleMovies.filter(movie => movie.isActive);

  const filteredMovies = activeMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleMovieClick = (movie: Movie) => {
    console.log('Movie clicked:', movie.title);
    // Future: Navigate to movie details
  };

  return (
    <div className="public-movies">
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
