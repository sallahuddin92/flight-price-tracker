import { API_CONFIG } from '../config/api';
import type { FlightOffer, FlightSearchParams } from './types';

interface AmadeusToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class RealFlightService {
  private token: string | null = null;
  private tokenExpiry: number = 0;

  private async getToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: API_CONFIG.AMADEUS.CLIENT_ID,
        client_secret: API_CONFIG.AMADEUS.CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get Amadeus API token');
    }

    const data: AmadeusToken = await response.json();
    this.token = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000);
    return this.token;
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}) {
    const token = await this.getToken();
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_CONFIG.AMADEUS.BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Amadeus API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
    try {
      const response = await this.makeRequest('/shopping/flight-offers', {
        originLocationCode: params.origin,
        destinationLocationCode: params.destination,
        departureDate: params.departureDate,
        returnDate: params.returnDate || '',
        adults: params.adults?.toString() || '1',
        children: params.children?.toString() || '0',
        infants: params.infants?.toString() || '0',
        travelClass: params.cabinClass || 'ECONOMY',
        currencyCode: params.currency || 'USD',
        max: '20',
      });

      return response.data.map((offer: any) => ({
        id: offer.id,
        airline: offer.itineraries[0].segments[0].carrierCode,
        flightNumber: offer.itineraries[0].segments[0].number,
        origin: offer.itineraries[0].segments[0].departure.iataCode,
        destination: offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.iataCode,
        departureTime: offer.itineraries[0].segments[0].departure.at,
        arrivalTime: offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.at,
        duration: this.calculateDuration(
          offer.itineraries[0].segments[0].departure.at,
          offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.at
        ),
        stops: offer.itineraries[0].segments.length - 1,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        cabinClass: offer.travelerPricings[0].fareDetailsBySegment[0].cabin,
        availableSeats: offer.numberOfBookableSeats,
        aircraft: offer.itineraries[0].segments[0].aircraft.code,
        priceHistory: [], // We'll need to implement price history tracking separately
      }));
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  }

  async getFlightDetails(flightId: string): Promise<FlightOffer | null> {
    try {
      const response = await this.makeRequest(`/shopping/flight-offers/${flightId}`);
      const offer = response.data;

      return {
        id: offer.id,
        airline: offer.itineraries[0].segments[0].carrierCode,
        flightNumber: offer.itineraries[0].segments[0].number,
        origin: offer.itineraries[0].segments[0].departure.iataCode,
        destination: offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.iataCode,
        departureTime: offer.itineraries[0].segments[0].departure.at,
        arrivalTime: offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.at,
        duration: this.calculateDuration(
          offer.itineraries[0].segments[0].departure.at,
          offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.at
        ),
        stops: offer.itineraries[0].segments.length - 1,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        cabinClass: offer.travelerPricings[0].fareDetailsBySegment[0].cabin,
        availableSeats: offer.numberOfBookableSeats,
        aircraft: offer.itineraries[0].segments[0].aircraft.code,
        priceHistory: [], // We'll need to implement price history tracking separately
      };
    } catch (error) {
      console.error('Error getting flight details:', error);
      return null;
    }
  }

  private calculateDuration(departureTime: string, arrivalTime: string): string {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const durationMs = arrival.getTime() - departure.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }
}

export const realFlightService = new RealFlightService(); 