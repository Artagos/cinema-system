import type { Movie, MovieFormData } from '../../types/movie';

/**
 * API Client for Movie operations
 * This layer handles all HTTP communication with the backend
 * Currently using static data, but structured to easily switch to real API calls
 */
class MovieApi {
  // private _baseUrl: string;
  //
  // constructor(baseUrl: string = '/api') {
  //   this._baseUrl = baseUrl;
  // }

  /**
   * Fetch all movies from the API
   */
  async getAllMovies(): Promise<Movie[]> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this._baseUrl}/movies`);
    // if (!response.ok) throw new Error('Failed to fetch movies');
    // return response.json();
    
    // Static data fallback with simulated network delay
    const { sampleMovies } = await import('../../data/sampleMovies');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    return sampleMovies;
  }

  /**
   * Fetch a single movie by ID
   */
  async getMovieById(id: string): Promise<Movie | null> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this._baseUrl}/movies/${id}`);
    // if (!response.ok) throw new Error('Failed to fetch movie');
    // return response.json();
    
    const movies = await this.getAllMovies();
    return movies.find(movie => movie.id === id) || null;
  }

  /**
   * Create a new movie
   */
  async createMovie(movieData: MovieFormData): Promise<Movie> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this._baseUrl}/movies`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(movieData),
    // });
    // if (!response.ok) throw new Error('Failed to create movie');
    // return response.json();
    
    const { sampleMovies } = await import('../../data/sampleMovies');
    const newMovie: Movie = {
      ...movieData,
      id: String(sampleMovies.length + 1),
      isActive: true,
    };
    return newMovie;
  }

  /**
   * Update an existing movie
   */
  async updateMovie(id: string, movieData: Partial<Movie>): Promise<Movie> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.baseUrl}/movies/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(movieData),
    // });
    // if (!response.ok) throw new Error('Failed to update movie');
    // return response.json();
    
    const movie = await this.getMovieById(id);
    if (!movie) throw new Error('Movie not found');
    return { ...movie, ...movieData };
  }

  /**
   * Delete a movie
   */
  async deleteMovie(id: string): Promise<void> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.baseUrl}/movies/${id}`, {
    //   method: 'DELETE',
    // });
    // if (!response.ok) throw new Error('Failed to delete movie');
    
    // Static data - no-op
    console.log(`Movie ${id} would be deleted`);
  }

  /**
   * Toggle movie active status
   */
  async toggleMovieStatus(id: string, isActive: boolean): Promise<Movie> {
    return this.updateMovie(id, { isActive });
  }
}

// Export singleton instance
export const movieApi = new MovieApi();
