// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ContestProvider } from './context/ContestContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';

// Pages
import HomePage from './pages/HomePage';
import ContestStatusPage from './pages/ContestStatusPage';
import BookmarksPage from './pages/BookmarksPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [alert, setAlert] = useState(null);

  // Show alert message
  const showAlert = (message, type = 'info', timeout = 5000) => {
    setAlert({ message, type });

    // Auto-dismiss the alert after timeout
    setTimeout(() => {
      setAlert(null);
    }, timeout);
  };

  // Clear alert
  const clearAlert = () => {
    setAlert(null);
  };

  // Global error handler
  useEffect(() => {
    const handleGlobalError = (error) => {
      console.error('Global error:', error);
      showAlert(error.message || 'An unexpected error occurred', 'error');
    };

    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ContestProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <Navbar />

              <main className="flex-grow">
                <Alert
                  message={alert?.message}
                  type={alert?.type}
                  onClose={clearAlert}
                />

                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/upcoming" element={<ContestStatusPage status="upcoming" />} />
                    <Route path="/ongoing" element={<ContestStatusPage status="ongoing" />} />
                    <Route path="/past" element={<ContestStatusPage status="past" />} />
                    <Route path="/bookmarks" element={<BookmarksPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </AnimatePresence>
              </main>

              <Footer />
            </div>
          </Router>
        </ContestProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;