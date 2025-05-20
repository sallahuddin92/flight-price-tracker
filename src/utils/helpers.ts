import { formatDistanceToNow } from 'date-fns';

// Format price with currency
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return `${currency} ${price.toFixed(2)}`;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format time for display
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get relative time (e.g., "2 days ago")
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Filter flights by criteria
export interface FlightFilterCriteria {
  origin?: string;
  destination?: string;
  date?: string;
  airline?: string;
  maxPrice?: number;
}

export interface Flight {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  currency: string;
  duration: string;
  flightNumber: string;
  aircraft: string;
  availableSeats: number;
}

export const filterFlights = (flights: Flight[], criteria: FlightFilterCriteria): Flight[] => {
  return flights.filter(flight => {
    // Match origin if specified
    if (criteria.origin && flight.origin !== criteria.origin) {
      return false;
    }
    
    // Match destination if specified
    if (criteria.destination && flight.destination !== criteria.destination) {
      return false;
    }
    
    // Match date if specified (compare only the date part)
    if (criteria.date) {
      const flightDate = new Date(flight.departureTime).toISOString().split('T')[0];
      if (flightDate !== criteria.date) {
        return false;
      }
    }
    
    // Match airline if specified
    if (criteria.airline && flight.airline !== criteria.airline) {
      return false;
    }
    
    // Check price is below max if specified
    if (criteria.maxPrice !== undefined && flight.price > criteria.maxPrice) {
      return false;
    }
    
    return true;
  });
};

// Get unique values from an array of objects for a specific key
export const getUniqueValues = <T, K extends keyof T>(items: T[], key: K): T[K][] => {
  const uniqueValues = new Set(items.map(item => item[key]));
  return Array.from(uniqueValues) as T[K][];
};
