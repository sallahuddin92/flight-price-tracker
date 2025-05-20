import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Alert {
  flightId: string;
  origin: string;
  destination: string;
  targetPrice: number;
  currentPrice: number;
  currency: string;
  dateCreated: string;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'dateCreated'>) => void;
  removeAlert: (flightId: string) => void;
  hasAlert: (flightId: string) => boolean;
  getAlert: (flightId: string) => Alert | undefined;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Load alerts from localStorage on initial render
  useEffect(() => {
    const savedAlerts = localStorage.getItem('priceAlerts');
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch (error) {
        console.error('Failed to parse alerts from localStorage:', error);
        // If parsing fails, reset localStorage
        localStorage.removeItem('priceAlerts');
      }
    }
  }, []);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
  }, [alerts]);

  const addAlert = (alertData: Omit<Alert, 'dateCreated'>) => {
    const newAlert: Alert = {
      ...alertData,
      dateCreated: new Date().toISOString()
    };

    setAlerts(prevAlerts => {
      // Check if alert for this flight already exists
      const existingAlertIndex = prevAlerts.findIndex(alert => alert.flightId === newAlert.flightId);
      
      if (existingAlertIndex >= 0) {
        // Replace existing alert
        const updatedAlerts = [...prevAlerts];
        updatedAlerts[existingAlertIndex] = newAlert;
        return updatedAlerts;
      } else {
        // Add new alert
        return [...prevAlerts, newAlert];
      }
    });
  };

  const removeAlert = (flightId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.flightId !== flightId));
  };

  const hasAlert = (flightId: string) => {
    return alerts.some(alert => alert.flightId === flightId);
  };

  const getAlert = (flightId: string) => {
    return alerts.find(alert => alert.flightId === flightId);
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, hasAlert, getAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;
