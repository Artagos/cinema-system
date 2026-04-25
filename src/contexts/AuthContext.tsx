import { createContext, useContext, useCallback, type ReactNode } from 'react';
import {
  useUser,
  useAuth as useClerkAuth,
  useSignIn,
  useSignUp,
  useClerk,
} from '@clerk/clerk-react';
import type { User, AuthCredentials, RegisterData, AuthContextType, RegisterResult } from '../types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

// Map Clerk user to our User type
function mapClerkUser(clerkUser: ReturnType<typeof useUser>['user']): User | null {
  if (!clerkUser) return null;

  const role = (clerkUser.publicMetadata?.role as User['role']) || 'staff';

  return {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    firstName: clerkUser.firstName || '',
    lastName: clerkUser.lastName || '',
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded: userLoaded, user: clerkUser } = useUser();
  const { isLoaded: authLoaded } = useClerkAuth();
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const { signOut } = useClerk();

  const isLoading = !userLoaded || !authLoaded || !signInLoaded || !signUpLoaded;
  const user = mapClerkUser(clerkUser);
  const isAuthenticated = !!clerkUser;

  const login = useCallback(
    async (credentials: AuthCredentials): Promise<void> => {
      if (!signIn) throw new Error('Authentication service is not ready. Please try again.');

      try {
        const result = await signIn.create({
          identifier: credentials.email,
          password: credentials.password,
        });

        if (result.status === 'complete' && result.createdSessionId) {
          await setSignInActive({ session: result.createdSessionId });
        } else if (result.status === 'needs_first_factor') {
          // Handle specific Clerk error states
          const errorMessage = result.firstFactorVerification?.error?.longMessage ||
                              result.firstFactorVerification?.error?.message ||
                              'Invalid email or password. Please check your credentials and try again.';
          throw new Error(errorMessage);
        } else {
          throw new Error('Login failed. Please try again or contact support if the problem persists.');
        }
      } catch (error) {
        // Re-throw Clerk errors or wrap unknown errors
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('An unexpected error occurred during login. Please try again.', { cause: error });
      }
    },
    [signIn, setSignInActive]
  );

  const register = useCallback(
    async (data: RegisterData): Promise<RegisterResult> => {
      if (!signUp) throw new Error('Authentication service is not ready. Please try again.');

      try {
        const result = await signUp.create({
          emailAddress: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        });

        if (result.status === 'complete' && result.createdSessionId) {
          await setSignUpActive({ session: result.createdSessionId });
          return { success: true };
        } else if (result.status === 'missing_requirements') {
          // Check if it's specifically email verification or other requirements
          const missingFields = result.requiredFields || [];
          if (missingFields.includes('email_address') || result.unverifiedFields?.includes('email_address')) {
            return {
              success: false,
              requiresVerification: true,
              signUpResource: signUp,
            };
          }
          throw new Error('Please complete all required fields to continue.');
        } else {
          throw new Error('Registration failed. Please try again or contact support if the problem persists.');
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('An unexpected error occurred during registration. Please try again.', { cause: error });
      }
    },
    [signUp, setSignUpActive]
  );

  const logout = useCallback((): void => {
    void signOut();
  }, [signOut]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
