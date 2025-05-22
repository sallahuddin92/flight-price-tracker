import React, { createContext, useContext, useState } from 'react';
import { mockService } from '../services/mockService';
import { FlightOffer } from '../services/flightService';

interface FlightContextType {
  flights: FlightOffer[];
  loading: boolean;
  error: string | null;
  searchFlights: (params: any) => Promise<void>;
  getFlightDetails: (id: string) => Promise<FlightOffer | null>;
}

const FlightContext = createContext<FlightContextType | undefined>(undefined);

export const FlightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = async (params: any) => {
    try {
      setLoading(true);
      setError(null);
      const results = await mockService.searchFlights(params);
      setFlights(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching flights');
    } finally {
      setLoading(false);
    }
  };

  const getFlightDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      return await mockService.getFlightDetails(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching flight details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlightContext.Provider value={{ flights, loading, error, searchFlights, getFlightDetails }}>
      {children}
    </FlightContext.Provider>
  );
};

export const useFlight = () => {
  const context = useContext(FlightContext);
  if (context === undefined) {
    throw new Error('useFlight must be used within a FlightProvider');
  }
  return context;
}; 