import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell, MapPin, User, Briefcase, Home, Check, GraduationCap, History, CheckCircle2, Trash2 } from 'lucide-react';

const initialInternships = [
  {
    id: 1,
    title: "Frontend Development Internship",
    description: "3-month internship focused on modern frontend technologies and best practices.",
    location: "Seattle, WA",
    contact: "emma.brown@example.com",
    type: "Technical",
    status: "pending"
  },
  {
    id: 2,
    title: "UX Design Internship",
    description: "6-month internship program working on user experience design for enterprise applications.",
    location: "San Francisco, CA",
    contact: "alex.chen@example.com",
    type: "Design",
    status: "pending"
  },
  {
    id: 3,
    title: "Data Science Intern",
    description: "Summer internship working with big data and machine learning models.",
    location: "Boston, MA",
    contact: "sarah.johnson@example.com",
    type: "Technical",
    status: "pending"
  },
  {
    id: 4,
    title: "Product Management Intern",
    description: "Learn product management fundamentals in a fast-paced startup environment.",
    location: "New York, NY",
    contact: "michael.smith@example.com",
    type: "Business",
    status: "pending"
  },
  {
    id: 5,
    title: "Cloud Engineering Internship",
    description: "Hands-on experience with cloud infrastructure and DevOps practices.",
    location: "Remote / Virtual",
    contact: "david.wilson@example.com",
    type: "Technical",
    status: "pending"
  }
];

function InternshipCard({ internship, isSelected, onClick, onApprove, onComplete, onDelete }) {
  return (
    <div 
      className={`bg-white rounded-lg p-6 shadow-sm transition-all duration-200 relative cursor-pointer hover:translate-y-[-2px] hover:shadow-md ${isSelected ? 'border-2 border-indigo-600 bg-gray-50 shadow-indigo-100 shadow-md' : 'border-2 border-transparent'}`}
      onClick={onClick}
    >
      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mb-4">
        {internship.type === 'Technical' ? <Briefcase size={16} /> : 
         internship.type === 'Design' ? <User size={16} /> : 
         <GraduationCap size={16} />}
        {internship.type}
      </span>
      <h3 className="text-xl text-gray-900 font-medium mb-3">{internship.title}</h3>
      <p className="text-gray-600 mb-4">{internship.description}</p>
      <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
        <MapPin size={16} />
        {internship.location}
      </p>
      <div className="pt-4 border-t border-gray-200 text-gray-500 text-sm mb-4">
        Contact: {internship.contact}
      </div>
      {isSelected && internship.status === 'pending' && (
        <div className="flex gap-2 mt-4">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors duration-200" onClick={(e) => {
            e.stopPropagation();
            onDelete(internship.id);
          }}>
            <Trash2 size={20} />
            Delete
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-200" onClick={(e) => {
            e.stopPropagation();
            onApprove(internship.id);
          }}>
            <Check size={20} />
            Approve
          </button>
        </div>
      )}
      {internship.status === 'approved' && (
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-200 mt-4" onClick={(e) => {
          e.stopPropagation();
          onComplete(internship.id);
        }}>
          <CheckCircle2 size={20} />
          Mark as Completed
        </button>
      )}
    </div>
  );
}

InternshipCard.propTypes = {
  internship: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    contact: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

function App() {
  const [internships, setInternships] = useState(initialInternships);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedInternship, setSelectedInternship] = useState(null);

  const pendingInternships = internships.filter(internship => internship.status === 'pending');
  const approvedInternships = internships.filter(internship => internship.status === 'approved');

  const handleCardClick = (id) => {
    setSelectedInternship(selectedInternship === id ? null : id);
  };

  const handleApprove = (id) => {
    setInternships(internships.map(internship => 
      internship.id === id ? { ...internship, status: 'approved' } : internship
    ));
    setSelectedInternship(null);
  };

  const handleComplete = (id) => {
    setInternships(internships.map(internship => 
      internship.id === id ? { ...internship, status: 'completed' } : internship
    ));
  };

  const handleDelete = (id) => {
    setInternships(internships.filter(internship => internship.id !== id));
    setSelectedInternship(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <header className="bg-indigo-600 text-white py-6 mb-8 relative">
        <button className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-transparent border border-white text-white py-2 px-4 rounded-md cursor-pointer flex items-center gap-2 transition-all duration-200 hover:bg-white/10" onClick={() => window.location.href = '/admin-home'}>
          <Home size={16} />
          Home
        </button>
        <h1 className="text-center text-2xl font-bold">Internship Approval Dashboard</h1>
      </header>

      <div className="max-w-7xl mx-auto px-8 w-full">
        <div className="flex gap-4 mb-8 border-b-2 border-gray-200 pb-4 md:flex-row flex-col">
          <button 
            className={`flex items-center gap-2 py-3 px-6 rounded-lg cursor-pointer font-medium transition-all duration-200 ${activeTab === 'pending' ? 'text-indigo-600 bg-gray-100' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('pending')}
          >
            <Bell size={16} />
            Pending Applications
          </button>
          <button 
            className={`flex items-center gap-2 py-3 px-6 rounded-lg cursor-pointer font-medium transition-all duration-200 ${activeTab === 'approved' ? 'text-indigo-600 bg-gray-100' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('approved')}
          >
            <History size={16} />
            Approved Applications
          </button>
        </div>

        {activeTab === 'pending' && pendingInternships.length > 0 && (
          <div className="bg-indigo-700 text-white p-4 mb-8 rounded-lg flex items-center gap-2">
            <Bell size={20} />
            <span>You have {pendingInternships.length} new internship applications pending approval</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {(activeTab === 'pending' ? pendingInternships : approvedInternships).map(internship => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              isSelected={selectedInternship === internship.id}
              onClick={() => handleCardClick(internship.id)}
              onApprove={handleApprove}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {(activeTab === 'pending' ? pendingInternships : approvedInternships).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <h2 className="text-xl font-medium text-gray-700 mb-4">No {activeTab} applications</h2>
            <p>There are currently no internship applications {activeTab === 'pending' ? 'pending approval' : 'approved'}.</p>
          </div>
        )}
      </div>
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