import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { PageHeader } from '../components/PageHeader';
import { MovieFormCompound } from '../components/compound/MovieFormCompound';
import { useForm, type FormErrors } from '../hooks/useForm';
import { useCreateMovie } from '../hooks/useCreateMovie';
import type { MovieFormData } from '../types/movie';

const RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17'] as const;
const COMMON_GENRES = ['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'];

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

function validate(values: MovieFormData): FormErrors<MovieFormData> {
  const errors: FormErrors<MovieFormData> = {};

  if (!values.title.trim()) errors.title = 'Title is required';
  else if (values.title.length < 2) errors.title = 'Title must be at least 2 characters';

  if (!values.description.trim()) errors.description = 'Description is required';
  else if (values.description.length < 10) errors.description = 'Description must be at least 10 characters';

  if (!values.director.trim()) errors.director = 'Director is required';
  if (values.duration <= 0) errors.duration = 'Duration must be greater than 0';
  if (!values.releaseDate) errors.releaseDate = 'Release date is required';
  if (values.genre.length === 0) errors.genre = 'At least one genre is required';

  return errors;
}

/**
 * AddMovie View - Refactored with Compound Component Pattern
 *
 * Uses MovieFormCompound for declarative form structure:
 * - Sections, Rows, Fields compose together
 * - No repetitive error handling markup
 * - Validation logic separated
 */
export default function AddMovie() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { createMovie, loading: submitting, error: submitError } = useCreateMovie();

  const form = useForm<MovieFormData>({
    initialValues: INITIAL_VALUES,
    validate,
    onSubmit: async (values) => {
      await createMovie(values);
    },
  });

  const handleBack = () => navigate('/movies');

  const handleGenreChange = (genre: string, checked: boolean) => {
    const current = form.values.genre;
    form.setValue('genre', checked ? [...current, genre] : current.filter((g) => g !== genre));
  };

  const handleCastChange = (value: string) => {
    const cast = value.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    form.setValue('cast', cast);
  };

  return (
    <div className="dashboard">
      <Sidebar onLogout={logout} />

      <main className="main-content">
        <PageHeader title="Add Movie" subtitle="Create a new movie in your catalog" userEmail={user?.email} />

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

          <MovieFormCompound
            values={form.values}
            errors={form.errors}
            touched={form.touched}
            setValue={form.setValue}
            setTouched={form.setTouched}
          >
            <form onSubmit={form.handleSubmit} className="movie-form">
              <MovieFormCompound.Section title="Basic Information">
                <MovieFormCompound.Row>
                  <MovieFormCompound.TextInput name="title" label="Title" required placeholder="Enter movie title" />
                  <MovieFormCompound.TextInput name="director" label="Director" required placeholder="Enter director name" />
                </MovieFormCompound.Row>
                <MovieFormCompound.TextArea name="description" label="Description" required placeholder="Enter movie description" />
              </MovieFormCompound.Section>

              <MovieFormCompound.Section title="Technical Details">
                <MovieFormCompound.Row columns={3}>
                  <MovieFormCompound.TextInput name="duration" label="Duration (minutes)" required placeholder="e.g., 120" type="number" />
                  <MovieFormCompound.Select name="rating" label="Rating" required>
                    {RATINGS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </MovieFormCompound.Select>
                  <MovieFormCompound.TextInput name="releaseDate" label="Release Date" required type="date" />
                </MovieFormCompound.Row>
              </MovieFormCompound.Section>

              <MovieFormCompound.Section title="Genres">
                <MovieFormCompound.CheckboxGroup
                  name="genre"
                  label="Genres"
                  required
                  options={COMMON_GENRES}
                  selected={form.values.genre}
                  onChange={handleGenreChange}
                />
              </MovieFormCompound.Section>

              <MovieFormCompound.Section title="Cast">
                <MovieFormCompound.Field name="cast" label="Cast">
                  {(props) => (
                    <>
                      <textarea
                        {...props}
                        value={form.values.cast.join('\n')}
                        onChange={(e) => handleCastChange(e.target.value)}
                        rows={4}
                        placeholder="Enter actor names, one per line"
                      />
                      <span className="field-hint">Enter one actor name per line</span>
                    </>
                  )}
                </MovieFormCompound.Field>
              </MovieFormCompound.Section>

              <MovieFormCompound.Section title="Poster">
                <MovieFormCompound.TextInput name="posterUrl" label="Poster URL" placeholder="https://example.com/poster.jpg" type="url" />
                <span className="field-hint">Leave empty to use a default placeholder</span>
                <MovieFormCompound.PosterPreview url={form.values.posterUrl} />
              </MovieFormCompound.Section>

              <MovieFormCompound.Actions submitting={submitting}>
                <button type="button" className="btn-secondary" onClick={handleBack} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={!form.isValid || !form.isDirty || submitting}>
                  {submitting ? (
                    <><Loader2 size={18} className="spinner" /><span>Creating...</span></>
                  ) : (
                    <><Plus size={18} /><span>Add Movie</span></>
                  )}
                </button>
              </MovieFormCompound.Actions>
            </form>
          </MovieFormCompound>
        </div>
      </main>
    </div>
  );
}
