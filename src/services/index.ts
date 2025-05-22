// Export types
export type { User, SavedSearch } from './authService';
export type { FlightOffer, SearchParams, FlightSearchParams } from './flightService';
export type { PriceAlert } from './alertService';

// Export mock services
export { mockAuthService, mockFlightService, mockAlertService } from './mockService';

// Export real services
export { login, register, loginWithGoogle, loginWithFacebook, updateUserPreferences, saveSearch, getSavedSearches, deleteSavedSearch } from './authService';
export { searchFlights, getFlightDetails, getPopularDestinations, getFlightPriceHistory, getAvailableCurrencies, convertCurrency } from './flightService';
export { createPriceAlert, getPriceAlerts, updatePriceAlert, deletePriceAlert, getTriggeredAlerts } from './alertService'; 