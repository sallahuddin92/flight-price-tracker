import type { User, UserPreferences, FlightOffer, PriceAlert } from './types';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    preferences: {
      currency: 'USD',
      cabinClass: 'ECONOMY',
      notifications: {
        email: true,
        push: true,
      },
    },
  },
];

const mockFlights: FlightOffer[] = [
  {
    id: '1',
    airline: 'BA',
    flightNumber: 'BA123',
    origin: 'LHR',
    destination: 'JFK',
    departureTime: '2024-03-20T10:00:00Z',
    arrivalTime: '2024-03-20T13:00:00Z',
    duration: '7h 0m',
    stops: 0,
    price: 500,
    currency: 'USD',
    cabinClass: 'ECONOMY',
    availableSeats: 10,
    aircraft: 'B777',
    priceHistory: [
      { date: '2024-03-15', price: 550, currency: 'USD' },
      { date: '2024-03-16', price: 500, currency: 'USD' },
    ],
  },
];

const mockPriceAlerts: PriceAlert[] = [];

// Mock services
export const mockAuthService = {
  async getCurrentUser(): Promise<User | null> {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  },

  async login(email: string, password: string): Promise<User> {
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  async register(userData: { name: string; email: string; password: string }): Promise<User> {
    const newUser: User = {
      id: String(mockUsers.length + 1),
      name: userData.name,
      email: userData.email,
      preferences: {
        currency: 'USD',
        cabinClass: 'ECONOMY',
        notifications: {
          email: true,
          push: true,
        },
      },
    };
    mockUsers.push(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  },

  logout(): void {
    localStorage.removeItem('user');
  },

  async updateUserPreferences(preferences: UserPreferences): Promise<User> {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      throw new Error('User not found');
    }
    const user = JSON.parse(storedUser);
    const updatedUser = {
      ...user,
      preferences,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  },
};

export const mockFlightService = {
  async searchFlights(params: any): Promise<FlightOffer[]> {
    return mockFlights;
  },

  async getFlightDetails(id: string): Promise<FlightOffer | null> {
    return mockFlights.find(f => f.id === id) || null;
  },
};

export const mockAlertService = {
  async getPriceAlerts(): Promise<PriceAlert[]> {
    return mockPriceAlerts;
  },

  async createPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt' | 'updatedAt'>): Promise<PriceAlert> {
    const newAlert: PriceAlert = {
      ...alert,
      id: String(mockPriceAlerts.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPriceAlerts.push(newAlert);
    return newAlert;
  },

  async deletePriceAlert(id: string): Promise<void> {
    const index = mockPriceAlerts.findIndex(a => a.id === id);
    if (index !== -1) {
      mockPriceAlerts.splice(index, 1);
    }
  },
}; 