import React, { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useAlerts } from '../context/AlertContext';

interface PriceAlertBoxProps {
  flightId: string;
  origin: string;
  destination: string;
  currentPrice: number;
  currency: string;
}

const PriceAlertBox: React.FC<PriceAlertBoxProps> = ({
  flightId,
  origin,
  destination,
  currentPrice,
  currency
}) => {
  const { addAlert, removeAlert, hasAlert, getAlert } = useAlerts();
  const [isSettingAlert, setIsSettingAlert] = useState(false);
  const [targetPrice, setTargetPrice] = useState<number>(
    getAlert(flightId)?.targetPrice || Math.floor(currentPrice * 0.9)
  );
  
  const existingAlert = getAlert(flightId);
  const hasExistingAlert = !!existingAlert;
  
  const handleSetAlert = () => {
    if (hasExistingAlert) {
      removeAlert(flightId);
      return;
    }
    
    if (isSettingAlert) {
      addAlert({
        flightId,
        origin,
        destination,
        targetPrice,
        currentPrice,
        currency
      });
      setIsSettingAlert(false);
    } else {
      setIsSettingAlert(true);
    }
  };
  
  const handleCancelAlert = () => {
    setIsSettingAlert(false);
  };
  
  const isPriceBelowTarget = currentPrice <= (existingAlert?.targetPrice || Infinity);
  
  return (
    <div className="mt-2">
      {hasExistingAlert && (
        <div className={`text-sm rounded-md p-2 mb-2 ${
          isPriceBelowTarget 
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
            : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
        }`}>
          {isPriceBelowTarget ? (
            <div className="flex items-center">
              <Bell className="h-4 w-4 mr-1" />
              <span>Price alert triggered! Current price is below your target of {currency} {existingAlert.targetPrice}</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Bell className="h-4 w-4 mr-1" />
              <span>Alert set for {currency} {existingAlert.targetPrice}</span>
            </div>
          )}
        </div>
      )}
      
      {isSettingAlert && !hasExistingAlert && (
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Set your target price ({currency})
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              min={1}
              max={currentPrice}
              step={1}
            />
          </div>
          <div className="flex justify-between mt-2">
            <button
              onClick={handleCancelAlert}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSetAlert}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
            >
              Set Alert
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={handleSetAlert}
        className={`flex items-center text-sm ${
          hasExistingAlert
            ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
            : 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
        }`}
      >
        {hasExistingAlert ? (
          <>
            <BellOff className="h-4 w-4 mr-1" />
            Remove Alert
          </>
        ) : (
          <>
            <Bell className="h-4 w-4 mr-1" />
            {isSettingAlert ? 'Confirm Alert' : 'Set Price Alert'}
          </>
        )}
      </button>
    </div>
  );
};

export default PriceAlertBox;
