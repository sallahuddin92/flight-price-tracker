import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAlerts } from '../contexts/AlertContext';
import { useServices } from '../providers/ServiceProvider';
import type { FlightOffer } from '../services/types';
import type { PriceAlert } from '../services/notificationService';

interface Seat {
  id: string;
  number: string;
  type: 'WINDOW' | 'AISLE' | 'MIDDLE';
  available: boolean;
  price: number;
}

interface BaggageAllowance {
  cabin: {
    weight: number;
    dimensions: string;
  };
  checked: {
    weight: number;
    dimensions: string;
    pieces: number;
  };
}

const FlightDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { alerts, createPriceAlert } = useAlerts();
  const { flightService } = useServices();
  const [flight, setFlight] = useState<FlightOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [baggageInfo, setBaggageInfo] = useState<BaggageAllowance>({
    cabin: { weight: 7, dimensions: '55x40x20' },
    checked: { weight: 23, dimensions: '90x75x43', pieces: 1 },
  });
  const [showAlertForm, setShowAlertForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFlightDetails(id);
    }
  }, [id]);

  const fetchFlightDetails = async (flightId: string) => {
    try {
      setLoading(true);
      setError(null);
      const flightDetails = await flightService.getFlightDetails(flightId);
      if (flightDetails) {
        setFlight(flightDetails);
        setTargetPrice(flightDetails.price);
      } else {
        setError('Flight not found');
      }
    } catch (err) {
      setError('Failed to fetch flight details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/new?flightId=${id}&seats=${selectedSeats.join(',')}`);
  };

  const handleCreateAlert = async () => {
    if (!flight || !user) return;

    try {
      await createPriceAlert({
        flightId: flight.id,
        targetPrice,
        currency: flight.currency,
      });
      setShowAlertForm(false);
    } catch (err) {
      setError('Failed to create price alert');
    }
  };

  const handleSeatSelection = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading flight details...</div>
        </div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-500">{error || 'Flight not found'}</div>
        </div>
      </div>
    );
  }

  const existingAlert = alerts.find(alert => alert.flightId === flight.id);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Flight Details
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {flight.origin} → {flight.destination}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {flight.price} {flight.currency}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {flight.availableSeats} seats left
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Flight Information
              </h2>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between py-4">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={`https://daisycon.io/images/airline/?width=100&height=30&color=ffffff&iata=${flight.airline}`}
                          alt={flight.airline}
                          className="h-8 w-auto"
                        />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {flight.airline} {flight.flightNumber}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {flight.aircraft}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(flight.departureTime).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {flight.origin}
                    </p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {flight.duration}
                    </p>
                    <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700 my-2"></div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {flight.stops === 0 ? 'Direct' : `${flight.stops} stops`}
                    </p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(flight.arrivalTime).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {flight.destination}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Baggage Allowance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Cabin Baggage
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Weight: {baggageInfo.cabin.weight}kg
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dimensions: {baggageInfo.cabin.dimensions}cm
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Checked Baggage
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Weight: {baggageInfo.checked.weight}kg
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dimensions: {baggageInfo.checked.dimensions}cm
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pieces: {baggageInfo.checked.pieces}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Price History
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="space-y-2">
                  {flight.priceHistory.map((history, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        {new Date(history.date).toLocaleDateString()}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {history.price} {history.currency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setShowAlertForm(true)}
                className="w-full mb-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {showAlertForm ? 'Hide Alert Form' : 'Set Price Alert'}
              </button>

              {showAlertForm && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Set Price Alert</h3>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(Number(e.target.value))}
                      className="px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                      min={0}
                      step={0.01}
                    />
                    <button
                      onClick={handleCreateAlert}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Create Alert
                    </button>
                    <button
                      onClick={() => setShowAlertForm(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {existingAlert && (
                <div className="mt-2 text-green-600 dark:text-green-400">
                  Price alert set at {existingAlert.currency} {existingAlert.targetPrice}
                </div>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={() => setShowSeatMap(!showSeatMap)}
                className="w-full mb-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {showSeatMap ? 'Hide Seat Map' : 'Show Seat Map'}
              </button>

              {showSeatMap && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-6 gap-2">
                    {/* This is a simplified seat map. In a real application, you would fetch the actual seat layout from the API */}
                    {Array.from({ length: 30 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handleSeatSelection(`seat-${i + 1}`)}
                        className={`p-2 rounded ${
                          selectedSeats.includes(`seat-${i + 1}`)
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleBookFlight}
                disabled={!selectedSeats.length}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {selectedSeats.length
                  ? `Book Selected Seats (${selectedSeats.length})`
                  : 'Select Seats to Book'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails; 