import type { FlightOffer } from './flightService';
import type { PriceAlert } from './alertService';
import type { User } from './authService';

export const mockFlights: FlightOffer[] = [
  {
    id: '1',
    airline: 'Emirates',
    flightNumber: 'EK123',
    origin: 'JFK',
    destination: 'DXB',
    departureTime: '2024-04-01T10:00:00Z',
    arrivalTime: '2024-04-02T08:00:00Z',
    duration: '14h 00m',
    stops: 0,
    price: 899,
    currency: 'USD',
    availableSeats: 45,
    aircraft: 'Boeing 777-300ER',
    cabinClass: 'Economy',
    priceHistory: [
      { price: 950, date: '2024-03-01', currency: 'USD' },
      { price: 925, date: '2024-03-15', currency: 'USD' },
      { price: 899, date: '2024-03-30', currency: 'USD' },
    ],
  },
  {
    id: '2',
    airline: 'Qatar Airways',
    flightNumber: 'QR456',
    origin: 'LAX',
    destination: 'DOH',
    departureTime: '2024-04-01T14:30:00Z',
    arrivalTime: '2024-04-02T16:45:00Z',
    duration: '16h 15m',
    stops: 1,
    price: 1099,
    currency: 'USD',
    availableSeats: 32,
    aircraft: 'Airbus A350-1000',
    cabinClass: 'Business',
    priceHistory: [
      { price: 1200, date: '2024-03-01', currency: 'USD' },
      { price: 1150, date: '2024-03-15', currency: 'USD' },
      { price: 1099, date: '2024-03-30', currency: 'USD' },
    ],
  },
];

export const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  preferences: {
    defaultCurrency: 'USD',
    defaultCabinClass: 'Economy',
    emailNotifications: true,
    pushNotifications: true,
    savedSearches: [],
  },
};

export const mockPriceAlerts: PriceAlert[] = [
  {
    id: '1',
    flightId: '1',
    userId: '1',
    targetPrice: 850,
    currency: 'USD',
    currentPrice: 899,
    isTriggered: false,
    createdAt: '2024-03-25T10:00:00Z',
    updatedAt: '2024-03-25T10:00:00Z',
  },
  {
    id: '2',
    flightId: '2',
    userId: '1',
    targetPrice: 1000,
    currency: 'USD',
    currentPrice: 1099,
    isTriggered: false,
    createdAt: '2024-03-26T15:30:00Z',
    updatedAt: '2024-03-26T15:30:00Z',
  },
]; 