import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAlerts } from '../context/AlertContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { darkMode } = useTheme();
  const { alerts } = useAlerts();
  
  const hasActiveAlerts = alerts.length > 0;
  const hasTriggeredAlerts = alerts.some(alert => alert.currentPrice <= alert.targetPrice);
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">FlightTracker</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  location.pathname === '/'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
              
              <Link
                to="/settings"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  location.pathname === '/settings'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Link>
              
              {hasActiveAlerts && (
                <div className="relative">
                  <Bell className={`h-5 w-5 ${hasTriggeredAlerts ? 'text-green-500' : 'text-gray-500'}`} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {alerts.length}
                  </span>
                </div>
              )}
            </div>
            
            {/* Mobile menu */}
            <div className="flex items-center md:hidden">
              <Link
                to="/"
                className={`p-2 rounded-md ${
                  location.pathname === '/'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Home className="h-5 w-5" />
              </Link>
              
              {hasActiveAlerts && (
                <div className="relative p-2">
                  <Bell className={`h-5 w-5 ${hasTriggeredAlerts ? 'text-green-500' : 'text-gray-500'}`} />
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {alerts.length}
                  </span>
                </div>
              )}
              
              <Link
                to="/settings"
                className={`p-2 rounded-md ${
                  location.pathname === '/settings'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
