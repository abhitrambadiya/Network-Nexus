import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { GraduationCap, Users, Calendar, UserPlus, ClipboardList, LogOut } from 'lucide-react';
import api from './api.js';
import LoadingScreen from "../../components/LoadingScreen";
const avatarColors = ['646cff', 'f97316', '10b981', '3b82f6', 'ef4444', 'a855f7'];

function App() {
  const getAvatarUrl = (name) => {
    const index = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarColors.length;
    const background = avatarColors[index];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=fff`;
  };

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const start = Date.now();
      try {
        const response = await api.get('/profile');
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 1000 - elapsed);

        setTimeout(() => {
          setAdmin(response.data);
          setLoading(false);
        }, delay);
      } catch (error) {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 1000 - elapsed);

        setTimeout(() => {
          console.error('Failed to fetch admin profile:', error);
          navigate('/admin-login');
          setLoading(false);
        }, delay);
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  if (loading) {
    return <LoadingScreen message="Loading admin profile..." />;
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-xl">
        No admin data found
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5001/api/admin/logout', {}, { withCredentials: true });
      localStorage.removeItem('adminToken');
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
            <GraduationCap size={24} />
            Admin Panel
          </div>
          <Link to="/admin-login">
          <button onClick={handleLogout}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-md font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
          >
            <LogOut size={20} />
            Logout
          </button>
          </Link>
          
        </div>
      </header>

      {/* Main Section */}
      <main>
      <section className="bg-gray-50 py-4 text-center mb-8 mt-8">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Alumni Association Admin</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage and oversee all aspects of our alumni network, from mentorship programs to event coordination.
              Your central hub for alumni engagement and administration.
            </p>
          </div>
        </section>
        {/* Enhanced Profile Section */}
        <div className="bg-white shadow-xl mx-auto max-w-4xl rounded-2xl overflow-hidden mt-4 mb-6">
          <div className="relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-white"></div>
            
            {/* Top decorative accent bar */}
            <div className="h-2 bg-indigo-600"></div>
            
            {/* Content */}
            <div className="relative px-8 pt-10 pb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative">
                  {/* Profile image with styling */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-indigo-600 rounded-2xl blur opacity-60 group-hover:opacity-80 transition duration-300"></div>
                    <div className="w-32 h-32 rounded-2xl bg-indigo-700 absolute -inset-1 transform rotate-2 group-hover:rotate-3 transition-all duration-300"></div>
                    <img
                      src={getAvatarUrl(admin.name)}
                      alt={admin.name}
                      className="relative w-32 h-32 rounded-2xl object-cover ring-4 ring-white shadow-md group-hover:shadow-lg transition-all duration-300"
                    />
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-indigo-600 rounded-xl shadow-lg flex items-center justify-center transform rotate-12 group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap size={20} className="text-white transform -rotate-12" />
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">{admin.name}</h2>
                  <p className="text-indigo-600 text-lg mb-3">{admin.email}</p>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-8">
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-900 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
                      Department of {admin.department}
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-900 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
                      Faculty Member
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-900 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
                      Verified Admin
                    </span>
                  </div>
                  
                  {/* Stats */}
                  {/* <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Students Mentored</p>
                      <p className="text-2xl font-bold text-indigo-600">42</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Events Organized</p>
                      <p className="text-2xl font-bold text-indigo-600">17</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Years Active</p>
                      <p className="text-2xl font-bold text-indigo-600">8</p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Section - Updated with 5 different styled cards */}
        <div className="max-w-5xl mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 py-10">

            {/* Department Directory - With shadow effect */}
            <div className="bg-white rounded-lg p-6 shadow-lg hover:translate-y-1 transition-transform duration-200 relative">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600 rounded-bl-full opacity-10"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={20} className="text-indigo-700" />
                Department Directory
              </h3>
              <p className="text-gray-600 mb-6">Access and manage department-wise alumni listings with sorting and search options.</p>
              <Link to="/admin-Directory" className="text-white no-underline">
                <button className="bg-indigo-700 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-800 inline-flex items-center gap-2 transition-colors duration-200 w-full transform hover:scale-[1.02]">
                  Open Directory
                </button>
              </Link>
            </div>
            
            {/* Alumni Management - With rounded design */}
            <div className="bg-white rounded-lg p-6 shadow-lg hover:translate-y-1 transition-transform duration-200 relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600 rounded-bl-full opacity-10"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserPlus size={20} className="text-indigo-700" />
                Alumni Management
              </h3>
              <p className="text-gray-600 mb-6">Add single or bulk alumni entries to the database in just a single click.</p>
              <Link to="/admin-AddAlumni" className="text-white no-underline">
                <button className="bg-indigo-700 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-800 inline-flex items-center gap-2 transition-colors duration-200 w-full transform hover:scale-[1.02]">
                  Add Alumni
                </button>
              </Link>
            </div>
            
            {/* Mentorship Approval - With gradient background */}
            <div className="bg-white rounded-lg p-6 shadow-lg hover:translate-y-1 transition-transform duration-200 relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600 rounded-bl-full opacity-10"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users size={20} />
                  Mentorship Approval
                </h3>
                <p className="text-grey-600 mb-6">Review and approve mentorship applications from alumni and students.</p>
                <Link to="/admin-Mentorship" className="text-white no-underline">
                  <button className="bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 inline-flex items-center gap-2 transition-colors duration-200 w-full transform hover:scale-[1.02]">
                    Manage Mentorships
                  </button>
                </Link>
              
            </div>
            
            {/* Internship Management - With border accent */}
            <div className="bg-white rounded-lg p-6 shadow-lg hover:translate-y-1 transition-transform duration-200 relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600 rounded-bl-full opacity-10"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ClipboardList size={20} className="text-indigo-700" />
                Internship Management
              </h3>
              <p className="text-gray-600 mb-6">Oversee internship postings and applications from companies.</p>
              <Link to="/admin-Internship" className="text-white no-underline">
                <button className="bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 inline-flex items-center gap-2 transition-colors duration-200 w-full transform hover:scale-[1.02]">
                  View Internships
                </button>
              </Link>
            </div>
            
          </div>
        </div>
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

export default App;