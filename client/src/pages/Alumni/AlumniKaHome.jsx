import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import apiAlumni from './api.js'; // Adjust path as needed
import LoadingScreen from "../../components/LoadingScreen.jsx";
import { useAlumniAuth } from '../../context/AlumniAuthContext.jsx';

function AlumniKaHome() {
  const avatarColors = ['646cff', 'f97316', '10b981', '3b82f6', 'ef4444', 'a855f7'];
  
  const getAvatarUrl = (fullName) => {
    if (!fullName) return '';
    // DiceBear API for avatars
    return `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=${getRandomColor(fullName)}`;
  };
  
  const getRandomColor = (fullName) => {
    if (!fullName) return avatarColors[0];
    const index = [...fullName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarColors.length;
    return avatarColors[index];
  };

  const { alumni, logout, loading: authLoading } = useAlumniAuth();
  const [loading, setLoading] = useState(true);
  const [alumniData, setAlumniData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumniProfile = async () => {
      if (authLoading) return;
      
      const start = Date.now();
      try {
        const response = await apiAlumni.get('/profile');
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 1000 - elapsed);

        setTimeout(() => {
          setAlumniData(response.data);
          setLoading(false);
        }, delay);
      } catch (error) {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 1000 - elapsed);

        setTimeout(() => {
          console.error('Failed to fetch alumni profile:', error);
          navigate('/alumni-login');
          setLoading(false);
        }, delay);
      }
    };

    if (!authLoading) {
      fetchAlumniProfile();
    }
  }, [navigate, authLoading]);

  const handleLogout = async () => {
    try {
        await apiAlumni.post('/logout', {}, { withCredentials: true });
        logout(); // Use the logout function from context
    } catch (error) {
        console.error('Logout failed:', error);
        // Still attempt to logout locally if server logout fails
        logout();
    }
  }; 

  if (authLoading || loading) {
    return <LoadingScreen message="Loading alumni profile..." />;
  }

  if (!alumniData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-xl">
        No alumni data found. Please <button 
          onClick={() => navigate('/alumni-login')} 
          className="text-indigo-600 underline"
        >
          login again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <nav className="bg-white shadow fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <a href="/alumni-home" className="text-2xl font-bold text-indigo-600 no-underline">Alumni Hub</a>
          <div className="flex items-center gap-8">
            <a href="/qa" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Q&A</a>
            <a href="/events" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Personalized Events</a>
            <a href="/alumni-resources" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Study Resources</a>
            <a href="/alumni-mentorship" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Add Mentorship</a>
            <a href="/alumni-internship" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Add Internship</a>
            <button onClick={handleLogout} className="text-gray-700 border border-gray-300 px-4 py-1.5 rounded-md ml-4 hover:text-indigo-600 hover:border-indigo-600 hover:bg-gray-50 transition-all no-underline font-medium">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto mt-24 mb-8 px-8 w-full">
        <section className="bg-white rounded-lg p-8 mb-8 shadow">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-3">
            <img
              src={getAvatarUrl(alumniData.fullName)}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover bg-gray-100"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{alumniData.fullName}</h1>
              <p className="text-gray-600 mb-2">{alumniData.email}</p>
              {alumniData.department && <p className="text-gray-600 mb-2">Department of {alumniData.department}</p>}
              {alumniData.jobPosition && <p className="text-gray-600 mb-2">{alumniData.jobPosition}</p>}
              {alumniData.passOutYear && <p className="text-gray-600">Class of {alumniData.passOutYear}</p>}
            </div>
          </div>
        </section>
        
        <section className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Have a Startup Idea? Incubate at KIT's IRF</h2>
          <div className="text-gray-700 mb-6">
            KIT's Innovation and Research Foundation (IRF) is your gateway to transforming innovative ideas into successful startups. We provide comprehensive support, mentorship, and resources to help you build the next big thing.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mentorship & Guidance</h3>
              <p className="text-gray-600 text-sm">Get personalized mentorship from industry experts, successful entrepreneurs, and experienced faculty members.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Infrastructure Support</h3>
              <p className="text-gray-600 text-sm">Access state-of-the-art facilities, workspace, and technical resources to develop your prototype.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Funding Opportunities</h3>
              <p className="text-gray-600 text-sm">Connect with potential investors and explore various funding options to fuel your startup's growth.</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center gap-8 mb-4">
            <a href="/about" className="text-gray-300 hover:text-white transition-colors no-underline">About</a>
            <a href="/contact" className="text-gray-300 hover:text-white transition-colors no-underline">Contact</a>
            <a href="/privacy" className="text-gray-300 hover:text-white transition-colors no-underline">Privacy Policy</a>
            <a href="/terms" className="text-gray-300 hover:text-white transition-colors no-underline">Terms of Service</a>
          </div>
          <p className="text-gray-400 text-sm">©️ 2024 Alumni Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default AlumniKaHome;