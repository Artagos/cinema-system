import { movieApi } from './api/movieApi';
import type { Movie, MovieFormData } from '../types/movie';

/**
 * Movie Service - Business Logic Layer
 * This layer sits between the UI components and the API layer
 * It handles business logic, data transformation, and caching
 */
class MovieService {
  private cache: Map<string, Movie[]> = new Map();
  private cacheExpiry: number = 0; // 5 minutes
  private lastFetch: number = 0;

  /**
   * Get all movies with caching
   */
  async getAllMovies(forceRefresh: boolean = false): Promise<Movie[]> {
    const now = Date.now();
    const cacheKey = 'all_movies';

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (now - this.lastFetch < this.cacheExpiry) {
        return cached;
      }
    }

    // Fetch fresh data
    const movies = await movieApi.getAllMovies();
    this.cache.set(cacheKey, movies);
    this.lastFetch = now;
    return movies;
  }

  /**
   * Get only active movies (for public view)
   */
  async getActiveMovies(forceRefresh: boolean = false): Promise<Movie[]> {
    const allMovies = await this.getAllMovies(forceRefresh);
    return allMovies.filter(movie => movie.isActive);
  }

  /**
   * Get a single movie by ID
   */
  async getMovieById(id: string): Promise<Movie | null> {
    // Check cache first
    const cached = this.cache.get('all_movies');
    if (cached) {
      const movie = cached.find(m => m.id === id);
      if (movie) return movie;
    }

    // If not in cache, fetch from API
    return movieApi.getMovieById(id);
  }

  /**
   * Search movies by title or genre (delegates to API)
   */
  async searchMovies(query: string): Promise<Movie[]> {
    // Delegate to API to simulate server-side filtering
    return movieApi.searchMovies(query);
  }

  /**
   * Filter movies by genre
   */
  async filterByGenre(genre: string): Promise<Movie[]> {
    const movies = await this.getAllMovies();
    return movies.filter(movie =>
      movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  }

  /**
   * Filter movies by rating
   */
  async filterByRating(rating: string): Promise<Movie[]> {
    const movies = await this.getAllMovies();
    return movies.filter(movie => movie.rating === rating);
  }

  /**
   * Create a new movie
   */
  async createMovie(movieData: MovieFormData): Promise<Movie> {
    const newMovie = await movieApi.createMovie(movieData);
    
    // Invalidate cache
    this.invalidateCache();
    
    return newMovie;
  }

  /**
   * Update an existing movie
   */
  async updateMovie(id: string, movieData: Partial<MovieFormData>): Promise<Movie> {
    const updatedMovie = await movieApi.updateMovie(id, movieData);
    
    // Update cache
    this.updateCacheMovie(updatedMovie);
    
    return updatedMovie;
  }

  /**
   * Delete a movie
   */
  async deleteMovie(id: string): Promise<void> {
    await movieApi.deleteMovie(id);
    
    // Remove from cache
    this.removeMovieFromCache(id);
  }

  /**
   * Toggle movie active status
   */
  async toggleMovieStatus(id: string, isActive: boolean): Promise<Movie> {
    const updatedMovie = await movieApi.toggleMovieStatus(id, isActive);
    
    // Update cache
    this.updateCacheMovie(updatedMovie);
    
    return updatedMovie;
  }

  /**
   * Get unique genres from all movies
   */
  async getUniqueGenres(): Promise<string[]> {
    const movies = await this.getAllMovies();
    const genres = new Set<string>();
    movies.forEach(movie => {
      movie.genre.forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  }

  /**
   * Get unique ratings from all movies
   */
  async getUniqueRatings(): Promise<string[]> {
    const movies = await this.getAllMovies();
    const ratings = new Set(movies.map(m => m.rating));
    return Array.from(ratings).sort();
  }

  /**
   * Invalidate cache
   */
  private invalidateCache(): void {
    this.cache.clear();
    this.lastFetch = 0;
  }

  /**
   * Update a movie in cache
   */
  private updateCacheMovie(movie: Movie): void {
    const cached = this.cache.get('all_movies');
    if (cached) {
      const index = cached.findIndex(m => m.id === movie.id);
      if (index !== -1) {
        cached[index] = movie;
      } else {
        cached.push(movie);
      }
    }
  }

  /**
   * Remove a movie from cache
   */
  private removeMovieFromCache(id: string): void {
    const cached = this.cache.get('all_movies');
    if (cached) {
      const index = cached.findIndex(m => m.id === id);
      if (index !== -1) {
        cached.splice(index, 1);
      }
    }
  }
}

// Export singleton instance
export const movieService = new MovieService();
