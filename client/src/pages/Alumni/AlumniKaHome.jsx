import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AlumniKaHome() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
        await axios.post('http://localhost:5001/api/alumni/logout', {}, { withCredentials: true });

        // Clear localStorage (if token is stored)
        localStorage.removeItem('alumniToken');

        // Redirect to login
        navigate('/alumni-login');
    } catch (error) {
        console.error('Logout failed:', error);
    }
}; 
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <nav className="bg-white shadow fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-indigo-600 no-underline">Alumni Hub</a>
          <div className="flex items-center gap-8">
            {/* <a href="/qa" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Q&A</a> */}
            {/* <a href="/events" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Personalized Events</a> */}
            <a href="/resources" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Study Resources</a>
            <a href="/internship" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Add Mentorship</a>
            <a href="/internship" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Add Internship</a>
            <button onClick={handleLogout} className="text-gray-700 border border-gray-300 px-4 py-1.5 rounded-md ml-4 hover:text-indigo-600 hover:border-indigo-600 hover:bg-gray-50 transition-all no-underline font-medium">
            Logout
          </button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto mt-24 mb-8 px-8 w-full">
        <section className="bg-white rounded-lg p-8 mb-8 shadow">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            <img
              src= "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80"
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">John Doe</h1>
              <p className="text-gray-600">Class of 2020</p>
              <p className="text-gray-600">Computer Science</p>
              <p className="text-gray-600">Software Engineer at Tech Corp</p>
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