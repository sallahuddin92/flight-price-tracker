export interface FlightOffer {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  availableSeats: number;
  aircraft: string;
  priceHistory: PriceHistoryEntry[];
}

export interface PriceHistoryEntry {
  date: string;
  price: number;
  currency: string;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: string;
  currency?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  currency: string;
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  notifications: {
    email: boolean;
    push: boolean;
  };
}

export interface PriceAlert {
  id: string;
  userId: string;
  flightId: string;
  targetPrice: number;
  currency: string;
  isTriggered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  currency: string;
  adults?: number;
  children?: number;
  infants?: number;
} 