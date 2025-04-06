// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const alumniProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('alumniToken') ? true : false;
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/alumni-login" replace />;
  }
  
  return children;
};

export default alumniProtectedRoute;