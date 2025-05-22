import axiosInstance from './axios';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: {
    defaultCurrency: string;
    defaultCabinClass: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    savedSearches: SavedSearch[];
  };
}

export interface SavedSearch {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData: { name: string; email: string; password: string }): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);
  return response.data;
};

export const loginWithGoogle = async (token: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/google', { token });
  return response.data;
};

export const loginWithFacebook = async (token: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/facebook', { token });
  return response.data;
};

export const updateUserPreferences = async (preferences: Partial<User['preferences']>): Promise<User> => {
  const response = await axiosInstance.put<User>('/user/preferences', preferences);
  return response.data;
};

export const saveSearch = async (search: Omit<SavedSearch, 'id'>): Promise<SavedSearch> => {
  const response = await axiosInstance.post<SavedSearch>('/users/saved-searches', search);
  return response.data;
};

export const getSavedSearches = async (): Promise<SavedSearch[]> => {
  const response = await axiosInstance.get<SavedSearch[]>('/users/saved-searches');
  return response.data;
};

export const deleteSavedSearch = async (searchId: string): Promise<void> => {
  await axiosInstance.delete(`/users/saved-searches/${searchId}`);
}; 