// components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const adminInfo = localStorage.getItem('adminInfo');
      
      if (!token || !adminInfo) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      // Optional: Verify token expiration
      try {
        const adminData = JSON.parse(adminInfo);
        
        // If you have token expiration stored, you can check it here
        // Example: if (adminData.expiresAt && new Date(adminData.expiresAt) < new Date()) {
        //   localStorage.removeItem('adminToken');
        //   localStorage.removeItem('adminInfo');
        //   setIsAuthenticated(false);
        //   setIsLoading(false);
        //   return;
        // }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing admin info", error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
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
    return <Navigate to="/admin-login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;