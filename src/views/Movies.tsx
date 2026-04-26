import { useState, useEffect, Suspense, useDeferredValue } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFilteredMovies } from '../hooks/useFilteredMovies';
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

  // React 18 Concurrency: useTransition marks the search filtering as non-urgent
  // This keeps the search input responsive while the filtering happens in background
  // const [isSearchPending, startSearchTransition] = useTransition();

  // Defer search query for concurrent rendering visualization
  // const deferredSearchQuery = useDeferredValue(searchQuery);

  // Use custom hook for filtered movies with heavy computation simulation
  const filteredMovies = useFilteredMovies(movies, searchQuery, {
    simulateHeavyComputation: true,
    computationIterations: 10000,
    useDeferred:false
  });

  useEffect(() => {
    let isMounted = true; // Prevents state updates if user leaves page quickly

    const loadMovies = async () => {
      try {
        // If you are already loading, don't trigger it again
        setLoading(true);

        const allMovies = await movieService.getAllMovies();

        if (isMounted) {
          setMovies(allMovies);
        }
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMovies();
    return () => { isMounted = false; }; // Cleanup function
  }, []);

  const handleSearchChange = (value: string) => {
      setSearchQuery(value);
  };

  // const handleMovieMenuClick = (movie: Movie) => {
  //   console.log('Menu clicked for:', movie.title);
  //   // Future: Open action menu (edit, delete, etc.)
  // };

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
          onSearchChange={handleSearchChange}
          onAddMovie={handleAddMovie}
        />

        {/*/!* Visual indicator: Shows when React is working on the deferred update *!/*/}
        {/*{isSearchPending && (*/}
        {/*  <div className="search-pending-indicator">*/}
        {/*    <span className="spinner"></span>*/}
        {/*    Filtering movies...*/}
        {/*  </div>*/}
        {/*)}*/}

        {/* MoviesGrid uses deferred data - it may show stale results briefly during heavy filtering */}
        <Suspense fallback={'Loading movies...'}>
          <MoviesGrid
              movies={filteredMovies}
              onMovieClick={handleMovieClick}
          />
        </Suspense>

        {/* Debug/Dev indicator: Visualize the "lag" between immediate and deferred values */}
        {/*{searchQuery !== deferredSearchQuery && (*/}
        {/*  <div className="concurrency-debug">*/}
        {/*    <small>*/}
        {/*      🔄 Concurrent Mode Active: Input="{searchQuery}" | Grid filtering="{deferredSearchQuery}"*/}
        {/*    </small>*/}
        {/*  </div>*/}
        {/*)}*/}
      </main>
    </div>
  );
}
