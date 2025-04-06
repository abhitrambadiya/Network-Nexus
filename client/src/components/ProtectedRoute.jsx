// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminToken') ? true : false;
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin-login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;