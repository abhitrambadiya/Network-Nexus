import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { Home } from 'lucide-react';

const AlumniManagement = () => {
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const fileInputRef = useRef(null);
  const currentYear = new Date().getFullYear();
  
  // Drag and drop handlers
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const highlight = () => {
    document.getElementById('uploadArea').classList.add('border-indigo-600', 'bg-gray-50');
    document.getElementById('uploadArea').classList.remove('border-gray-300');
  };
  
  const unhighlight = () => {
    document.getElementById('uploadArea').classList.remove('border-indigo-600', 'bg-gray-50');
    document.getElementById('uploadArea').classList.add('border-gray-300');
  };
  
  const handleDrop = (e) => {
    preventDefaults(e);
    unhighlight();
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  };
  
  const handleFiles = (files) => {
    if (files.length > 0) {
      const file = files[0];
      const validTypes = ['.csv', '.xlsx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (validTypes.includes(fileExtension)) {
        showUploadStatus('File selected: ' + file.name, 'success');
        // Here you would typically handle the file upload to the server
      } else {
        showUploadStatus('Please upload a CSV or Excel file', 'error');
      }
    }
  };
  
  const showUploadStatus = (message, type) => {
    setUploadStatus({ message, type });
  };
  
  const handleTemplateDownload = () => {
    // Here you would typically handle the template download
    console.log('Template download requested');
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Collect form data
    const formData = {
      prn: e.target.prn.value,
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      phone: e.target.phone.value,
      department: e.target.department.value,
      passOutYear: e.target.passOutYear.value,
      position: e.target.position.value,
      company: e.target.company.value,
      location: e.target.location.value,
      jobDescription: e.target.jobDescription.value
    };
    
    // Here you would typically send the data to the server
    console.log('Form submitted:', formData);
    
    // Clear form
    e.target.reset();
    alert('Alumni added successfully!');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}

<nav className="bg-indigo-600 px-8 py-6 flex items-center shadow-sm relative text-white">
  {/* Home Button - Outlined White Style */}
 
  <Link to="/admin-home">
  <button
    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-transparent border border-white text-white py-2 px-4 rounded-md cursor-pointer flex items-center gap-2 transition-all duration-200 hover:bg-white/10"
    onClick={() => window.location.href = '/'}
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
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors mb-4"
                onDragEnter={preventDefaults}
                onDragOver={preventDefaults}
                onDragLeave={preventDefaults}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <div className="text-4xl mb-4">📁</div>
                <label className="block cursor-pointer">
                  <p className="mb-2 text-gray-700">Drag and drop your file here or</p>
                  <span className="text-indigo-600">Browse Files</span>
                  <input 
                    type="file" 
                    id="bulkUpload" 
                    className="hidden" 
                    accept=".csv,.xlsx"
                    ref={fileInputRef}
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </label>
              </div>
              
              {uploadStatus.message && (
                <div 
                  id="uploadStatus" 
                  className={`mt-4 p-3 rounded-md ${
                    uploadStatus.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-400' 
                      : 'bg-red-50 text-red-800 border border-red-400'
                  }`}
                >
                  {uploadStatus.message}
                </div>
              )}
              
              <button 
                className="w-full py-3 px-3 mt-4 bg-gray-100 border border-gray-300 hover:bg-gray-200 hover:border-gray-400 rounded-md text-gray-700 transition-colors"
                onClick={handleTemplateDownload}
              >
                Download Template
              </button>

              <button 
                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-md mt-4 transition-colors text-1xl"
                onClick={handleTemplateDownload}
              >
                Submit
              </button>
            </div>
            
            {/* Single Alumni Form */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Single Alumni</h3>
              
              <form id="singleAlumniForm" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="fullName">Full Name</label>
                    <input 
                      type="text" 
                      id="fullName" 
                      name="fullName" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required 
                    />
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
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="phone">Phone</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
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
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
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
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="position">Current Position</label>
                    <input 
                      type="text" 
                      id="position" 
                      name="position" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="company">Company</label>
                    <input 
                      type="text" 
                      id="company" 
                      name="company" 
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
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block mb-2 text-gray-700 font-medium" htmlFor="jobDescription">Job Description</label>
                    <textarea 
                      id="jobDescription" 
                      name="jobDescription" 
                      className="w-full p-3 border border-gray-300 rounded-md h-32 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                      required
                    ></textarea>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-md mt-4 transition-colors"
                >
                  Submit
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