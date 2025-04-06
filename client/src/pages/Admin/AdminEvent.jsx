import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, X, Save, Home } from 'lucide-react';
import { Link } from "react-router-dom";

const initialEventData = {
  title: "",
  description: "",
  day: "",
  date: "",
  venue: "",
  duration: "",
  targetAudience: "",
  organizer: {
    name: "",
    phone: "",
    email: ""
  }
};

const participantsData = [
  { prn: "PRN001", name: "John Smith", rollNumber: "CS21001", class: "2021", department: "Computer Science" },
  { prn: "PRN002", name: "Emma Davis", rollNumber: "EC21015", class: "2021", department: "Electronics" },
  { prn: "PRN003", name: "Michael Brown", rollNumber: "ME21008", class: "2021", department: "Mechanical" }
];

function App() {
  const [eventData, setEventData] = useState(initialEventData);
  const [showParticipants, setShowParticipants] = useState(false);
  

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('organizer.')) {
      const field = name.split('.')[1];
      setEventData({
        ...eventData,
        organizer: {
          ...eventData.organizer,
          [field]: value
        }
      });
    } else {
      setEventData({
        ...eventData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event Data:', eventData);
  };

  return (
    <div className="bg-white max-w-6xl mx-auto my-8 px-4 container">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 event-form">
      <div className="mb-8 form-header flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-indigo-600">Add New Event</h1>
          <Link to="/admin-home">
            <button
              className="bg-indigo-600 border border-white text-white py-2 px-4 rounded-md cursor-pointer flex items-center gap-2 transition-all duration-200 hover:bg-indigo-700"
              onClick={() => window.location.href = '/'}
            >
              <Home size={16} />
              Home
            </button>
          </Link>
        </div>

       

        <div className="mb-8 p-6 bg-gray-100 rounded-md form-section">
          <h2 className="text-xl text-gray-700 mb-6">Event Details</h2>
          <div className="mb-4 input-group">
            <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-2">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleEventChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="mb-4 input-group">
            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleEventChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 text-sm min-h-24 resize-y focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 form-row">
            <div className="mb-4 input-group">
              <label htmlFor="day" className="block text-sm font-medium text-gray-600 mb-2">Day</label>
              <input
                type="text"
                id="day"
                name="day"
                value={eventData.day}
                onChange={handleEventChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="mb-4 input-group">
              <label htmlFor="date" className="block text-sm font-medium text-gray-600 mb-2">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={eventData.date}
                onChange={handleEventChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div className="mb-4 input-group">
            <label htmlFor="venue" className="block text-sm font-medium text-gray-600 mb-2">Venue</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={eventData.venue}
              onChange={handleEventChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 form-row">
            <div className="mb-4 input-group">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-600 mb-2">Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={eventData.duration}
                onChange={handleEventChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="mb-4 input-group">
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-600 mb-2">Target Audience</label>
              <input
                type="text"
                id="targetAudience"
                name="targetAudience"
                value={eventData.targetAudience}
                onChange={handleEventChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>
        </div>

        <div className="mb-8 p-6 bg-gray-100 rounded-md form-section">
          <h2 className="text-xl text-gray-700 mb-6">Organizer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 form-row">
            <div className="mb-4 input-group">
              <label htmlFor="organizer.name" className="block text-sm font-medium text-gray-600 mb-2">Name</label>
              <input
                type="text"
                id="organizer.name"
                name="organizer.name"
                value={eventData.organizer.name}
                onChange={handleEventChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="mb-4 input-group">
              <label htmlFor="organizer.phone" className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
              <input
                type="tel"
                id="organizer.phone"
                name="organizer.phone"
                value={eventData.organizer.phone}
                onChange={handleEventChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="organizer.email" className="block text-sm font-medium text-gray-600 mb-2">Email</label>
            <input
              type="email"
              id="organizer.email"
              name="organizer.email"
              value={eventData.organizer.email}
              onChange={handleEventChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8 button-group">
          <button type="submit" className="inline-flex items-center gap-2 py-3 px-6 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors submit-button">
            <Save size={16} /> Save Event
          </button>
          <button 
            type="button" 
            className="inline-flex items-center gap-2 py-3 px-6 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors view-button"
            onClick={() => setShowParticipants(true)}
          >
            <Users size={16} /> View Participants
          </button>
        </div>
      </form>

      {showParticipants && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 modal">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto modal-content">
            <div className="flex justify-between items-center mb-6 modal-header">
              <h2 className="text-xl text-gray-800">Event Participants</h2>
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors close-button"
                onClick={() => setShowParticipants(false)}
              >
                <X />
              </button>
            </div>
            <div className="py-4 modal-body">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-md overflow-hidden participants-table">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left border-b border-gray-200 text-gray-700 font-medium">PRN</th>
                      <th className="p-3 text-left border-b border-gray-200 text-gray-700 font-medium">Name</th>
                      <th className="p-3 text-left border-b border-gray-200 text-gray-700 font-medium">Roll Number</th>
                      <th className="p-3 text-left border-b border-gray-200 text-gray-700 font-medium">Class</th>
                      <th className="p-3 text-left border-b border-gray-200 text-gray-700 font-medium">Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantsData.map((participant) => (
                      <tr key={participant.prn} className="hover:bg-gray-50">
                        <td className="p-3 border-b border-gray-200">{participant.prn}</td>
                        <td className="p-3 border-b border-gray-200">{participant.name}</td>
                        <td className="p-3 border-b border-gray-200">{participant.rollNumber}</td>
                        <td className="p-3 border-b border-gray-200">{participant.class}</td>
                        <td className="p-3 border-b border-gray-200">{participant.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;