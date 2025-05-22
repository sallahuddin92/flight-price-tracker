import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlightCard from '../src/components/FlightCard';
import { AlertProvider } from '../src/context/AlertContext';

// Mock the PriceAlertBox component
vi.mock('../src/components/PriceAlertBox', () => ({
  default: function MockPriceAlertBox() {
    return <div data-testid="price-alert-box">Price Alert Box</div>;
  }
}));

describe('FlightCard Component', () => {
  const mockFlight = {
    id: '1',
    airline: 'Test Airline',
    flightNumber: 'TA123',
    origin: 'New York',
    destination: 'London',
    price: 500,
    currency: 'USD',
    departureTime: '2024-03-20T10:00:00',
    arrivalTime: '2024-03-20T22:00:00',
    duration: '12h 00m'
  };

  it('renders flight information correctly', () => {
    render(
      <AlertProvider>
        <FlightCard {...mockFlight} />
      </AlertProvider>
    );

    expect(screen.getByText('Test Airline')).toBeInTheDocument();
    expect(screen.getByText('TA123')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('USD 500.00')).toBeInTheDocument();
  });

  it('renders price alert box', () => {
    render(
      <AlertProvider>
        <FlightCard {...mockFlight} />
      </AlertProvider>
    );

    expect(screen.getByTestId('price-alert-box')).toBeInTheDocument();
  });
});
