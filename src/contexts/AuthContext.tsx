import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserPreferences } from '../services/types';
import { mockAuthService } from '../services/mockService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await mockAuthService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError('Failed to check authentication status');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const loggedInUser = await mockAuthService.login(email, password);
      setUser(loggedInUser);
    } catch (err) {
      setError('Invalid email or password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await mockAuthService.register({ name, email, password });
      setUser(newUser);
    } catch (err) {
      setError('Failed to register user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    mockAuthService.logout();
    setUser(null);
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) {
      throw new Error('User not logged in');
    }
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await mockAuthService.updateUserPreferences({
        ...user.preferences,
        ...preferences,
      });
      setUser(updatedUser);
    } catch (err) {
      setError('Failed to update preferences');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updatePreferences,
      }}
    >
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