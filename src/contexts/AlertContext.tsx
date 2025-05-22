import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PriceAlert } from '../services/types';
import { mockAlertService } from '../services/mockService';
import { useAuth } from './AuthContext';

interface AlertContextType {
  alerts: PriceAlert[];
  loading: boolean;
  error: string | null;
  getPriceAlerts: () => Promise<void>;
  createPriceAlert: (alert: Omit<PriceAlert, 'id' | 'userId' | 'isTriggered' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deletePriceAlert: (alertId: string) => Promise<void>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getPriceAlerts();
    } else {
      setAlerts([]);
    }
  }, [user]);

  const getPriceAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const priceAlerts = await mockAlertService.getPriceAlerts();
      setAlerts(priceAlerts);
    } catch (err) {
      setError('Failed to fetch price alerts');
    } finally {
      setLoading(false);
    }
  };

  const createPriceAlert = async (alert: Omit<PriceAlert, 'id' | 'userId' | 'isTriggered' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      throw new Error('User not logged in');
    }
    try {
      setLoading(true);
      setError(null);
      const newAlert = await mockAlertService.createPriceAlert({
        ...alert,
        userId: user.id,
        isTriggered: false,
      });
      setAlerts(prev => [...prev, newAlert]);
    } catch (err) {
      setError('Failed to create price alert');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePriceAlert = async (alertId: string) => {
    try {
      setLoading(true);
      setError(null);
      await mockAlertService.deletePriceAlert(alertId);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (err) {
      setError('Failed to delete price alert');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        loading,
        error,
        getPriceAlerts,
        createPriceAlert,
        deletePriceAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
}; 