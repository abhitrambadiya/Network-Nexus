import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen';
import axios from 'axios';
import {
  Bell, MapPin, User, Briefcase, Home, Check,
  GraduationCap, History, CheckCircle2, Trash2, Building2, CalendarClock,
  Clock, DollarSign, BookOpen, Award, ArrowLeft, Mail
} from 'lucide-react';

// API configuration
const API_URL = 'http://localhost:5001/api/internships';

// Badge component for consistent styling
const Badge = ({ children, color = "indigo" }) => {
  const colorClasses = {
    indigo: "bg-indigo-100 text-indigo-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${colorClasses[color]}`}>
      {children}
    </span>
  );
};

function InternshipCard({ internship, isSelected, onClick, onApprove, onComplete, onDelete }) {
  // Get appropriate mode badge color
  const getModeColor = (mode) => {
    switch (mode) {
      case 'Online': return 'blue';
      case 'Offline': return 'amber';
      default: return 'gray';
    }
  };

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const difference = deadlineDate - today;
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining(internship.deadline);
  const isUrgent = daysRemaining <= 5;

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm transition-all duration-200 relative cursor-pointer overflow-hidden ${
        isSelected 
          ? 'border-2 border-indigo-600 shadow-lg shadow-indigo-50' 
          : 'border border-gray-100 hover:border-indigo-200 hover:shadow-md'
      }`}
      onClick={onClick}
    >
      {/* Card header with company and type */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <Badge color={getModeColor(internship.mode)}>
            {internship.mode}
          </Badge>
        </div>
        
        <h3 className="text-xl text-gray-900 font-semibold mb-1">{internship.title}</h3>
        <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
          <Building2 size={16} className="text-gray-500" /> 
          {internship.company}
        </p>
      </div>
      
      {/* Card body */}
      <div className="p-5">
        <p className="text-gray-700 text-sm mb-4">{internship.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{internship.location}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <Clock size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{internship.duration}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <DollarSign size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{internship.stipend}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <CalendarClock size={16} className={`flex-shrink-0 mt-0.5 ${isUrgent ? 'text-red-500' : 'text-gray-500'}`} />
            <span className={isUrgent ? 'text-red-600 font-medium' : 'text-gray-700'}>
              {isUrgent ? `${daysRemaining} days left!` : internship.deadline}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-700">
            <BookOpen size={16} className="text-gray-500" />
            <span className="font-medium">Prerequisites:</span>
          </div>
          <p className="text-sm text-gray-600 ml-6">{internship.prerequisites}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {internship.requiredSkills.map((skill, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">{skill}</span>
          ))}
        </div>
      </div>
      
      {/* Card footer with actions */}
      {isSelected && (
        <div className="bg-gray-50 p-4 border-t border-gray-100">
          {!internship.isApproved && !internship.isMarkAsComplete && (
            <div className="flex gap-3">
              <button 
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200 hover:bg-gray-50" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(internship._id);
                }}
              >
                <Trash2 size={18} />
                Decline
              </button>
              <button 
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white font-medium rounded-lg transition-colors duration-200 hover:bg-indigo-700" 
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(internship._id);
                }}
              >
                <Check size={18} />
                Approve
              </button>
            </div>
          )}
          
          {internship.isApproved && !internship.isMarkAsComplete && (
            <button 
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200" 
              onClick={(e) => {
                e.stopPropagation();
                onComplete(internship._id);
              }}
            >
              <CheckCircle2 size={18} />
              Mark as Completed
            </button>
          )}
          
          {internship.isMarkAsComplete && (
            <div className="text-green-700 font-medium text-center py-2">
              Internship completed successfully
            </div>
          )}
        </div>
      )}
      
      {/* Status indicators */}
      {internship.isApproved && !internship.isMarkAsComplete && !isSelected && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-bl-lg">
          Approved
        </div>
      )}
      
      {internship.isMarkAsComplete && !isSelected && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-bl-lg">
          Completed
        </div>
      )}
    </div>
  );
}

InternshipCard.propTypes = {
  internship: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    stipend: PropTypes.string.isRequired,
    deadline: PropTypes.string.isRequired,
    prerequisites: PropTypes.string.isRequired,
    requiredSkills: PropTypes.arrayOf(PropTypes.string).isRequired,
    isApproved: PropTypes.bool.isRequired,
    isMarkAsComplete: PropTypes.bool.isRequired
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

function App() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch internships from the API
  useEffect(() => {
    // Introduce a mandatory 2-second delay before loading content
    const timer = setTimeout(() => {
      fetchInternships();
    }, 1000);
  
    return () => clearTimeout(timer);
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setInternships(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch internships. Please try again later.');
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingInternships = internships.filter(internship => !internship.isApproved && !internship.isMarkAsComplete);
  const approvedInternships = internships.filter(internship => internship.isApproved || internship.isMarkAsComplete);

  // Filter internships based on search term
  const filteredInternships = (activeTab === 'pending' ? pendingInternships : approvedInternships)
    .filter(internship => 
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleCardClick = (id) => {
    setSelectedInternship(selectedInternship === id ? null : id);
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/approve`);
      setInternships(internships.map(internship => 
        internship._id === id ? { ...internship, isApproved: true } : internship
      ));
      setSelectedInternship(null);
    } catch (error) {
      console.error('Error approving internship:', error);
      alert('Failed to approve internship. Please try again.');
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/complete`);
      setInternships(internships.map(internship => 
        internship._id === id ? { ...internship, isMarkAsComplete: true } : internship
      ));
      setSelectedInternship(null);
    } catch (error) {
      console.error('Error completing internship:', error);
      alert('Failed to mark internship as complete. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setInternships(internships.filter(internship => internship._id !== id));
      setSelectedInternship(null);
    } catch (error) {
      console.error('Error deleting internship:', error);
      alert('Failed to delete internship. Please try again.');
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading internships..."/>
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-6 mb-8 relative">
        <button 
          className="absolute left-12 top-1/2 transform -translate-y-1/2 bg-transparent border border-white text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-white/10 transition-all duration-200"
          onClick={() => window.location.href = '/admin-home'}
        >
          <Home size={16} />
          Home
        </button>
        <h1 className="text-center text-2xl font-bold">Internship Approval Dashboard</h1>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Filters and search */}
          <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-2">
                  <button 
                    className={`py-2 px-4 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2 ${
                      activeTab === 'pending' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab('pending')}
                  >
                    <Bell size={16} />
                    Pending
                    {pendingInternships.length > 0 && (
                      <span className="ml-1 bg-indigo-700 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {pendingInternships.length}
                      </span>
                    )}
                  </button>
                  
                  <button 
                    className={`py-2 px-4 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2 ${
                      activeTab === 'approved' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab('approved')}
                  >
                    <History size={16} />
                    Approved
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search internships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 py-2 px-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Internship cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredInternships.map(internship => (
              <InternshipCard
                key={internship._id}
                internship={internship}
                isSelected={selectedInternship === internship._id}
                onClick={() => handleCardClick(internship._id)}
                onApprove={handleApprove}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
          </div>
          
          {filteredInternships.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                {activeTab === 'pending' ? (
                  <Bell size={24} className="text-gray-500" />
                ) : (
                  <History size={24} className="text-gray-500" />
                )}
              </div>
              <h2 className="text-xl font-medium text-gray-700 mb-2">No {activeTab} applications found</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm 
                  ? "No internships match your search criteria. Try adjusting your search terms."
                  : `There are currently no internship applications ${activeTab === 'pending' ? 'pending approval' : 'approved'}.`
                }
              </p>
            </div>
          )}
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