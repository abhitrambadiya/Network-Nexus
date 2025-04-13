import React, { useState, useEffect } from 'react';
import { FileText, Upload, Plus, X, Check, Download } from 'lucide-react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen.jsx";

const handleLogout = async () => {
    try {
        await apiAlumni.post('/logout', {}, { withCredentials: true });
        logout(); // Use the logout function from context
    } catch (error) {
        console.error('Logout failed:', error);
        // Still attempt to logout locally if server logout fails
        logout();
    }
  }; 

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setError('Please upload only PDF files');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }
    if (!title.trim() || !subject.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newDocument = {
        id: Date.now(),
        title: title.trim(),
        subject: subject.trim(),
        fileName: selectedFile.name,
        uploadDate: new Date().toLocaleDateString(),
        file: selectedFile
      };

      setDocuments([...documents, newDocument]);
      setSuccess('Document uploaded successfully!');
      
      // Close modal after showing success message
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess('');
        resetForm();
      }, 1500);
    } catch (err) {
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSubject('');
    setSelectedFile(null);
    setError('');
    setSuccess('');
    const fileInput = document.getElementById('pdf-upload');
    if (fileInput) fileInput.value = '';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleDownload = (doc) => {
    // Create a URL for the file
    const fileUrl = URL.createObjectURL(doc.file);
    
    // Create a temporary anchor element
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    downloadLink.download = doc.fileName;
    
    // Append to document, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up the URL object
    URL.revokeObjectURL(fileUrl);
  };

  useEffect(() => {
    const fetchResourcesWithDelay = async () => {
      const start = Date.now();
      
      try {
        // Simulate API call with a promise (replace this with real fetch if needed)
        await new Promise((resolve) => setTimeout(resolve, 300)); // simulate quick fetch
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 1000 - elapsed); // ensure min 1s loading time
  
        setTimeout(() => {
          setLoading(false);
        }, delay);
      }
    };
  
    fetchResourcesWithDelay();
  }, []);  

  if (loading) {
    return <LoadingScreen message="Loading Alumni Add Resources..." />;
  } 

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-7 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-indigo-600 no-underline">Alumni Hub</a>
          <div className="flex items-center gap-8">
            <Link to="/alumni-home" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Home</Link>
            <Link to="/alumni-faq" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Q&A</Link>
            <Link to="/alumni-studyresources" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Study Resources</Link>
            <Link to="/alumni-mentorship" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Add Mentorship</Link>
            <Link to="/alumni-internship" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors no-underline">Add Internsip</Link>

            <button onClick={handleLogout} className="text-gray-700 border border-gray-300 px-4 py-1.5 rounded-md ml-4 hover:text-indigo-600 hover:border-indigo-600 hover:bg-gray-50 transition-all no-underline font-medium">
            Logout
          </button>
          </div>
        </div>
      </nav>

      {/* Main Content - Added pt-24 to provide space for the fixed navbar */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl text-gray-800 m-0">Course Materials</h1>
          <button 
            className="flex items-center gap-2 py-3 px-6 bg-indigo-500 text-white border-none rounded text-base cursor-pointer hover:bg-indigo-600 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            Add Material
          </button>
        </div>
        <p className="text-gray-500 mb-8">
          Share your course materials with fellow alumni. Upload PDF documents from your courses to help others learn.
        </p>

        {/* Upload Modal */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div 
              className="bg-white rounded-lg w-11/12 max-w-2xl max-h-90vh overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl text-gray-800 m-0">Upload Course Material</h2>
                <button 
                  className="bg-transparent border-none text-gray-500 cursor-pointer p-2 flex items-center justify-center hover:text-gray-800"
                  onClick={closeModal}
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6">
                  <label htmlFor="title" className="block mb-2 text-gray-700 font-medium">Document Title</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Introduction to Computer Science Notes"
                    className="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="subject" className="block mb-2 text-gray-700 font-medium">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="pdf-upload" className="block mb-2 text-gray-700 font-medium">Upload PDF</label>
                  <div 
                    className={`flex items-center gap-4 p-4 border-2 ${selectedFile ? 'border-green-500 bg-green-50 border-solid' : 'border-gray-300 border-dashed hover:border-indigo-500 hover:bg-gray-50'} rounded cursor-pointer transition-all`}
                    onClick={() => document.getElementById('pdf-upload')?.click()}
                  >
                    <input
                      type="file"
                      id="pdf-upload"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {selectedFile ? (
                      <Check size={20} className="text-green-500" />
                    ) : (
                      <Upload size={20} className="text-gray-500" />
                    )}
                    <span>{selectedFile ? selectedFile.name : 'Choose a PDF file'}</span>
                  </div>
                </div>

                {error && <p className="text-red-600 mt-2 text-sm p-2 bg-red-50 rounded">{error}</p>}
                {success && <p className="text-green-600 mt-2 text-sm p-2 bg-green-50 rounded flex items-center gap-2">{success}</p>}

                <div className="flex justify-end gap-4 mt-8">
                  <button 
                    type="button" 
                    className="py-3 px-6 bg-gray-100 text-gray-700 border-none rounded text-base cursor-pointer hover:bg-gray-200"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`py-3 px-6 ${isUploading ? 'bg-indigo-300' : 'bg-indigo-500 hover:bg-indigo-600'} text-white border-none rounded text-base cursor-pointer flex items-center gap-2 transition-all`}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="mt-12">
          <h2 className="text-2xl text-gray-800 mb-6">Uploaded Documents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md hover:-translate-y-1 transition-all">
                <FileText size={24} className="text-indigo-500 mb-4" />
                <div className="mb-4">
                  <h3 className="text-lg text-gray-800 mb-2">{doc.title}</h3>
                  <p className="text-gray-500 text-sm mb-1">{doc.subject}</p>
                  <p className="text-gray-400 text-sm mb-1">{doc.fileName}</p>
                  <p className="text-gray-400 text-sm mb-4">Uploaded on {doc.uploadDate}</p>
                </div>
                <button 
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 border-none rounded text-sm cursor-pointer transition-all flex items-center justify-center gap-2 hover:bg-gray-200 hover:text-gray-800"
                  onClick={() => handleDownload(doc)}
                >
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            ))}
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

export default App;