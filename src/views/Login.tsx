import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';

      if (err instanceof Error) {
        const clerkError = err.message.toLowerCase();

        if (clerkError.includes('invalid') && (clerkError.includes('email') || clerkError.includes('identifier'))) {
          errorMessage = 'No account found with this email. Please check your email or create an account.';
        } else if (clerkError.includes('invalid') || clerkError.includes('password') || clerkError.includes('credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (clerkError.includes('rate limit') || clerkError.includes('too many')) {
          errorMessage = 'Too many login attempts. Please wait a moment and try again.';
        } else if (clerkError.includes('lock') || clerkError.includes('disabled') || clerkError.includes('suspended')) {
          errorMessage = 'Your account has been temporarily locked. Please contact support.';
        } else if (clerkError.includes('not ready') || clerkError.includes('service')) {
          errorMessage = 'Authentication service is temporarily unavailable. Please try again in a moment.';
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Film className="auth-logo" size={48} />
          <h1>CineManager</h1>
          <p>Sign in to manage your cinema</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@cinema.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

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
