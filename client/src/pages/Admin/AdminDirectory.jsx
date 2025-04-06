import React, { useState } from 'react';
import { Search, X, Home } from 'lucide-react';
import { Link } from "react-router-dom";

const mockAlumni = [
  {
    id: 1,
    prn: "PRN001",
    fullName: "Sarah Johnson",
    email: "sarah.j@example.com",
    password: "********",
    phone: "+1 (555) 123-4567",
    department: "Computer Science",
    passOutYear: "2022",
    currentPosition: "Software Engineer",
    company: "Google",
    jobDescription: "Developing cloud infrastructure solutions and working on machine learning projects.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
  },
  {
    id: 2,
    prn: "PRN002",
    fullName: "Michael Chen",
    email: "m.chen@example.com",
    password: "********",
    phone: "+1 (555) 234-5678",
    department: "Electrical Engineering",
    passOutYear: "2021",
    currentPosition: "Hardware Engineer",
    company: "Apple",
    jobDescription: "Working on next-generation processor design and optimization.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  },
  {
    id: 3,
    prn: "PRN003",
    fullName: "Emily Rodriguez",
    email: "e.rodriguez@example.com",
    password: "********",
    phone: "+1 (555) 345-6789",
    department: "Mechanical Engineering",
    passOutYear: "2023",
    currentPosition: "Product Designer",
    company: "Tesla",
    jobDescription: "Leading the design of sustainable energy solutions and electric vehicle components.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
  }
];

function App() {
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("department");

  const filteredAlumni = mockAlumni
    .filter(alumni => 
      alumni.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-5 mb-8 relative">
  
  <Link to="/admin-home">
  <button
    className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-transparent border border-white text-white py-2 px-4 rounded-md cursor-pointer flex items-center gap-2 transition-all duration-200 hover:bg-white/10"
    onClick={() => window.location.href = '/'}
  >
    <Home size={16} />
    Home
  </button>
  </Link>
  <div className="text-center">
    <h1 className="text-3xl font-bold">Alumni Directory</h1>
    <p className="text-indigo-100 text-sm mt-1">Department-wise Alumni Records</p>
  </div>
</header>


      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or department..."
              className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="py-2 px-3 pr-8 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-100"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="department">Sort by Department</option>
            <option value="fullName">Sort by Name</option>
            <option value="passOutYear">Sort by Pass Out Year</option>
          </select>
        </div>

        {/* Alumni Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto mb-12">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">Alumni</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">PRN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">Pass Out Year</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlumni.map((alumni) => (
                <tr 
                  key={alumni.id} 
                  onClick={() => setSelectedAlumni(alumni)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover" src={alumni.avatar} alt="" />
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{alumni.fullName}</div>
                        <div className="text-sm text-gray-500">{alumni.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 border-b border-gray-200">{alumni.prn}</td>
                  <td className="px-6 py-4 text-gray-500 border-b border-gray-200">{alumni.department}</td>
                  <td className="px-6 py-4 text-gray-500 border-b border-gray-200">{alumni.passOutYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alumni Details Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <button
              onClick={() => setSelectedAlumni(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 p-2"
            >
              <X size={24} />
            </button>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <img
                  src={selectedAlumni.avatar}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedAlumni.fullName}</h2>
                  <p className="text-indigo-600">{selectedAlumni.currentPosition} at {selectedAlumni.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <dl className="flex flex-col gap-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">PRN</dt>
                      <dd className="text-sm text-gray-900">{selectedAlumni.prn}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{selectedAlumni.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="text-sm text-gray-900">{selectedAlumni.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Department</dt>
                      <dd className="text-sm text-gray-900">{selectedAlumni.department}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Pass Out Year</dt>
                      <dd className="text-sm text-gray-900">{selectedAlumni.passOutYear}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                  <dl className="flex flex-col gap-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Current Position</dt>
                      <dd className="text-sm text-gray-900">{selectedAlumni.currentPosition}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Company</dt>
                      <dd className="text-sm text-gray-900">{selectedAlumni.company}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Job Description</dt>
                      <dd className="text-sm text-gray-900">{selectedAlumni.jobDescription}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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