import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
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
            <Link to="/alumni-home" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Home</Link>
            <Link to="/alumni-faq" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Q&A</Link>
            <Link to="/alumni-studyresources" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Study Resources</Link>
            <Link to="/alumni-mentorship" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Add Mentorship</Link>
            <Link to="/alumni-internship" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Add Internsip</Link>
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
              {alumniData.jobPosition && alumniData.companyName && <p className="text-gray-600 mb-2">{alumniData.jobPosition} at {alumniData.companyName}</p>}
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

        <section className="bg-white rounded-lg p-8 shadow mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-">What's New in KITCoEK</h2>
          <div className="text-gray-700 mb-3">
            Discover the latest developments and initiatives at KIT College of Engineering that are transforming the learning experience and fostering innovation.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* AICTE Idea Lab */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="AICTE Idea Lab"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">AICTE Idea Lab</h3>
                <p className="text-gray-600 text-sm">Our newly established AICTE-approved Idea Lab provides students with cutting-edge facilities to prototype and test their innovative concepts.</p>
              </div>
            </div>

            {/* New Digital Library */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Digital Library"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">New Digital Library</h3>
                <p className="text-gray-600 text-sm">Access thousands of e-books, journals, and research papers through our upgraded digital library platform available 24/7.</p>
              </div>
            </div>

            {/* Third Box - Sample */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Student Innovation"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Student Innovation Grants</h3>
                <p className="text-gray-600 text-sm">Apply for our new innovation grants program that provides funding for student-led research projects and startups.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 no-underline">Settings</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 no-underline">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 no-underline">Guidelines</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 no-underline">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: info@kitcoek.in</li>
                <li className="text-gray-400">Address: R.S. No. 199B/1-3, Gokul - Shirgoan, Kolhapur - 416 234, Maharashtra</li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-8 mt-8 border-t border-gray-700 text-gray-400">
            ©️ {new Date().getFullYear()} Alumni Association Admin Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AlumniKaHome;