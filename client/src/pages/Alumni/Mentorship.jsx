import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, GraduationCap, Users, Building2, BookOpen, Award, Trophy, Briefcase } from 'lucide-react';


function App() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: 'remote',
    contact: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Offer submitted successfully!');
    setFormData({
      title: '',
      description: '',
      location: 'remote',
      contact: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-white px-8 py-4 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="#" className="flex items-center gap-3 no-underline">
            <GraduationCap size={28} color="#4f46e5" />
            <span className="text-indigo-600 text-xl font-semibold">Alumni Connect</span>
          </a>
          <ul className="flex gap-8 list-none">
            <li><a href="#home" className="text-indigo-600 font-medium no-underline hover:text-indigo-700 transition-colors">Home</a></li>
            <li><a href="#qa" className="text-indigo-600 font-medium no-underline hover:text-indigo-700 transition-colors">Q&A</a></li>
            <li><a href="#events" className="text-indigo-600 font-medium no-underline hover:text-indigo-700 transition-colors">Personalized Events</a></li>
            <li><a href="#resources" className="text-indigo-600 font-medium no-underline hover:text-indigo-700 transition-colors">Study Resources</a></li>
          </ul>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto my-8 px-4">
        <h1 className="mb-8 text-gray-800 text-4xl font-bold">Add Mentorship Offers</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block mb-2 font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block mb-2 font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 min-h-32 resize-y focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="location" className="block mb-2 font-medium text-gray-700">Location</label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                <option value="remote">Remote</option>
                <option value="in-person">In-person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="contact" className="block mb-2 font-medium text-gray-700">Contact Details</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <button 
              type="submit" 
              className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
            >
              Submit Offer
            </button>
          </form>
        </div>
      </main>
      <footer className="bg-indigo-600 text-white py-8 px-8 mt-12 text-center">
        <p className="max-w-xl mx-auto">©️ 2024 Alumni Mentorship Program. Connect with experienced professionals and find valuable opportunities.</p>
      </footer>
    </div>
  );
}

export default App;