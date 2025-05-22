import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface Passenger {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportExpiryDate: string;
}

export interface BookingRequest {
  flightId: string;
  passengers: Passenger[];
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  passengers: Passenger[];
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  totalPrice: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  clientSecret: string;
}

export const createBooking = async (bookingRequest: BookingRequest): Promise<Booking> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bookings`, bookingRequest, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getBooking = async (bookingId: string): Promise<Booking> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    await axios.post(
      `${API_BASE_URL}/bookings/${bookingId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

export const createPaymentIntent = async (bookingId: string): Promise<PaymentIntent> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/bookings/${bookingId}/payment-intent`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const confirmPayment = async (bookingId: string, paymentIntentId: string): Promise<Booking> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/bookings/${bookingId}/confirm-payment`,
      { paymentIntentId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

export const getBookingConfirmation = async (bookingId: string): Promise<string> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/${bookingId}/confirmation`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.confirmationUrl;
  } catch (error) {
    console.error('Error fetching booking confirmation:', error);
    throw error;
  }
}; 