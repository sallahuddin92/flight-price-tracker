import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse, login, register, loginWithGoogle, loginWithFacebook, updateUserPreferences } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  loginWithFacebook: (token: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Implement token validation and user data fetching
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const handleAuthResponse = (response: AuthResponse) => {
    const { user, token } = response;
    localStorage.setItem('token', token);
    setUser(user);
    setError(null);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await login(email, password);
      handleAuthResponse(response);
    } catch (err) {
      setError('Invalid email or password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const response = await register(email, password, name);
      handleAuthResponse(response);
    } catch (err) {
      setError('Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (token: string) => {
    try {
      setLoading(true);
      const response = await loginWithGoogle(token);
      handleAuthResponse(response);
    } catch (err) {
      setError('Google login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async (token: string) => {
    try {
      setLoading(true);
      const response = await loginWithFacebook(token);
      handleAuthResponse(response);
    } catch (err) {
      setError('Facebook login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleUpdatePreferences = async (preferences: Partial<User['preferences']>) => {
    try {
      setLoading(true);
      const updatedUser = await updateUserPreferences(preferences);
      setUser(updatedUser);
    } catch (err) {
      setError('Failed to update preferences');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    loginWithGoogle: handleGoogleLogin,
    loginWithFacebook: handleFacebookLogin,
    logout: handleLogout,
    updatePreferences: handleUpdatePreferences,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 