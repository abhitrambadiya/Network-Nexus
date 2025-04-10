import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Bell, MapPin, User, Briefcase, Home, Check, History, CheckCircle2 } from 'lucide-react';
import LoadingScreen from "../../components/LoadingScreen";

// Set base URL for API requests
const API_URL = 'http://localhost:5001/api';

function ProgramCard({ program, isSelected, onClick, onApprove, onComplete }) {
  return (
    <div 
      className={`bg-white rounded-lg p-6 shadow transition-all duration-200 cursor-pointer hover:translate-y-[-2px] hover:shadow-md relative ${
        isSelected ? 'border-2 border-indigo-600 bg-gray-50 shadow-indigo-100 shadow-lg' : 'border-2 border-transparent'
      }`}
      onClick={onClick}
    >
      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mb-4">
        {program.type === 'Technical' ? <Briefcase size={16} /> : <User size={16} />}
        {program.type}
      </span>
      <h3 className="text-gray-900 text-xl font-medium mb-3">{program.title}</h3>
      <p className="text-gray-600 mb-4">{program.description}</p>
      <p className="flex items-center gap-1 text-gray-500 text-sm mb-4">
        <MapPin size={16} />
        {program.location}
      </p>
      <div className="pt-4 border-t border-gray-200 text-gray-500 text-sm mb-4">
        Contact: {program.contact}
      </div>
      <div className="pt-0 text-gray-500 text-sm mb-4">
        PRN: {program.prn}
      </div>
      {isSelected && !program.isApproved && !program.isMarkedAsComplete && (
        <div className="mt-4">
          <button 
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onApprove(program._id);
            }}
          >
            <Check size={20} />
            Approve
          </button>
        </div>
      )}
      {program.isApproved && !program.isMarkedAsComplete && (
        <button 
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors duration-200 mt-4"
          onClick={(e) => {
            e.stopPropagation();
            onComplete(program._id);
          }}
        >
          <CheckCircle2 size={20} />
          Mark as Completed
        </button>
      )}
      {program.isMarkedAsComplete && (
        <div className="mt-4 text-center py-2 bg-green-100 text-green-700 rounded-md">
          Completed
        </div>
      )}
    </div>
  );
}

ProgramCard.propTypes = {
  program: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    contact: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    programType: PropTypes.string.isRequired,
    prn: PropTypes.string.isRequired,
    isApproved: PropTypes.bool.isRequired,
    isMarkedAsComplete: PropTypes.bool.isRequired
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired
};

function App() {
  const [programs, setPrograms] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      const start = Date.now();
      setLoading(true);

      try {
        const response = await axios.get(`${API_URL}/programs`);
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 1000 - elapsed);

        setTimeout(() => {
          setPrograms(response.data.data);
          setLoading(false);
        }, delay);
      } catch (err) {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 1000 - elapsed);

        setTimeout(() => {
          setError('Failed to fetch programs');
          setLoading(false);
        }, delay);

        console.error('Error fetching programs:', err);
      }
    };

    fetchPrograms();
  }, []);

  const pendingPrograms = programs.filter(p => !p.isApproved && !p.isMarkedAsComplete);
  const approvedPrograms = programs.filter(p => p.isApproved && !p.isMarkedAsComplete);
  const completedPrograms = programs.filter(p => p.isMarkedAsComplete);

  const handleCardClick = (id) => {
    setSelectedProgram(selectedProgram === id ? null : id);
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/programs/${id}/approve`);
      setPrograms(programs.map(p => (p._id === id ? response.data.data : p)));
      setSelectedProgram(null);
    } catch (err) {
      console.error('Error approving program:', err);
      alert('Failed to approve program');
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/programs/${id}/complete`);
      setPrograms(programs.map(p => (p._id === id ? response.data.data : p)));
      setSelectedProgram(null);
    } catch (err) {
      console.error('Error completing program:', err);
      alert('Failed to mark program as complete');
    }
  };

  if (loading) return <LoadingScreen message="Loading mentorships..." />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-medium">{error}</p>
          <button 
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 text-gray-800">
      <header className="bg-indigo-600 text-white py-6 mb-8 relative">
        <button 
          className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-transparent border border-white text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-white/10 transition-all duration-200"
          onClick={() => window.location.href = '/admin-home'}
        >
          <Home size={16} />
          Home
        </button>
        <h1 className="text-center text-2xl font-bold">Mentorship Approval Dashboard</h1>
      </header>

      <div className="max-w-7xl mx-auto px-8 w-full">
        <div className="flex gap-4 mb-8 border-b-2 border-gray-200 pb-4 md:flex-row flex-col">
          <button 
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-200
              ${activeTab === 'pending' 
                ? 'text-indigo-600 bg-gray-100' 
                : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('pending')}
          >
            <Bell size={16} />
            Pending Requests ({pendingPrograms.length})
          </button>
          <button 
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-200
              ${activeTab === 'approved' 
                ? 'text-indigo-600 bg-gray-100' 
                : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('approved')}
          >
            <History size={16} />
            Approved Requests ({approvedPrograms.length})
          </button>
          <button 
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-200
              ${activeTab === 'completed' 
                ? 'text-indigo-600 bg-gray-100' 
                : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('completed')}
          >
            <CheckCircle2 size={16} />
            Completed ({completedPrograms.length})
          </button>
        </div>

        {activeTab === 'pending' && pendingPrograms.length > 0 && (
          <div className="bg-indigo-700 text-white p-4 mb-8 rounded-lg flex items-center gap-2">
            <Bell size={20} />
            <span>You have {pendingPrograms.length} new requests pending approval</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-10">
          {activeTab === 'pending' && pendingPrograms.map(program => (
            <ProgramCard
              key={program._id}
              program={program}
              isSelected={selectedProgram === program._id}
              onClick={() => handleCardClick(program._id)}
              onApprove={handleApprove}
              onComplete={handleComplete}
            />
          ))}
          {activeTab === 'approved' && approvedPrograms.map(program => (
            <ProgramCard
              key={program._id}
              program={program}
              isSelected={selectedProgram === program._id}
              onClick={() => handleCardClick(program._id)}
              onApprove={handleApprove}
              onComplete={handleComplete}
            />
          ))}
          {activeTab === 'completed' && completedPrograms.map(program => (
            <ProgramCard
              key={program._id}
              program={program}
              isSelected={selectedProgram === program._id}
              onClick={() => handleCardClick(program._id)}
              onApprove={handleApprove}
              onComplete={handleComplete}
            />
          ))}
        </div>

        {(activeTab === 'pending' && pendingPrograms.length === 0) || 
         (activeTab === 'approved' && approvedPrograms.length === 0) ||
         (activeTab === 'completed' && completedPrograms.length === 0) ? (
          <div className="text-center py-12 text-gray-500">
            <h2 className="text-xl font-medium text-gray-700 mb-4">No {activeTab} requests</h2>
            <p>There are currently no {activeTab} requests to display.</p>
          </div>
        ) : null}
      </div>

      <footer className="bg-gray-800 text-gray-200 py-12">
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