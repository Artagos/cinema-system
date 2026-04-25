import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Mail, Lock, User, Eye, EyeOff, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { SignUpResource } from '../types/auth';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email verification state
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [signUpResource, setSignUpResource] = useState<SignUpResource | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await register(formData);

      if (result.success) {
        navigate('/dashboard');
      } else if (result.requiresVerification && result.signUpResource) {
        // Email verification required - show verification UI
        setSignUpResource(result.signUpResource);
        setShowVerification(true);
      }
    } catch (err) {
      // Handle Clerk-specific errors with better messages
      let errorMessage = 'Registration failed. Please try again.';

      if (err instanceof Error) {
        const clerkError = err.message.toLowerCase();

        if (clerkError.includes('already exists') || clerkError.includes('taken')) {
          errorMessage = 'An account with this email already exists. Please sign in or use a different email.';
        } else if (clerkError.includes('password') && clerkError.includes('strength')) {
          errorMessage = 'Password is too weak. Please use a stronger password with a mix of letters, numbers, and symbols.';
        } else if (clerkError.includes('invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (clerkError.includes('rate limit')) {
          errorMessage = 'Too many attempts. Please wait a moment and try again.';
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpResource) return;

    setIsSubmitting(true);
    setError('');

    try {
      const result = await signUpResource.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await signUpResource.setActive?.({ session: result.createdSessionId });
        navigate('/dashboard');
      } else {
        setError('Invalid verification code. Please check and try again.');
      }
    } catch (err) {
      let errorMessage = 'Verification failed. Please try again.';

      if (err instanceof Error) {
        const clerkError = err.message.toLowerCase();

        if (clerkError.includes('expired')) {
          errorMessage = 'Verification code has expired. Please request a new code.';
        } else if (clerkError.includes('invalid') || clerkError.includes('incorrect')) {
          errorMessage = 'Invalid verification code. Please check and try again.';
        } else if (clerkError.includes('attempts') || clerkError.includes('too many')) {
          errorMessage = 'Too many failed attempts. Please request a new code.';
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendCode = async () => {
    if (!signUpResource) return;

    setIsSubmitting(true);
    setError('');

    try {
      await signUpResource.prepareEmailAddressVerification();
      // Optionally show success feedback here
    } catch (err) {
      let errorMessage = 'Failed to resend verification code. Please try again.';

      if (err instanceof Error) {
        const clerkError = err.message.toLowerCase();

        if (clerkError.includes('rate limit') || clerkError.includes('too many')) {
          errorMessage = 'Please wait a moment before requesting a new code.';
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
          <h1>{showVerification ? 'Verify Email' : 'Create Account'}</h1>
          <p>
            {showVerification
              ? `Enter the code sent to ${formData.email}`
              : 'Join CineManager today'}
          </p>
        </div>

        {showVerification ? (
          // Email Verification Form
          <form onSubmit={handleVerify} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="verificationCode">Verification Code</label>
              <div className="input-wrapper">
                <Key size={18} className="input-icon" />
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                  maxLength={6}
                  autoComplete="one-time-code"
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isSubmitting || verificationCode.length < 6}
            >
              {isSubmitting ? 'Verifying...' : 'Verify Email'}
            </button>

            <button
              type="button"
              className="auth-button secondary"
              onClick={resendCode}
              disabled={isSubmitting}
            >
              Resend Code
            </button>
          </form>
        ) : (
          // Registration Form
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

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
                  placeholder="john@cinema.com"
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
                  placeholder="Create a password"
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
