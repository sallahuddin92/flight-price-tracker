import React, { useState, useEffect } from 'react';
import FlightCard from '../components/FlightCard';
import PromoSection from '../components/PromoSection';
import { Search, Calendar, MapPin } from 'lucide-react';
import flightData from '../data/flights.json';
import { useAlerts } from '../context/AlertContext';

interface Flight {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  currency: string;
  duration: string;
  flightNumber: string;
  aircraft: string;
  availableSeats: number;
}

// Get unique origins and destinations for dropdown options
const getUniqueLocations = () => {
  const origins = new Set(flightData.map((flight: Flight) => flight.origin));
  const destinations = new Set(flightData.map((flight: Flight) => flight.destination));
  
  return {
    origins: Array.from(origins),
    destinations: Array.from(destinations)
  };
};

const SearchFlightsPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  
  // Search form state
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [date, setDate] = useState<string>('');
  
  const { origins, destinations } = getUniqueLocations();

  // Load flight data
  useEffect(() => {
    try {
      setFlights(flightData);
      setFilteredFlights(flightData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load flight data');
      setLoading(false);
    }
  }, []);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Filter flights based on search criteria
    const filtered = flights.filter((flight) => {
      const matchOrigin = origin ? flight.origin === origin : true;
      const matchDestination = destination ? flight.destination === destination : true;
      
      // If date is provided, check if flight departure date matches
      const matchDate = date ? new Date(flight.departureTime).toISOString().split('T')[0] === date : true;
      
      return matchOrigin && matchDestination && matchDate;
    });
    
    setFilteredFlights(filtered);
    setLoading(false);
    
    // Show toast notification
    if (filtered.length === 0) {
      showToastNotification('No flights found matching your criteria');
    } else {
      showToastNotification(`Found ${filtered.length} flights`);
    }
  };

  // No longer needed as PriceAlertBox handles this directly
  // Keeping the toast notification function for other notifications

  // Toast notification helper
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Flight Ticket Price Tracker
      </h1>
      
      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Origin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Origin</option>
                  {origins.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destination
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Destination</option>
                  {destinations.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Departure Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Search className="h-5 w-5 mr-2" />
              Search Flights
            </button>
          </div>
        </form>
      </div>
      
      {/* Flight Results */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {filteredFlights.length > 0 ? 'Available Flights' : 'No Flights Found'}
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                id={flight.id}
                airline={flight.airline}
                origin={flight.origin}
                destination={flight.destination}
                departureTime={flight.departureTime}
                arrivalTime={flight.arrivalTime}
                price={flight.price}
                currency={flight.currency}
                duration={flight.duration}
                flightNumber={flight.flightNumber}
                onSetAlert={handleSetAlert}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Promo Section */}
      <PromoSection />
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-out">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default SearchFlightsPage;
