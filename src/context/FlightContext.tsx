import React, { createContext, useContext, useState, useEffect } from 'react';
import { searchFlights, getAvailableCurrencies, FlightSearchParams, FlightOffer } from '../services/flightService';

interface FlightContextType {
  flights: FlightOffer[];
  loading: boolean;
  error: string | null;
  searchParams: FlightSearchParams;
  availableCurrencies: string[];
  selectedCurrency: string;
  setSearchParams: (params: Partial<FlightSearchParams>) => void;
  setSelectedCurrency: (currency: string) => void;
  searchFlights: () => Promise<void>;
}

const FlightContext = createContext<FlightContextType | undefined>(undefined);

export const FlightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  const [searchParams, setSearchParamsState] = useState<FlightSearchParams>({
    origin: '',
    destination: '',
    departureDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'ECONOMY',
    currency: 'USD',
  });

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const currencies = await getAvailableCurrencies();
        setAvailableCurrencies(currencies);
      } catch (err) {
        console.error('Error fetching currencies:', err);
      }
    };
    fetchCurrencies();
  }, []);

  const setSearchParams = (params: Partial<FlightSearchParams>) => {
    setSearchParamsState(prev => ({ ...prev, ...params }));
  };

  const searchFlightsHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchFlights({
        ...searchParams,
        currency: selectedCurrency,
      });
      setFlights(results);
    } catch (err) {
      setError('Failed to fetch flights. Please try again later.');
      console.error('Error searching flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    flights,
    loading,
    error,
    searchParams,
    availableCurrencies,
    selectedCurrency,
    setSearchParams,
    setSelectedCurrency,
    searchFlights: searchFlightsHandler,
  };

  return (
    <FlightContext.Provider value={value}>
      {children}
    </FlightContext.Provider>
  );
};

export const useFlights = () => {
  const context = useContext(FlightContext);
  if (context === undefined) {
    throw new Error('useFlights must be used within a FlightProvider');
  }
  return context;
}; 