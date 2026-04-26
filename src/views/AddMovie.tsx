import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2, AlertCircle} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { PageHeader } from '../components/PageHeader';
import { useForm, type FormErrors } from '../hooks/useForm';
import { useCreateMovie } from '../hooks/useCreateMovie';
import type { MovieFormData } from '../types/movie';

const RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17'] as const;

const INITIAL_VALUES: MovieFormData = {
  title: '',
  description: '',
  duration: 0,
  genre: [],
  rating: 'PG-13',
  releaseDate: '',
  posterUrl: '',
  director: '',
  cast: [],
};

/**
 * AddMovie View - Movie Creation Form
 *
 * Uses composition patterns:
 * - useForm hook: Headless form state management
 * - useCreateMovie hook: Business logic for movie creation
 * - Sidebar: Compound component for navigation
 *
 * Features:
 * - Form validation
 * - Loading states
 * - Error handling
 * - Success navigation
 */
export default function AddMovie() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { createMovie, loading: submitting, error: submitError } = useCreateMovie();

  const validate = (values: MovieFormData): FormErrors<MovieFormData> => {
    const errors: FormErrors<MovieFormData> = {};

    if (!values.title.trim()) {
      errors.title = 'Title is required';
    } else if (values.title.length < 2) {
      errors.title = 'Title must be at least 2 characters';
    }

    if (!values.description.trim()) {
      errors.description = 'Description is required';
    } else if (values.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!values.director.trim()) {
      errors.director = 'Director is required';
    }

    if (values.duration <= 0) {
      errors.duration = 'Duration must be greater than 0';
    }

    if (!values.releaseDate) {
      errors.releaseDate = 'Release date is required';
    }

    if (values.genre.length === 0) {
      errors.genre = 'At least one genre is required';
    }

    return errors;
  };

  const form = useForm<MovieFormData>({
    initialValues: INITIAL_VALUES,
    validate,
    onSubmit: async (values) => {
      await createMovie(values);
    },
  });

  const handleBack = () => {
    navigate('/movies');
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const currentGenres = form.values.genre;

    if (e.target.checked) {
      form.setValue('genre', [...currentGenres, value]);
    } else {
      form.setValue(
        'genre',
        currentGenres.filter((g) => g !== value)
      );
    }
  };

  const handleCastChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cast = value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    form.setValue('cast', cast);
  };

  const commonGenres = [
    'Action',
    'Adventure',
    'Comedy',
    'Crime',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
  ];

  return (
    <div className="dashboard">
      <Sidebar onLogout={logout} />

      <main className="main-content">
        <PageHeader
          title="Add Movie"
          subtitle="Create a new movie in your catalog"
          userEmail={user?.email}
        />

        <div className="add-movie-container">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={20} />
            <span>Back to Movies</span>
          </button>

          {submitError && (
            <div className="form-error-banner">
              <AlertCircle size={20} />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={form.handleSubmit} className="movie-form">
            {/* Basic Info Section */}
            <section className="form-section">
              <h3 className="section-title">Basic Information</h3>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    {...form.getFieldProps('title')}
                    placeholder="Enter movie title"
                    className={form.errors.title && form.touched.title ? 'error' : ''}
                  />
                  {form.errors.title && form.touched.title && (
                    <span className="field-error">{form.errors.title}</span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="director">Director *</label>
                  <input
                    type="text"
                    id="director"
                    {...form.getFieldProps('director')}
                    placeholder="Enter director name"
                    className={form.errors.director && form.touched.director ? 'error' : ''}
                  />
                  {form.errors.director && form.touched.director && (
                    <span className="field-error">{form.errors.director}</span>
                  )}
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  {...form.getFieldProps('description')}
                  rows={4}
                  placeholder="Enter movie description"
                  className={form.errors.description && form.touched.description ? 'error' : ''}
                />
                {form.errors.description && form.touched.description && (
                  <span className="field-error">{form.errors.description}</span>
                )}
              </div>
            </section>

            {/* Technical Details Section */}
            <section className="form-section">
              <h3 className="section-title">Technical Details</h3>

              <div className="form-row three-col">
                <div className="form-field">
                  <label htmlFor="duration">Duration (minutes) *</label>
                  <input
                    type="number"
                    id="duration"
                    {...form.getFieldProps('duration')}
                    min={1}
                    placeholder="e.g., 120"
                    className={form.errors.duration && form.touched.duration ? 'error' : ''}
                  />
                  {form.errors.duration && form.touched.duration && (
                    <span className="field-error">{form.errors.duration}</span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="rating">Rating *</label>
                  <select id="rating" {...form.getFieldProps('rating')}>
                    {RATINGS.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="releaseDate">Release Date *</label>
                  <input
                    type="date"
                    id="releaseDate"
                    {...form.getFieldProps('releaseDate')}
                    className={form.errors.releaseDate && form.touched.releaseDate ? 'error' : ''}
                  />
                  {form.errors.releaseDate && form.touched.releaseDate && (
                    <span className="field-error">{form.errors.releaseDate}</span>
                  )}
                </div>
              </div>
            </section>

            {/* Genres Section */}
            <section className="form-section">
              <h3 className="section-title">Genres *</h3>
              <div
                className={`genre-checkboxes ${
                  form.errors.genre && form.touched.genre ? 'error' : ''
                }`}
              >
                {commonGenres.map((genre) => (
                  <label key={genre} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={genre}
                      checked={form.values.genre.includes(genre)}
                      onChange={handleGenreChange}
                    />
                    <span>{genre}</span>
                  </label>
                ))}
              </div>
              {form.errors.genre && form.touched.genre && (
                <span className="field-error">{form.errors.genre}</span>
              )}
            </section>

            {/* Cast Section */}
            <section className="form-section">
              <h3 className="section-title">Cast</h3>
              <div className="form-field">
                <textarea
                  value={form.values.cast.join('\n')}
                  onChange={handleCastChange}
                  rows={4}
                  placeholder="Enter actor names, one per line"
                />
                <span className="field-hint">Enter one actor name per line</span>
              </div>
            </section>

            {/* Poster Section */}
            <section className="form-section">
              <h3 className="section-title">Poster</h3>
              <div className="form-field">
                <label htmlFor="posterUrl">Poster URL</label>
                <input
                  type="url"
                  id="posterUrl"
                  {...form.getFieldProps('posterUrl')}
                  placeholder="https://example.com/poster.jpg"
                />
                <span className="field-hint">Leave empty to use a default placeholder</span>
              </div>

              {form.values.posterUrl && (
                <div className="poster-preview">
                  <img
                    src={form.values.posterUrl}
                    alt="Poster preview"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </section>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleBack}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!form.isValid || !form.isDirty || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="spinner" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Add Movie</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
