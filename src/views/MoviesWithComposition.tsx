/**
 * Example: Movies View using Composition Patterns
 * 
 * This demonstrates:
 * 1. Compound Components - Flexible layout control for MovieCard and Sidebar
 * 2. Headless UI - DataGrid with render props for flexible presentation
 * 3. No Prop Drilling - Data flows through context, not props
 */

import { Suspense } from 'react';
import { Film, LayoutDashboard, LogOut, Clock, Star, CalendarDays } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useServerFilteredMovies } from '../hooks/useServerFilteredMovies';
import { MoviesToolbar } from '../components/MoviesToolbar';
import { PageHeader } from '../components/PageHeader';

// Compound Components
import { MovieCardCompound } from '../components/compound/MovieCardCompound';
import { SidebarCompound } from '../components/compound/SidebarCompound';

// Headless UI
import { DataGrid } from '../components/headless/DataGrid';

import type { Movie } from '../types/movie';

// ============================================
// Example 1: MovieCard with Custom Layout
// ============================================

function CompactMovieCard({ movie, onClick }: { movie: Movie; onClick?: (m: Movie) => void }) {
  // Custom layout: Only poster, title, and rating - no genres, no director
  return (
    <MovieCardCompound movie={movie} onClick={onClick}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <MovieCardCompound.Poster />
        <div>
          <MovieCardCompound.Title />
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={12} />
              {movie.rating}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              {movie.duration}m
            </span>
          </div>
        </div>
      </div>
    </MovieCardCompound>
  );
}

function DetailedMovieCard({ movie, onClick, onMenuClick }: {
  movie: Movie;
  onClick?: (m: Movie) => void;
  onMenuClick?: (m: Movie) => void;
}) {
  // Custom layout: Full details with custom header arrangement
  return (
    <MovieCardCompound movie={movie} onClick={onClick} onMenuClick={onMenuClick}>
      <MovieCardCompound.Poster />
      <MovieCardCompound.Content>
        {/* Custom header: Menu button first, then title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <MovieCardCompound.MenuButton />
          <MovieCardCompound.Title />
        </div>
        <MovieCardCompound.Director />
        <MovieCardCompound.Meta />
        {/* Show all genres instead of just 3 */}
        <MovieCardCompound.Genres limit={10} />
      </MovieCardCompound.Content>
    </MovieCardCompound>
  );
}

// ============================================
// Example 2: DataGrid with Render Props
// ============================================

function MoviesDataGrid({ searchQuery }: { searchQuery: string }) {
  const { movies, loading, error } = useServerFilteredMovies(searchQuery);

  return (
    <DataGrid
      items={movies}
      loading={loading}
      error={error}
      // Render props give full control over UI without prop drilling
      renderItem={(movie) => (
        <MovieCardCompound
          movie={movie}
          onClick={(m) => console.log('Clicked:', m.title)}
          onMenuClick={(m) => console.log('Menu:', m.title)}
        />
      )}
      renderLoading={() => (
        <div className="movies-empty">
          <Film size={64} />
          <h3>Loading movies...</h3>
        </div>
      )}
      renderError={(err) => (
        <div className="movies-empty" style={{ color: '#ef4444' }}>
          <h3>Error loading movies</h3>
          <p>{err}</p>
        </div>
      )}
      renderEmpty={() => (
        <div className="movies-empty">
          <Film size={64} />
          <h3>No movies found</h3>
          <p>Try adjusting your search or add a new movie.</p>
        </div>
      )}
      className="movies-grid"
    />
  );
}

// ============================================
// Example 3: Sidebar with Compound Pattern
// ============================================

function AppSidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <SidebarCompound>
      <SidebarCompound.Logo icon={Film}>CineManager</SidebarCompound.Logo>
      
      {/* Main Navigation */}
      <SidebarCompound.Nav>
        <SidebarCompound.Link to="/dashboard" icon={LayoutDashboard}>
          Dashboard
        </SidebarCompound.Link>
        <SidebarCompound.Link to="/movies" icon={Film}>
          Movies
        </SidebarCompound.Link>
      </SidebarCompound.Nav>

      {/* Custom Section - No prop drilling needed! */}
      <SidebarCompound.Section title="Quick Actions">
        <SidebarCompound.Action
          icon={CalendarDays}
          onClick={() => console.log('Add showtime')}
        >
          Add Showtime
        </SidebarCompound.Action>
      </SidebarCompound.Section>

      {/* Footer */}
      <SidebarCompound.Footer>
        <SidebarCompound.Action
          icon={LogOut}
          onClick={onLogout}
          variant="danger"
        >
          Logout
        </SidebarCompound.Action>
      </SidebarCompound.Footer>
    </SidebarCompound>
  );
}

// ============================================
// Main View
// ============================================

export default function MoviesWithComposition() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <AppSidebar onLogout={logout} />

      <main className="main-content">
        <PageHeader
          title="Movies"
          subtitle="Manage your movie catalog"
          userEmail={user?.email}
        />

        <MoviesToolbar
          searchQuery=""
          onSearchChange={() => {}}
          onAddMovie={() => console.log('Add movie')}
        />

        <Suspense fallback={'Loading movies...'}>
          <MoviesDataGrid searchQuery="" />
        </Suspense>
      </main>
    </div>
  );
}

// ============================================
// Benefits Summary
// ============================================
/**
 * 
 * 1. COMPOUND COMPONENTS
 *    - MovieCardCompound allows layout control without adding more props
 *    - SidebarCompound lets you reorder, add, or remove sections freely
 *    - Context handles data sharing internally
 * 
 * 2. HEADLESS UI (DataGrid)
 *    - No built-in styling - you control all presentation
 *    - Render props give complete UI flexibility
 *    - State management (loading, error, empty) is handled internally
 *    - Easy to switch between card view, table view, list view, etc.
 * 
 * 3. NO PROP DRILLING
 *    - MovieCardCompound uses React Context to share movie data
 *    - SidebarCompound uses Context for collapsed state
 *    - Components access what they need directly
 * 
 * 4. COMPOSITION EXAMPLES
 *    - CompactMovieCard: Same data, minimal layout
 *    - DetailedMovieCard: Same data, expanded layout
 *    - Both use the same MovieCardCompound with different children
 * 
 */
