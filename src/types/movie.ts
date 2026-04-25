export interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  genre: string[];
  rating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  releaseDate: string;
  posterUrl?: string;
  director: string;
  cast: string[];
  isActive: boolean;
}

export interface MovieFormData {
  title: string;
  description: string;
  duration: number;
  genre: string[];
  rating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  releaseDate: string;
  posterUrl?: string;
  director: string;
  cast: string[];
}
