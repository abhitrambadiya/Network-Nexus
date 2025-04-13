import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAlumniAuth } from '../../context/AlumniAuthContext.jsx';
import LoadingScreen from "../../components/LoadingScreen.jsx";
import apiAlumni from './api.js'; // Assuming you have an API service

function AlumniInternshipForm() {
  const { alumni, logout, loading: authLoading } = useAlumniAuth();
  const [loading, setLoading] = useState(true);
  const [alumniData, setAlumniData] = useState(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    mode: '',
    duration: '',
    stipend: '',
    limit: '',
    description: '',
    prerequisites: '',
    requiredSkills: '',
    deadline: ''
  });

  const avatarColors = ['646cff', 'f97316', '10b981', '3b82f6', 'ef4444', 'a855f7'];
  
  const getAvatarUrl = (fullName) => {
    if (!fullName) return '';
    return `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=${getRandomColor(fullName)}`;
  };
  
  const getRandomColor = (fullName) => {
    if (!fullName) return avatarColors[0];
    const index = [...fullName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarColors.length;
    return avatarColors[index];
  };

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
      const internshipData = {
        ...formData,
        deadline: new Date(formData.deadline).toLocaleDateString(),
        alumniName: alumniData.fullName,
        alumniCompany: alumniData.companyName,
        alumniPosition: alumniData.jobPosition,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()),
        isApproved: false,
        isMarkAsComplete: false,
        participants: []
      };
      
      // Submit the internship opportunity
      const response = await apiAlumni.post('/internships', internshipData);
      
      if (response.status === 201) {
        alert('Internship opportunity posted successfully!');
        navigate('/alumni-home');
      }
    } catch (error) {
      console.error('Failed to post internship:', error);
      alert('Failed to post internship opportunity. Please try again.');
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
    return <LoadingScreen message="Loading add internships..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Navbar */}
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
        <section className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Internship Opportunity</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Internship Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
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
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter company name"
                  required
                />
              </div>
              
              {/* Location field */}
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
              
              {/* Time Duration field */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Time Duration</label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
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
                  value={formData.stipend}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter stipend amount"
                  required
                />
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
                placeholder="Enter detailed internship description and responsibilities"
                required
              />
            </div>

            {/* Prerequisites field */}
            <div>
              <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700 mb-1">Required Prerequisites</label>
              <textarea
                id="prerequisites"
                name="prerequisites"
                rows={1}
                value={formData.prerequisites}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="E.g. Basics in Figma and UI design or wireframing knowledge."
                required
              />
            </div>

            {/* Skills field */}
            <div>
              <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
              <textarea
                id="requiredSkills"
                name="requiredSkills"
                rows={1}
                value={formData.requiredSkills}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="E.g. Python, C, R, Java, MERN (comma separated)"
                required
              />
            </div>
            
            {/* Date field */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post Internship Opportunity'}
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

export default AlumniInternshipForm;