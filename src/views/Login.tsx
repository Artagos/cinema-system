import { Link, useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthFormCompound } from '../components/compound/AuthFormCompound';

function getErrorMessage(err: unknown): string {
  if (!(err instanceof Error)) return 'Login failed. Please try again.';

  const msg = err.message.toLowerCase();

  if (msg.includes('invalid') && (msg.includes('email') || msg.includes('identifier'))) {
    return 'No account found with this email. Please check your email or create an account.';
  }
  if (msg.includes('invalid') || msg.includes('password') || msg.includes('credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  if (msg.includes('rate limit') || msg.includes('too many')) {
    return 'Too many login attempts. Please wait a moment and try again.';
  }
  if (msg.includes('lock') || msg.includes('disabled') || msg.includes('suspended')) {
    return 'Your account has been temporarily locked. Please contact support.';
  }
  if (msg.includes('not ready') || msg.includes('service')) {
    return 'Authentication service is temporarily unavailable. Please try again in a moment.';
  }

  return err.message || 'Login failed. Please try again.';
}

/**
 * Login View - Refactored with Compound Component Pattern
 *
 * Uses AuthFormCompound for declarative form structure:
 * - ErrorBanner: Displays auth errors
 * - EmailField: Email input with icon
 * - PasswordField: Password input with visibility toggle
 * - SubmitButton: Loading state handling
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    await login({ email, password });
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Film className="auth-logo" size={48} />
          <h1>CineManager</h1>
          <p>Sign in to manage your cinema</p>
        </div>

        <AuthFormCompound onSubmit={handleSubmit} getErrorMessage={getErrorMessage}>
          <AuthFormCompound.ErrorBanner />
          <AuthFormCompound.EmailField placeholder="admin@cinema.com" />
          <AuthFormCompound.PasswordField placeholder="Enter your password" />
          <AuthFormCompound.SubmitButton>
            {(isSubmitting) => (isSubmitting ? 'Signing in...' : 'Sign In')}
          </AuthFormCompound.SubmitButton>
        </AuthFormCompound>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create account
            </Link>
          </p>
        </div>

        <div className="demo-credentials">
          <p><strong>Demo:</strong> admin@cinema.com / password</p>
        </div>
      </div>
    </div>
  );
}
