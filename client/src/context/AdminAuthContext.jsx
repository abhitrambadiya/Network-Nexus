// context/AdminAuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AdminAuthContext = createContext(null);

// Provider component
export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load admin data from localStorage on initial render
    const loadAdminData = () => {
      try {
        const adminInfo = localStorage.getItem('adminInfo');
        if (adminInfo) {
          setAdmin(JSON.parse(adminInfo));
        }
      } catch (error) {
        console.error("Error loading admin data:", error);
        // Clear potentially corrupted data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  // Logout function to clear storage and state
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setAdmin(null);
    window.location.href = '/admin-login';
  };

  // Update admin info (useful after profile updates)
  const updateAdminInfo = (newInfo) => {
    localStorage.setItem('adminInfo', JSON.stringify(newInfo));
    setAdmin(newInfo);
  };

  // Check if the user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('adminToken');
  };

  // Context value
  const value = {
    admin,
    loading,
    logout,
    updateAdminInfo,
    isAuthenticated
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook for using the admin auth context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === null) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};