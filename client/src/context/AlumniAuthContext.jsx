// context/AlumniAuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AlumniAuthContext = createContext(null);

// Provider component
export const AlumniAuthProvider = ({ children }) => {
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load alumni data from localStorage on initial render
    const loadAlumniData = () => {
      try {
        const alumniInfo = localStorage.getItem('alumniInfo');
        if (alumniInfo) {
          setAlumni(JSON.parse(alumniInfo));
        }
      } catch (error) {
        console.error("Error loading alumni data:", error);
        // Clear potentially corrupted data
        localStorage.removeItem('alumniToken');
        localStorage.removeItem('alumniInfo');
      } finally {
        setLoading(false);
      }
    };

    loadAlumniData();
  }, []);

  // Logout function to clear storage and state
  const logout = () => {
    localStorage.removeItem('alumniToken');
    localStorage.removeItem('alumniInfo');
    setAlumni(null);
    window.location.href = '/alumni-login';
  };

  // Update alumni info (useful after profile updates)
  const updateAlumniInfo = (newInfo) => {
    localStorage.setItem('alumniInfo', JSON.stringify(newInfo));
    setAlumni(newInfo);
  };

  // Check if the user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('alumniToken');
  };

  // Context value
  const value = {
    alumni,
    loading,
    logout,
    updateAlumniInfo,
    isAuthenticated
  };

  return (
    <AlumniAuthContext.Provider value={value}>
      {children}
    </AlumniAuthContext.Provider>
  );
};

// Custom hook for using the alumni auth context
export const useAlumniAuth = () => {
  const context = useContext(AlumniAuthContext);
  if (context === null) {
    throw new Error('useAlumniAuth must be used within an AlumniAuthProvider');
  }
  return context;
};