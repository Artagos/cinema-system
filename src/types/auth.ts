export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'staff';
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignUpResource {
  attemptEmailAddressVerification: (params: { code: string }) => Promise<{
    status: string | null;
    createdSessionId?: string | null;
  }>;
  setActive?: (params: { session: string }) => Promise<void>;
  prepareEmailAddressVerification: () => Promise<SignUpResource>;
}

export interface RegisterResult {
  success: boolean;
  requiresVerification?: boolean;
  signUpResource?: SignUpResource;
}

export interface AuthContextType extends AuthState {
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<RegisterResult>;
  logout: () => void;
}
