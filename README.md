# Flight Ticket Price Tracker Web App

A production-ready React application for tracking flight ticket prices and setting price alerts.

## Features

- **Search Flights**: Search for flights by origin, destination, and date
- **Price Alert System**: Set price alerts for specific routes and get notified when prices drop
- **Voucher & Promo Section**: View available promotions and discount codes
- **Settings**: Toggle dark mode and set email for future notifications
- **PWA Support**: Install as a Progressive Web App for offline access
- **Mobile-First Design**: Fully responsive UI optimized for all devices

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Data Fetching**: Native Fetch API
- **SEO**: React Helmet for meta tags
- **Code Splitting**: React.lazy and Suspense
- **PWA**: Service Worker for offline support
- **Testing**: Jest and React Testing Library

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flight-price-tracker.git
cd flight-price-tracker
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
pnpm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
flight-price-tracker/
├── public/                 # Static assets and PWA files
│   ├── manifest.json       # PWA manifest
│   └── service-worker.js   # Service worker for offline support
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/            # React Context providers
│   ├── data/               # Mock data files
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── utils/              # Helper functions
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Entry point
├── test/                   # Unit tests
└── README.md               # Project documentation
```

## Future Integration Ideas

- **Real API Integration**: Replace mock data with Skyscanner or Kiwi API
- **User Authentication**: Add login functionality with Firebase or Supabase
- **Email Notifications**: Implement email alerts when prices drop
- **Telegram Notifications**: Add Telegram bot integration for alerts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
