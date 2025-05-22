import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ServiceProvider } from './providers/ServiceProvider';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FlightDetails from './pages/FlightDetails';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <ServiceProvider>
          <AuthProvider>
            <AlertProvider>
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/flight/:id"
                      element={
                        <PrivateRoute>
                          <FlightDetails />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <PrivateRoute>
                          <Settings />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </main>
              </div>
            </AlertProvider>
          </AuthProvider>
        </ServiceProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
