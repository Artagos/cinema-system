import type { Movie } from '../types/movie';

export const sampleMovies: Movie[] = [
  {
    id: '1',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    duration: 152,
    genre: ['Action', 'Crime', 'Drama'],
    rating: 'PG-13',
    releaseDate: '2008-07-18',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    isActive: true,
    posterUrl: 'https://image.tmdb.org/t/p/w200/1hRoyzDtpgMU1D9oJD4sZ8V1q95.jpg'
  },
  {
    id: '2',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    duration: 148,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    rating: 'PG-13',
    releaseDate: '2010-07-16',
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    isActive: true,
    posterUrl: 'https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
  },
  {
    id: '3',
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    duration: 154,
    genre: ['Crime', 'Drama'],
    rating: 'R',
    releaseDate: '1994-10-14',
    director: 'Quentin Tarantino',
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
    isActive: true,
    posterUrl: 'https://image.tmdb.org/t/p/w200/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'
  },
  {
    id: '4',
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    duration: 142,
    genre: ['Drama'],
    rating: 'R',
    releaseDate: '1994-10-14',
    director: 'Frank Darabont',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    isActive: false,
    posterUrl: 'https://image.tmdb.org/t/p/w200/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'
  }
];
