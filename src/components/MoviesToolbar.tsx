import { Search, Plus } from 'lucide-react';

interface MoviesToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddMovie: () => void;
}

export function MoviesToolbar({ searchQuery, onSearchChange, onAddMovie }: MoviesToolbarProps) {
  return (
    <div className="movies-toolbar">
      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search movies by title or genre..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button className="add-movie-btn" onClick={onAddMovie}>
        <Plus size={20} />
        <span>Add Movie</span>
      </button>
    </div>
  );
}
