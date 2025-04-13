import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Home, Upload, FileText, Check, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import LoadingScreen from "../../components/LoadingScreen";

const AlumniManagement = () => {
  // Separate status states for each form
  const [bulkUploadStatus, setBulkUploadStatus] = useState({ message: '', type: '' });
  const [singleAddStatus, setSingleAddStatus] = useState({ message: '', type: '' });
  
  // Separate loading states for each form
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [isSingleSubmitting, setIsSingleSubmitting] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial loading like other pages
    const start = Date.now();

    const timer = setTimeout(() => {
      setLoading(false);
    }, Math.max(0, 1000 - (Date.now() - start))); // Ensures at least 1s load time

    return () => clearTimeout(timer);
  }, []);

  // Drag and drop handlers
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e) => {
    preventDefaults(e);
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    preventDefaults(e);
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    preventDefaults(e);
    setIsDragging(false);
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  };
  
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };
  
  const handleFiles = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      const validExtensions = ['.csv', '.xlsx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (validExtensions.includes(fileExtension) || file.type === 'text/csv' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        setSelectedFile(file);
        showBulkUploadStatus('File selected: ' + file.name, 'success');
      } else {
        setSelectedFile(null);
        showBulkUploadStatus('Please upload a CSV or Excel file', 'error');
      }
    }
  };
  
  // Separate status handlers for each form
  const showBulkUploadStatus = (message, type) => {
    setBulkUploadStatus({ message, type });
  };
  
  const showSingleAddStatus = (message, type) => {
    setSingleAddStatus({ message, type });
  };
  
  const handleRemoveFile = (e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setSelectedFile(null);
    setBulkUploadStatus({ message: '', type: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleTemplateDownload = async () => {
    try {
      setIsBulkSubmitting(true);
      // Request the template file from the server
      const response = await axios.get('/api/alumni/template', {
        responseType: 'blob', // Important for file downloads
      });
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'alumni-template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showBulkUploadStatus('Template downloaded successfully', 'success');
    } catch (error) {
      console.error('Error downloading template:', error);
      showBulkUploadStatus('Failed to download template', 'error');
    } finally {
      setIsBulkSubmitting(false);
    }
  };
  
  const handleBulkUploadSubmit = async () => {
    if (!selectedFile) {
      showBulkUploadStatus('Please select a file first', 'error');
      return;
    }
    
    setIsBulkSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('csv', selectedFile);
      
      const response = await axios.post('http://localhost:5001/api/admin/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      const { summary } = response.data;
      showBulkUploadStatus(`Upload complete! Added: ${summary.successCount}, Skipped: ${summary.skipCount}, Failed: ${summary.errorCount}`, 'success');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showBulkUploadStatus(`Upload failed: ${error.response?.data?.message || 'Server error'}`, 'error');
    } finally {
      setIsBulkSubmitting(false);
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSingleSubmitting(true);
    
    // Collect form data
    const formData = {
      prn: e.target.prn.value,
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      phoneNumber: e.target.phoneNumber.value,
      department: e.target.department.value,
      passOutYear: e.target.passOutYear.value,
      position: e.target.position.value,
      companyName: e.target.companyName.value,
      location: e.target.location.value,
      linkedInURL: e.target.linkedinURL.value,
      skills: e.target.skills.value,
      successStory: e.target.successStory.value,
      specialAchievements: e.target.specialAchievements.value,
      hallOfFame: e.target.hallOfFame.value
    };
    
    try {
      // Send the data to the server - using the correct endpoint from your backend
      const response = await axios.post('http://localhost:5001/api/addAlumni/add', formData);
      
      // Clear form
      e.target.reset();
      
      // Show success message
      showSingleAddStatus('Alumni added successfully!', 'success');
    } catch (error) {
      console.error('Error adding alumni:', error);
      showSingleAddStatus(`Failed to add alumni: ${error.response?.data?.message || 'Server error'}`, 'error');
    } finally {
      setIsSingleSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading alumni management..." />;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 px-8 py-6 flex items-center shadow-sm relative text-white">
        {/* Home Button - Outlined White Style */}
        <Link to="/admin-home">
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-transparent border border-white text-white py-2 px-4 rounded-md cursor-pointer flex items-center gap-2 transition-all duration-200 hover:bg-white/10"
          >
            <Home size={16} />
            Home
          </button>
        </Link>

        {/* Title */}
        <div className="ml-auto mr-auto pl-16">
          <h1 className="text-2xl font-bold">Alumni Connect</h1>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <section className="text-center my-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Alumni Management System</h2>
          <p className="text-xl text-gray-600">Add new alumni to our database and keep track of their achievements.</p>
        </section>
        
        {/* Add Alumni Container */}
        <div className="p-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Add Alumni</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
            {/* Bulk Upload Section */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Bulk Upload</h3>
              
              <div 
                id="uploadArea"
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
                  ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'} 
                  ${selectedFile ? 'border-green-500 bg-green-50' : ''}
                  ${isBulkSubmitting ? 'opacity-75 pointer-events-none' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !selectedFile && fileInputRef.current.click()}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                      <FileText size={32} className="text-green-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-800 mb-1">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || "CSV/Excel File"}
                    </p>
                    <div className="flex gap-3 mt-2">
                      <button 
                        className="flex items-center gap-2 text-red-600 py-2 px-4 rounded-md border border-red-200 hover:bg-red-50"
                        onClick={handleRemoveFile}
                        disabled={isBulkSubmitting}
                      >
                        <X size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center mb-4">
                      <Upload size={48} className="text-gray-400" />
                    </div>
                    <p className="mb-2 text-gray-700 font-medium">Drag and drop your CSV file here</p>
                    <p className="text-sm text-gray-500 mb-3">or</p>
                    <span className="inline-block py-2 px-4 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100 hover:bg-indigo-100 transition-colors">
                      Browse Files
                    </span>
                    <input 
                      type="file" 
                      id="bulkUpload" 
                      className="hidden" 
                      accept=".csv,.xlsx"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                    />
                    <p className="mt-3 text-xs text-gray-500">Supports CSV and Excel files</p>
                  </>
                )}
              </div>
              
              {bulkUploadStatus.message && (
                <div 
                  id="bulkUploadStatus" 
                  className={`mt-4 p-3 rounded-md flex items-center gap-2 ${
                    bulkUploadStatus.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-400' 
                      : 'bg-red-50 text-red-800 border border-red-400'
                  }`}
                >
                  {bulkUploadStatus.type === 'success' ? (
                    <Check size={16} className="text-green-600 flex-shrink-0" />
                  ) : (
                    <X size={16} className="text-red-600 flex-shrink-0" />
                  )}
                  <span>{bulkUploadStatus.message}</span>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                <button 
                  className="py-3 px-3 bg-gray-100 border border-gray-300 hover:bg-gray-200 hover:border-gray-400 rounded-md text-gray-700 transition-colors flex items-center justify-center gap-2"
                  onClick={handleTemplateDownload}
                  // disabled={isBulkSubmitting}
                >
                  {/* {isBulkSubmitting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />} */}
                  <FileText size={16} />
                  Download Template
                </button>

                <button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                  onClick={handleBulkUploadSubmit}
                  disabled={!selectedFile || isBulkSubmitting}
                >
                  {isBulkSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  {isBulkSubmitting ? 'Processing...' : 'Upload File'}
                </button>
              </div>
            </div>
            
            {/* Single Alumni Form */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Single Alumni</h3>
              
              <form id="singleAlumniForm" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="fullName">Full Name</label>
                    <textarea 
                      id="fullName" 
                      name="fullName" 
                      rows={1} // Limit to 1 row
                      className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="prn">PRN</label>
                    <input 
                      type="text" 
                      id="prn" 
                      name="prn" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required 
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="hallOfFame">Hall of Fame Status</label>
                    <select 
                      id="hallOfFame" 
                      name="hallOfFame" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required
                    >
                      <option value="featured">Is featured ?</option>
                      <option value="notable">Is Notable ?</option>
                      <option value="">Not on Hall of Fame</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="password">Password</label>
                    <input 
                      type="password" 
                      id="password" 
                      name="password" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="phoneNumber">Phone</label>
                    <input 
                      type="tel" 
                      id="phoneNumber" 
                      name="phoneNumber" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="department">Department</label>
                    <select 
                      id="department" 
                      name="department" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required
                    >
                      <option value="CSE">CSE</option>
                      <option value="AIML">AIML</option>
                      <option value="ENTC">ENTC</option>
                      <option value="MECH">MECH</option>
                      <option value="CIVIL">CIVIL</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="passOutYear">Pass Out Year</label>
                    <input 
                      type="number" 
                      id="passOutYear" 
                      name="passOutYear" 
                      min="1990" 
                      max={currentYear} 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="position">Job Position</label>
                    <input 
                      type="text" 
                      id="position" 
                      name="position" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="companyName">Company Name</label>
                    <input 
                      type="text" 
                      id="companyName" 
                      name="companyName" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="location">Location</label>
                    <input 
                      type="text" 
                      id="location" 
                      name="location" 
                      placeholder="City, Country" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required 
                    />
                  </div>
                  
                  {/* LinkedIn URL - New Field */}
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="linkedinURL">LinkedIn URL</label>
                    <input 
                      type="url" 
                      id="linkedinURL" 
                      name="linkedinURL" 
                      placeholder="https://linkedin.com/in/username" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                    />
                  </div>
                  
                  {/* Skills - New Field */}
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="skills">Skills</label>
                    <input 
                      type="text" 
                      id="skills" 
                      name="skills" 
                      placeholder="Java, Python, React, etc." 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                    />
                  </div>

                  <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="successStory">Success Story</label>
                    <textarea 
                      id="successStory" 
                      name="successStory" 
                      className="w-full p-3 border border-gray-300 rounded-md h-22 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="specialAchievements">Special Achievements</label>
                    <textarea 
                      id="specialAchievements" 
                      name="specialAchievements" 
                      className="w-full p-3 border border-gray-300 rounded-md h-22 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required
                    ></textarea>
                  </div>
                </div>

                {singleAddStatus.message && (
                <div 
                  id="singleAddStatus" 
                  className={`mt-4 p-3 rounded-md flex items-center gap-2 ${
                    singleAddStatus.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-400' 
                      : 'bg-red-50 text-red-800 border border-red-400'
                  }`}
                >
                  {singleAddStatus.type === 'success' ? (
                    <Check size={16} className="text-green-600 flex-shrink-0" />
                  ) : (
                    <X size={16} className="text-red-600 flex-shrink-0" />
                  )}
                  <span>{singleAddStatus.message}</span>
                </div>
              )}
                
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-md mt-4 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  disabled={isSingleSubmitting}
                >
                  {isSingleSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {isSingleSubmitting ? 'Processing...' : 'Submit'}
                </button>
              </form>
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
};

export default AlumniManagement;