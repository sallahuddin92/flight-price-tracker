import React from 'react';
import { Clock, Plane } from 'lucide-react';
import PriceAlertBox from './PriceAlertBox';

interface FlightCardProps {
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
}

const FlightCard: React.FC<FlightCardProps> = ({
  id,
  airline,
  origin,
  destination,
  departureTime,
  arrivalTime,
  price,
  currency,
  duration,
  flightNumber,
}) => {
  // Format date and time for display
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
    };
  };

  const departure = formatDateTime(departureTime);
  const arrival = formatDateTime(arrivalTime);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{airline}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{flightNumber}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl text-blue-600 dark:text-blue-400">{currency} {price.toFixed(2)}</p>
          <PriceAlertBox 
            flightId={id}
            origin={origin}
            destination={destination}
            currentPrice={price}
            currency={currency}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="text-center">
          <p className="font-semibold text-lg">{departure.time}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{departure.date}</p>
          <p className="font-medium">{origin}</p>
        </div>
        
        <div className="flex-1 mx-4 relative">
          <div className="border-t-2 border-gray-300 dark:border-gray-600 w-full absolute top-1/2 transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-2">
            <Plane className="inline-block text-blue-500 rotate-90" size={16} />
          </div>
          <p className="text-xs text-center mt-4 flex items-center justify-center">
            <Clock className="inline-block mr-1" size={12} />
            {duration}
          </p>
        </div>
        
        <div className="text-center">
          <p className="font-semibold text-lg">{arrival.time}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{arrival.date}</p>
          <p className="font-medium">{destination}</p>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
