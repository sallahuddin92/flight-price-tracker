import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  email: string;
  setEmail: (email: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize state from localStorage or default values
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  
  const [email, setEmail] = useState<string>(() => {
    const savedEmail = localStorage.getItem('notificationEmail');
    return savedEmail || '';
  });

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (email) {
      localStorage.setItem('notificationEmail', email);
    }
  }, [email]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, email, setEmail }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
