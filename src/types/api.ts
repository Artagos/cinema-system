import type { Movie, MovieFormData } from './movie';

/**
 * API Response Types
 * These types define the structure of responses from the backend API
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Movie API specific types
 */
export interface MovieListResponse {
  movies: Movie[];
  total: number;
}

export interface MovieResponse {
  movie: Movie;
}

export type CreateMovieRequest = MovieFormData;

export type UpdateMovieRequest = Partial<MovieFormData>;

export interface DeleteMovieResponse {
  message: string;
  deletedId: string;
}

/**
 * Filter/Query parameters
 */
export interface MovieQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  genre?: string;
  rating?: string;
  isActive?: boolean;
  sortBy?: 'title' | 'releaseDate' | 'rating' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Error response
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
