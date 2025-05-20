import React, { Suspense, lazy } from 'react';
import { AlertProvider } from './context/AlertContext';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import './App.css';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AlertProvider>
          <Router>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
              <Helmet>
                <title>Flight Ticket Price Tracker</title>
                <meta name="description" content="Track flight prices and get alerts when they drop below your target price" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <meta name="theme-color" content="#3B82F6" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icon-192x192.png" />
              </Helmet>
              
              <Navbar />
              <main>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </Router>
        </AlertProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
