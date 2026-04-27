import { createContext, useContext, useState, type ReactNode, type FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Context
interface AuthFormContextType {
  values: { email: string; password: string };
  error: string;
  isSubmitting: boolean;
  showPassword: boolean;
  setValue: (field: 'email' | 'password', value: string) => void;
  setShowPassword: (show: boolean) => void;
  handleSubmit: (e: FormEvent) => void;
  clearError: () => void;
}

const AuthFormContext = createContext<AuthFormContextType | null>(null);

function useAuthFormContext() {
  const context = useContext(AuthFormContext);
  if (!context) throw new Error('AuthForm compound components must be used within AuthFormCompound');
  return context;
}

// Root Component
interface AuthFormCompoundProps {
  children: ReactNode;
  onSubmit: (email: string, password: string) => Promise<void>;
  getErrorMessage: (err: unknown) => string;
}

function AuthFormCompound({ children, onSubmit, getErrorMessage }: AuthFormCompoundProps) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setValue = (field: 'email' | 'password', value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const clearError = () => setError('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(values.email, values.password);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthFormContext.Provider
      value={{
        values,
        error,
        isSubmitting,
        showPassword,
        setValue,
        setShowPassword,
        handleSubmit,
        clearError,
      }}
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {children}
      </form>
    </AuthFormContext.Provider>
  );
}

// Error Banner Component
function ErrorBanner() {
  const { error } = useAuthFormContext();
  if (!error) return null;
  return <div className="auth-error">{error}</div>;
}

// Email Field Component
function EmailField({ placeholder = 'admin@cinema.com' }: { placeholder?: string }) {
  const { values, setValue } = useAuthFormContext();

  return (
    <div className="form-group">
      <label htmlFor="email">Email</label>
      <div className="input-wrapper">
        <Mail size={18} className="input-icon" />
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={(e) => setValue('email', e.target.value)}
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}

// Password Field Component with toggle
function PasswordField({ placeholder = 'Enter your password' }: { placeholder?: string }) {
  const { values, showPassword, setValue, setShowPassword } = useAuthFormContext();

  return (
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <div className="input-wrapper">
        <Lock size={18} className="input-icon" />
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={values.password}
          onChange={(e) => setValue('password', e.target.value)}
          placeholder={placeholder}
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
  );
}

// Submit Button Component
function SubmitButton({ children }: { children: (isSubmitting: boolean) => ReactNode }) {
  const { isSubmitting } = useAuthFormContext();
  return (
    <button type="submit" className="auth-button" disabled={isSubmitting}>
      {children(isSubmitting)}
    </button>
  );
}

// Attach sub-components
AuthFormCompound.ErrorBanner = ErrorBanner;
AuthFormCompound.EmailField = EmailField;
AuthFormCompound.PasswordField = PasswordField;
AuthFormCompound.SubmitButton = SubmitButton;

export { AuthFormCompound };
