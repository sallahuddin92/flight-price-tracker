import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../providers/ServiceProvider';
import type { FlightOffer, SearchParams } from '../services/types';
import { countries, getAirportsByCountry, type Airport } from '../data/airports';
import PriceCalendar from '../components/PriceCalendar';
import { DateRange } from 'react-day-picker';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { flightService } = useServices();
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOriginCountry, setSelectedOriginCountry] = useState<string>('');
  const [selectedDestinationCountry, setSelectedDestinationCountry] = useState<string>('');
  const [originAirports, setOriginAirports] = useState<Airport[]>([]);
  const [destinationAirports, setDestinationAirports] = useState<Airport[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [priceData, setPriceData] = useState<Array<{ date: Date; price: number; currency: string }>>([]);

  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    cabinClass: 'ECONOMY',
    currency: 'USD',
    adults: 1,
    children: 0,
    infants: 0,
  });

  useEffect(() => {
    if (user?.preferences) {
      setSearchParams(prev => ({
        ...prev,
        currency: user.preferences.currency,
        cabinClass: user.preferences.cabinClass,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (selectedOriginCountry) {
      setOriginAirports(getAirportsByCountry(selectedOriginCountry));
    } else {
      setOriginAirports([]);
    }
  }, [selectedOriginCountry]);

  useEffect(() => {
    if (selectedDestinationCountry) {
      setDestinationAirports(getAirportsByCountry(selectedDestinationCountry));
    } else {
      setDestinationAirports([]);
    }
  }, [selectedDestinationCountry]);

  useEffect(() => {
    if (dateRange?.from) {
      // Simulate fetching price data for the selected month
      const prices = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(dateRange.from!.getFullYear(), dateRange.from!.getMonth(), i + 1),
        price: Math.floor(Math.random() * 500) + 200,
        currency: searchParams.currency,
      }));
      setPriceData(prices);
    }
  }, [dateRange, searchParams.currency]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const results = await flightService.searchFlights(searchParams);
      setFlights(results);
    } catch (err) {
      setError('Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Find Your Flight</h1>

        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="originCountry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Origin Country
              </label>
              <select
                id="originCountry"
                value={selectedOriginCountry}
                onChange={(e) => setSelectedOriginCountry(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Origin Airport
              </label>
              <select
                id="origin"
                name="origin"
                value={searchParams.origin}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select an airport</option>
                {originAirports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="destinationCountry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Destination Country
              </label>
              <select
                id="destinationCountry"
                value={selectedDestinationCountry}
                onChange={(e) => setSelectedDestinationCountry(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Destination Airport
              </label>
              <select
                id="destination"
                name="destination"
                value={searchParams.destination}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select an airport</option>
                {destinationAirports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Dates
              </label>
              <PriceCalendar
                prices={priceData}
                selectedRange={dateRange}
                onSelect={setDateRange}
                currency={searchParams.currency}
              />
            </div>

            <div>
              <label htmlFor="cabinClass" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cabin Class
              </label>
              <select
                id="cabinClass"
                name="cabinClass"
                value={searchParams.cabinClass}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First</option>
              </select>
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={searchParams.currency}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Flights'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {flights.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Available Flights</h2>
            {flights.map(flight => (
              <div
                key={flight.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/flight/${flight.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {flight.airline} {flight.flightNumber}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {flight.origin} → {flight.destination}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(flight.departureTime).toLocaleString()} - {flight.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {flight.currency} {flight.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

