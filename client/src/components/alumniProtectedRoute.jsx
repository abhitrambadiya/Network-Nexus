// components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const token = localStorage.getItem('alumniToken');
      const alumniInfo = localStorage.getItem('alumniInfo');
      
      if (!token || !alumniInfo) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      // Optional: Verify token expiration
      try {
        const alumniData = JSON.parse(alumniInfo);
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing alumni info", error);
        localStorage.removeItem('alumniToken');
        localStorage.removeItem('alumniInfo');
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    // You could return a loading spinner here if needed
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/alumni-login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;