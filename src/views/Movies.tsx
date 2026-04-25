import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MoviesGrid } from '../components/MoviesGrid';
import { MoviesToolbar } from '../components/MoviesToolbar';
import { Sidebar } from '../components/Sidebar';
import { PageHeader } from '../components/PageHeader';
import { movieService } from '../services/movieService';
import type { Movie } from '../types/movie';

export default function Movies() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const allMovies = await movieService.getAllMovies();
      setMovies(allMovies);
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleMovieMenuClick = (movie: Movie) => {
    console.log('Menu clicked for:', movie.title);
    // Future: Open action menu (edit, delete, etc.)
  };

  const handleMovieClick = (movie: Movie) => {
    console.log('Movie clicked:', movie.title);
    // Future: Navigate to movie details
  };

  const handleAddMovie = () => {
    console.log('Add movie clicked');
    // Future: Open add movie modal/form
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar onLogout={logout} />
        <main className="main-content">
          <PageHeader
            title="Movies"
            subtitle="Manage your movie catalog"
            userEmail={user?.email}
          />
          <p>Loading movies...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar onLogout={logout} />

      <main className="main-content">
        <PageHeader
          title="Movies"
          subtitle="Manage your movie catalog"
          userEmail={user?.email}
        />

        <MoviesToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddMovie={handleAddMovie}
        />

        <MoviesGrid
          movies={filteredMovies}
          onMovieClick={handleMovieClick}
          onMovieMenuClick={handleMovieMenuClick}
        />
      </main>
    </div>
  );
}
