export const API_CONFIG = {
  AMADEUS: {
    BASE_URL: 'https://test.api.amadeus.com/v2',
    CLIENT_ID: process.env.VITE_AMADEUS_CLIENT_ID || '',
    CLIENT_SECRET: process.env.VITE_AMADEUS_CLIENT_SECRET || '',
  },
  // Add other API configurations here if needed
}; 