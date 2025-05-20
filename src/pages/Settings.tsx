import React from 'react';
import { Moon, Sun, Mail, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const { darkMode, toggleDarkMode, email, setEmail } = useTheme();
  const [tempEmail, setTempEmail] = React.useState(email);
  const [showSavedMessage, setShowSavedMessage] = React.useState(false);

  const handleEmailSave = () => {
    setEmail(tempEmail);
    setShowSavedMessage(true);
    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Appearance
        </h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">Dark Mode</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Switch between light and dark theme
            </p>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Notifications
        </h2>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email for Price Alerts
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            We'll send you notifications when prices drop below your alerts
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleEmailSave}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Email
          </button>
        </div>
        
        {showSavedMessage && (
          <div className="mt-3 p-2 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-md text-sm">
            Email saved successfully!
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Flight Ticket Price Tracker v1.0.0</p>
        <p className="mt-1">© 2025 All rights reserved</p>
      </div>
    </div>
  );
};

export default Settings;
