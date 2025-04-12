import React from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
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
      {/* Navbar */}
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
        <section className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Internship Opportunity</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Internship Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter internship title"
                  required
                />
              </div>
              
              {/* Company Name field */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter company name"
                  required
                />
              </div>
              
              {/* Location field */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter location (or 'Remote')"
                  required
                />
              </div>
              
              {/* Time Duration field */}
              <div>
                <label htmlFor="timeDuration" className="block text-sm font-medium text-gray-700 mb-1">Time Duration</label>
                <select
                  id="timeDuration"
                  name="timeDuration"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select duration</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                  <option value="1 year">1 year</option>
                </select>
              </div>
              
              {/* Stipend field */}
              <div>
                <label htmlFor="stipend" className="block text-sm font-medium text-gray-700 mb-1">Stipend</label>
                <input
                  type="text"
                  id="stipend"
                  name="stipend"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter stipend amount"
                  required
                />
              </div>
              
              {/* Maximum Field Limit field */}
              <div>
                <label htmlFor="maxFieldLimit" className="block text-sm font-medium text-gray-700 mb-1">Maximum Number of Applicants</label>
                <input
                  type="number"
                  id="maxFieldLimit"
                  name="maxFieldLimit"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter maximum number of applicants"
                  required
                />
              </div>
              
              {/* Study Year field */}
              
            </div>
            
            {/* Description field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter detailed internship description and responsibilities"
                required
              />
            </div>
            
            {/* Date field */}
            <div>
              <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input
                type="date"
                id="applicationDeadline"
                name="applicationDeadline"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="isPaid"
                name="isPaid"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-700">
                This is a paid internship
              </label>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Post Internship Opportunity
              </button>
            </div>
          </form>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <h3 className="text-lg font-semibold mb-4">AlumniConnect</h3>
            <p className="text-gray-400">Connecting students & alumni for a stronger community and brighter future.</p>
          </div>
          
          <div className="md:col-span-7 grid grid-cols-2 gap-8 pl-8 md:pl-16">
            <div>
              <h4 className="font-medium mb-2">Quick Links</h4>
              <ul className="text-gray-400 space-y-1">
                <li><a href="https://www.kitcoek.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">KITCoEK</a></li>
                <li><a href="https://www.kitirf.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">IRF</a></li>
                <li>Hall of Fame</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Resources</h4>
              <ul className="text-gray-400 space-y-1">
                <li>Blog</li>
                <li>Google Drive</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">©️ 2025 AlumniConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;