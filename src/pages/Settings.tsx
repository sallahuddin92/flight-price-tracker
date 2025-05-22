import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../providers/ServiceProvider';

const Settings: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const { authService } = useServices();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    defaultCurrency: user?.preferences.defaultCurrency || 'USD',
    defaultCabinClass: user?.preferences.defaultCabinClass || 'Economy',
    emailNotifications: user?.preferences.emailNotifications || false,
    pushNotifications: user?.preferences.pushNotifications || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await updatePreferences(preferences);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Default Currency
          </label>
          <select
            id="defaultCurrency"
            name="defaultCurrency"
            value={preferences.defaultCurrency}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
          </select>
        </div>

        <div>
          <label htmlFor="defaultCabinClass" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Default Cabin Class
          </label>
          <select
            id="defaultCabinClass"
            name="defaultCabinClass"
            value={preferences.defaultCabinClass}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Economy">Economy</option>
            <option value="Premium Economy">Premium Economy</option>
            <option value="Business">Business</option>
            <option value="First">First</option>
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="emailNotifications"
              name="emailNotifications"
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
            />
            <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Email Notifications
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="pushNotifications"
              name="pushNotifications"
              type="checkbox"
              checked={preferences.pushNotifications}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
            />
            <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Push Notifications
            </label>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
