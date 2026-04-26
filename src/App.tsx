import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PageLoader } from './components/PageLoader';
import { FloatingChatButton } from './components/FloatingChatButton';
import { ChatPanel } from './components/ChatPanel';
import './App.css';

// Lazy load route components for code splitting
const Login = lazy(() => import('./views/Login'));
const Register = lazy(() => import('./views/Register'));
const Dashboard = lazy(() => import('./views/Dashboard'));
const Movies = lazy(() => import('./views/Movies'));
const PublicMovies = lazy(() => import('./views/PublicMovies'));
const MovieDetails = lazy(() => import('./views/MovieDetails'));
const AddMovie = lazy(() => import('./views/AddMovie'));

// Public route wrapper - redirects authenticated users to dashboard
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

// Auth routes where chat should not appear
const AUTH_ROUTES = ['/login', '/register'];

function ChatWrapper() {
  const location = useLocation();
  const isAuthRoute = AUTH_ROUTES.some(route => location.pathname.startsWith(route));

  if (isAuthRoute) return null;

  return (
    <>
      <FloatingChatButton />
      <ChatPanel />
    </>
  );
}

function App() {
  if (!CLERK_PUBLISHABLE_KEY) {
    console.error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AuthProvider>
        <ChatProvider>
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
                <Route
                  path="/movies/add"
                  element={
                    <ProtectedRoute>
                      <AddMovie />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/public-movies"
                  element={
                    <PublicRoute>
                      <PublicMovies />
                    </PublicRoute>
                  }
                />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/" element={<Navigate to="/public-movies" replace />} />
              </Routes>
            </Suspense>
            <ChatWrapper />
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App
