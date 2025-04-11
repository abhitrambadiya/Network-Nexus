import React, { useState, useEffect } from 'react';
import { Search, X, Home } from 'lucide-react';
import { Link } from "react-router-dom";
import axios from 'axios';
import LoadingScreen from "../../components/LoadingScreen";

function App() {
  const [alumniList, setAlumniList] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("department");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAvatarUrl = (name) => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&radius=50`;
  };

  const processSkills = (skillsData) => {
    if (Array.isArray(skillsData)) return skillsData;
    if (typeof skillsData === 'string') return skillsData.split(',').map(skill => skill.trim()).filter(skill => skill);
    return [];
  };

  const processAchievements = (achievementsData) => {
    if (Array.isArray(achievementsData)) return achievementsData;
    if (typeof achievementsData === 'string') return achievementsData.split(',').map(item => item.trim()).filter(item => item);
    return [];
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      const start = Date.now();
      setIsLoading(true);
      try {
        const apiUrl = 'http://localhost:5001';
        const res = await axios.get(`${apiUrl}/api/admin/admin-directory`, { signal });
        
        const alumniWithAvatars = res.data.map((alumni, index) => ({
          ...alumni,
          id: alumni.id || `alumni-${index}`,
          avatar: getAvatarUrl(alumni.fullName || `User${index}`),
          currentPosition: alumni.jobPosition || "Not specified",
          company: alumni.companyName || "Not specified",
          skills: processSkills(alumni.skills),
          achievements: processAchievements(alumni.specialAchievements),
          linkedInURL: alumni.linkedInURL || "#",
          phone: alumni.phoneNumber || "N/A"
        }));
        setAlumniList(alumniWithAvatars);
        setError(null);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching alumni directory:", error);
          setError("Failed to load alumni data. Please try again later.");
        }
      } finally {
        const elapsed = Date.now() - start;
        const remaining = 1000 - elapsed;

        setTimeout(() => {
          setIsLoading(false);
        }, remaining > 0 ? remaining : 0);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  const filteredAlumni = alumniList
    .filter(alumni =>
      alumni.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.department?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (sortBy === "passOutYear") {
        return (parseInt(valA) || 0) - (parseInt(valB) || 0);
      } else {
        return (valA || "").toString().localeCompare((valB || "").toString());
      }
    });

  if (isLoading) return <LoadingScreen message="Loading alumni data..." />;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-5 mb-8 relative">
        <Link to="/admin-home">
          <button
            className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-transparent border border-white text-white py-2 px-4 rounded-md cursor-pointer flex items-center gap-2 transition-all duration-200 hover:bg-white/10"
            aria-label="Go to home page"
          >
            <Home size={16} />
            Home
          </button>
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Alumni Directory</h1>
          <p className="text-indigo-100 text-xs mt-1">Department-wise Alumni Records</p>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="max-w-8xl mx-auto px-4 flex-grow">
        <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or department..."
              className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search alumni"
            />
          </div>
          <select
            className="py-2 px-3 pr-8 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-100"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort alumni by"
          >
            <option value="department">Sort by Department</option>
            <option value="fullName">Sort by Name</option>
            <option value="passOutYear">Sort by Pass Out Year</option>
          </select>
        </div>

        {/* Loading and Error States */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600">Loading alumni records...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg text-center">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          /* Alumni Table */
          <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto mb-12">
            {filteredAlumni.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No alumni matching your search criteria.</p>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>

      {/* Alumni Details Modal */}
      {selectedAlumni && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-90 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="alumni-details-title"
        >
          <div 
            className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4"
            tabIndex={-1}
          >
            <button
              onClick={() => setSelectedAlumni(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 p-2"
              aria-label="Close details"
            >
              <X size={24} />
            </button>
            
            <div className="p-10">
              <div className="flex items-center mb-8">
                <img
                  src={selectedAlumni.avatar}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h2 id="alumni-details-title" className="text-2xl font-bold text-gray-900">{selectedAlumni.fullName}</h2>
                  <p className="text-indigo-600">{selectedAlumni.currentPosition} at {selectedAlumni.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <dl className="flex flex-col gap-4">
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
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Location</dt>
                      <dd className="text-sm text-gray-900">{selectedAlumni.location || "Not specified"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">LinkedIn</dt>
                      <dd className="text-sm text-gray-900">
                        <a href={selectedAlumni.linkedInURL} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          {selectedAlumni.linkedInURL}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                  <dl className="flex flex-col gap-5">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Job Position</dt>
                      <dd className="text-sm text-gray-900">{selectedAlumni.currentPosition}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                      <dd className="text-sm text-gray-900">{selectedAlumni.company}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Role</dt>
                      <dd className="text-sm text-gray-900">{selectedAlumni.role || "Not specified"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Success Story</dt>
                      <dd className="text-sm text-gray-900">{selectedAlumni.successStory || "Not specified"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Skills</dt>
                      <dd className="text-sm text-gray-900">
                        <div className="flex flex-wrap gap-3">
                          {selectedAlumni.skills && selectedAlumni.skills.length > 0 ? (
                            selectedAlumni.skills.map((skill, index) => (
                              <span key={`skill-${index}`} className="bg-gray-100 px-3 py-1 rounded-md text-xs">{skill}</span>
                            ))
                          ) : (
                            <span className="text-gray-500">No skills listed</span>
                          )}
                        </div>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Special Achievements</dt>
                      <dd className="text-sm text-gray-900">
                        {selectedAlumni.achievements && selectedAlumni.achievements.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedAlumni.achievements.map((achievement, index) => (
                              <li key={`achievement-${index}`}>{achievement}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500">No achievements listed</span>
                        )}
                      </dd>
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
                <li><Link to="/settings" className="text-gray-400 hover:text-white transition-colors duration-200 no-underline">Settings</Link></li>
                <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors duration-200 no-underline">Help Center</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/guidelines" className="text-gray-400 hover:text-white transition-colors duration-200 no-underline">Guidelines</Link></li>
                <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors duration-200 no-underline">Support</Link></li>
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
