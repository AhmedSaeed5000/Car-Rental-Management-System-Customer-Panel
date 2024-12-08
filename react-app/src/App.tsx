import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { CarsPage } from './pages/CarsPage';
import { SearchPage } from './pages/SearchPage';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/cars" element={<CarsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default App;