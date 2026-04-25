import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PageLoader } from './components/PageLoader';
import './App.css';

// Lazy load route components for code splitting
const Login = lazy(() => import('./views/Login'));
const Register = lazy(() => import('./views/Register'));
const Dashboard = lazy(() => import('./views/Dashboard'));
const Movies = lazy(() => import('./views/Movies'));
const PublicMovies = lazy(() => import('./views/PublicMovies'));

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

function App() {
  if (!CLERK_PUBLISHABLE_KEY) {
    console.error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movies"
                element={
                  <ProtectedRoute>
                    <Movies />
                  </ProtectedRoute>
                }
              />
              <Route path="/public-movies" element={<PublicMovies />} />
              <Route path="/" element={<Navigate to="/public-movies" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App
