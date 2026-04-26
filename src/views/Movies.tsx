import { useState, Suspense, useDeferredValue } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MoviesGrid } from '../components/MoviesGrid';
import { MoviesToolbar } from '../components/MoviesToolbar';
import { Sidebar } from '../components/Sidebar';
import { PageHeader } from '../components/PageHeader';

import type { Movie } from '../types/movie';

/**
 * Movies View - Composition Patterns in Action
 *
 * Sidebar: Uses compound component pattern (SidebarCompound)
 *   - No prop drilling for active state
 *   - Layout controlled declaratively
 *
 * MoviesGrid: Uses headless DataGrid pattern
 *   - DataGrid handles loading/error/empty states
 *   - Render props give 100% UI control
 */

export default function Movies() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleAddMovie = () => {
    console.log('Add movie clicked');
  };

  return (
    <div className="dashboard">
      {/* Sidebar uses compound components - flexible, no prop drilling */}
      <Sidebar onLogout={logout} />

      <main className="main-content">
        <PageHeader
          title="Movies"
          subtitle="Manage your movie catalog"
          userEmail={user?.email}
        />

        <MoviesToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onAddMovie={handleAddMovie}
        />

        {/* MoviesGrid uses headless DataGrid - logic separated from UI */}
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
      </main>
    </div>
  );
}
