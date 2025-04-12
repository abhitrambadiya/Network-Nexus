import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlumniAuth } from '../../context/AlumniAuthContext.jsx';
import LoadingScreen from "../../components/LoadingScreen.jsx";
import apiAlumni from './api.js'; // Assuming you have an API service

function AlumniMentorshipForm() {
  const { alumni, logout, loading: authLoading } = useAlumniAuth();
  const [loading, setLoading] = useState(true);
  const [alumniData, setAlumniData] = useState(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mode: '',
    targetAudience: '',
    date: '',
    department: '',
    studyYear: '',
    limit: ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!alumniData) {
      console.error('Alumni data not loaded');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare the data to submit
      const mentorshipData = {
        ...formData,
        date: new Date(formData.date).toLocaleDateString(),
        fullName: alumniData.fullName,
        companyName: alumniData.companyName,
        jobPosition: alumniData.jobPosition,
        isApproved: false,
        isMarkAsComplete: false,
        participants: []
      };
      
      // Submit the Mentorship opportunity
      const response = await apiAlumni.post('/mentorships', mentorshipData);
      
      if (response.status === 201) {
        alert('Mentorship opportunity posted successfully!');
        navigate('/alumni-home');
      }
    } catch (error) {
      console.error('Failed to post Mentorship:', error);
      alert('Failed to post Mentorship opportunity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5001/api/alumni/logout', {}, { withCredentials: true });
      localStorage.removeItem('alumniToken');
      navigate('/alumni-login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading add mentorships..." />;
  }

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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Mentorship Opportunity</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Mentorship Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Mentorship title"
                  required
                />
              </div>

              {/* Department field */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select mode</option>
                  <option value="CSE">Computer Science</option>
                  <option value="AIML">Artifical Intelligence</option>
                  <option value="ENTC">Electronic and Telecommunications</option>
                  <option value="MECH">Mechanical Department</option>
                  <option value="CIVIL">Civil Department</option>
                  <option value="All">Open for All</option>
                </select>
              </div>
              
              {/* Mode field */}
              <div>
                <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                <select
                  id="mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              
              {/* Date field */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
              
              {/* Study Year field */}
              <div>
                <label htmlFor="studyYear" className="block text-sm font-medium text-gray-700 mb-1">Study Year of Applicants</label>
                <select
                  id="studyYear"
                  name="studyYear"
                  value={formData.studyYear}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select mode</option>
                  <option value="FE">First Year</option>
                  <option value="SE">Second Year</option>
                  <option value="TE">Third Year</option>
                  <option value="BE">Final Year</option>
                  <option value="FE">First Year</option>
                  <option value="All">Open for All</option>
                </select>
              </div>
              
              {/* Maximum Field Limit field */}
              <div>
                <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">Maximum Number of Applicants</label>
                <input
                  type="number"
                  id="limit"
                  name="limit"
                  min="1"
                  value={formData.limit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter maximum number of applicants"
                  required
                />
              </div>
            </div>

            {/* Target Audience field */}
            <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <input
                  type="text"
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Target Audience"
                  required
                />
              </div>
            
            {/* Description field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter detailed Mentorship description and the topics to be covered."
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post Mentorship Opportunity'}
              </button>
            </div>
          </form>
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

export default AlumniMentorshipForm;