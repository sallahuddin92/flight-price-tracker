import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FlightCard from '../src/components/FlightCard';
import { AlertProvider } from '../src/context/AlertContext';

// Mock the PriceAlertBox component
jest.mock('../src/components/PriceAlertBox', () => {
  return function MockPriceAlertBox() {
    return <div data-testid="price-alert-box">Price Alert Box</div>;
  };
});

describe('FlightCard Component', () => {
  const mockProps = {
    id: 'FL001',
    airline: 'AirAsia',
    origin: 'KUL',
    destination: 'BKK',
    departureTime: '2025-06-01T08:30:00',
    arrivalTime: '2025-06-01T10:15:00',
    price: 129.99,
    currency: 'USD',
    duration: '1h 45m',
    flightNumber: 'AA1234',
  };

  test('renders flight information correctly', () => {
    render(
      <AlertProvider>
        <FlightCard {...mockProps} />
      </AlertProvider>
    );
    
    // Check if airline name is displayed
    expect(screen.getByText('AirAsia')).toBeInTheDocument();
    
    // Check if flight number is displayed
    expect(screen.getByText('AA1234')).toBeInTheDocument();
    
    // Check if price is displayed correctly
    expect(screen.getByText('USD 129.99')).toBeInTheDocument();
    
    // Check if origin and destination are displayed
    expect(screen.getByText('KUL')).toBeInTheDocument();
    expect(screen.getByText('BKK')).toBeInTheDocument();
    
    // Check if duration is displayed
    expect(screen.getByText('1h 45m')).toBeInTheDocument();
    
    // Check if PriceAlertBox is rendered
    expect(screen.getByTestId('price-alert-box')).toBeInTheDocument();
  });
});
