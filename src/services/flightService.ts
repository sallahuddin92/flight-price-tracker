import axios from 'axios';
import axiosInstance from './axios';

// You'll need to sign up for an API key from one of these services
const API_KEY = process.env.VITE_FLIGHT_API_KEY;
const API_BASE_URL = 'https://api.flight-service.com/v1'; // Replace with actual API endpoint

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  currency?: string;
}

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
  availableSeats: number;
  aircraft: string;
  cabinClass: string;
  priceHistory: {
    price: number;
    date: string;
    currency: string;
  }[];
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  currency: string;
}

interface PopularDestination {
  city: string;
  country: string;
  imageUrl: string;
}

export const searchFlights = async (params: SearchParams): Promise<FlightOffer[]> => {
  const response = await axiosInstance.get<FlightOffer[]>('/flights/search', { params });
  return response.data;
};

export const getFlightDetails = async (flightId: string): Promise<FlightOffer> => {
  const response = await axiosInstance.get<FlightOffer>(`/flights/${flightId}`);
  return response.data;
};

export const getPopularDestinations = async (): Promise<PopularDestination[]> => {
  const response = await axiosInstance.get<PopularDestination[]>('/flights/popular-destinations');
  return response.data;
};

export const getFlightPriceHistory = async (flightId: string): Promise<FlightOffer['priceHistory']> => {
  const response = await axiosInstance.get<FlightOffer['priceHistory']>(`/flights/${flightId}/price-history`);
  return response.data;
};

export const getAvailableCurrencies = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/currencies`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/currency/convert`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      params: {
        amount,
        from: fromCurrency,
        to: toCurrency,
      },
    });
    return response.data.convertedAmount;
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
}; 