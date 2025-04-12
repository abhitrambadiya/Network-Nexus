import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, MapPin, User, Briefcase, Home, Check, History, CheckCircle2, Trash2, AlertTriangle, Calendar, Users, Building } from 'lucide-react';
import LoadingScreen from "../../components/LoadingScreen";

// Set base URL for API requests
const API_URL = 'http://localhost:5001/api';

function ProgramCard({ program, isSelected, onClick, onApprove, onComplete, onDelete }) {
  return (
    <div 
      className={`bg-white rounded-lg p-6 shadow transition-all duration-200 cursor-pointer hover:translate-y-[-2px] hover:shadow-md relative ${
        isSelected ? 'border-2 border-indigo-600 bg-gray-50 shadow-indigo-100 shadow-lg' : 'border-2 border-transparent'
      }`}
      onClick={onClick}
    >
      {/* Delete button */}
      <div className="flex justify-between items-center mb-4">
        <button 
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(program._id);
          }}
          aria-label="Delete mentorship"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <h3 className="text-gray-900 text-xl font-medium mb-3">{program.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-4">{program.description}</p>
      
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <User size={16} />
          {program.fullName}
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <Building size={16} />
          {program.companyName}
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <Briefcase size={16} />
          {program.jobPosition}
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <MapPin size={16} />
          {program.mode}
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <Calendar size={16} />
          {program.date}
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <Users size={16} />
          Audience: {program.targetAudience}
        </div>
      </div>
      
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <p className="text-gray-500 text-sm">Department: {program.department || 'Not specified'}</p>
        <p className="text-gray-500 text-sm">Study Year: {program.studyYear || 'Not specified'}</p>
        <p className="text-gray-500 text-sm">Participant Limit: {program.limit || 'No limit'}</p>
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
            <Check size={18} />
            Approve
          </button>
        </div>
      )}
      
      {program.isApproved && !program.isMarkedAsComplete && (
        <button 
          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 transition-colors duration-200 mt-4"
          onClick={(e) => {
            e.stopPropagation();
            onComplete(program._id);
          }}
        >
          <CheckCircle2 size={18} />
          Mark as Completed
        </button>
      )}
      
      {program.isMarkedAsComplete && (
        <div className="mt-4 text-center py-2 bg-green-100 text-green-700 rounded-md flex items-center justify-center gap-2">
          <CheckCircle2 size={18} />
          Completed
        </div>
      )}
    </div>
  );
}

function App() {
  const [programs, setPrograms] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);

  useEffect(() => {
    // Introduce a mandatory 1-second delay before loading content
    const timer = setTimeout(() => {
      fetchPrograms();
    }, 1000);
  
    return () => clearTimeout(timer);
  }, []);
  
  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API_URL}/programs`);
      setPrograms(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch programs');
      setLoading(false);
      console.error('Error fetching programs:', err);
    }
  };
  
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

  const handleDeleteClick = (id) => {
    setProgramToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/programs/${programToDelete}`);
      setPrograms(programs.filter(p => p._id !== programToDelete));
      setShowDeleteConfirm(false);
      setProgramToDelete(null);
      setSelectedProgram(null);
    } catch (err) {
      console.error('Error deleting program:', err);
      alert('Failed to delete program');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setProgramToDelete(null);
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
      {/* Header */}
      <header className="bg-indigo-600 text-white py-6 mb-8 relative">
        <button 
          className="absolute left-12 top-1/2 transform -translate-y-1/2 bg-transparent border border-white text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-white/10 transition-all duration-200"
          onClick={() => window.location.href = '/admin-home'}
        >
          <Home size={16} />
          Home
        </button>
        <h1 className="text-center text-2xl font-bold">Mentorship Approval Dashboard</h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 w-full mb-16">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-lg shadow p-2 md:flex-row flex-col">
          <button 
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex-1
              ${activeTab === 'pending' 
                ? 'text-white bg-indigo-600 shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('pending')}
          >
            <Bell size={18} />
            Pending ({pendingPrograms.length})
          </button>
          <button 
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex-1
              ${activeTab === 'approved' 
                ? 'text-white bg-indigo-600 shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('approved')}
          >
            <History size={18} />
            Approved ({approvedPrograms.length})
          </button>
          <button 
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex-1
              ${activeTab === 'completed' 
                ? 'text-white bg-indigo-600 shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('completed')}
          >
            <CheckCircle2 size={18} />
            Completed ({completedPrograms.length})
          </button>
        </div>

        {/* Program cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-10">
          {activeTab === 'pending' && pendingPrograms.map(program => (
            <ProgramCard
              key={program._id}
              program={program}
              isSelected={selectedProgram === program._id}
              onClick={() => handleCardClick(program._id)}
              onApprove={handleApprove}
              onComplete={handleComplete}
              onDelete={() => handleDeleteClick(program._id)}
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
              onDelete={() => handleDeleteClick(program._id)}
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
              onDelete={() => handleDeleteClick(program._id)}
            />
          ))}
        </div>

        {/* Empty state */}
        {(activeTab === 'pending' && pendingPrograms.length === 0) || 
         (activeTab === 'approved' && approvedPrograms.length === 0) ||
         (activeTab === 'completed' && completedPrograms.length === 0) ? (
          <div className="bg-white rounded-lg shadow text-center py-16 text-gray-500">
            <div className="flex justify-center mb-4">
              {activeTab === 'pending' && <Bell size={48} className="text-gray-300" />}
              {activeTab === 'approved' && <History size={48} className="text-gray-300" />}
              {activeTab === 'completed' && <CheckCircle2 size={48} className="text-gray-300" />}
            </div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">No {activeTab} requests</h2>
            <p>There are currently no {activeTab} mentorship requests to display.</p>
          </div>
        ) : null}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
            </div>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this mentorship program? This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                onClick={handleDeleteConfirm}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-8">
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

          <div className="text-center pt-6 mt-6 border-t border-gray-700 text-gray-400">
            © {new Date().getFullYear()} Alumni Association Admin Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;