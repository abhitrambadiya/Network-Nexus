import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import LoadingScreen from "../../components/LoadingScreen.jsx";

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqsWithDelay = async () => {
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
  
    fetchFaqsWithDelay();
  }, []);  

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

    if (loading) {
        return <LoadingScreen message="Loading alumni FAQ's..." />;
      }      

  const faqs = [
    {
      question: "How do I join the Alumni Association?",
      answer: "Joining is easy! All graduates automatically become members of our Alumni Association. To access exclusive benefits and stay connected, simply register on our alumni portal using your student ID or graduation year.",
      category: "Membership"
    },
    {
      question: "What networking opportunities are available?",
      answer: "We offer various networking opportunities including annual reunions, professional meetups, mentorship programs, and our online alumni directory. We also host regular industry-specific events and webinars throughout the year.",
      category: "Events"
    },
    {
      question: "How can I update my contact information?",
      answer: "Log in to the alumni portal and navigate to 'My Profile' to update your contact information, professional details, and communication preferences. Keeping your information current helps us keep you informed about relevant opportunities and events.",
      category: "Portal Access"
    },
    {
      question: "What benefits do alumni members receive?",
      answer: "Members enjoy access to career services, library resources, gym facilities, exclusive events, mentorship programs, and special discounts on continuing education courses. You'll also receive our quarterly newsletter and invitations to special campus events.",
      category: "Benefits"
    },
    {
      question: "How can I give back to the university?",
      answer: "There are many ways to give back! You can volunteer as a mentor, contribute to scholarship funds, participate in fundraising events, or join our alumni advisory board. Contact our alumni office to learn more about specific opportunities.",
      category: "Giving Back"
    },
    {
      question: "Can I access the university library as an alumnus?",
      answer: "Yes, alumni members have access to both physical and digital library resources. You can obtain your alumni library card from the main library with proof of graduation. Digital resources can be accessed through the alumni portal.",
      category: "Resources"
    },
    {
      question: "How do I get involved in mentoring current students?",
      answer: "Our mentorship program pairs alumni with current students based on career paths and interests. Sign up through the alumni portal's 'Mentorship' section, where you can create a profile and specify your areas of expertise.",
      category: "Mentorship"
    }
  ];

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const toggleItem = (index) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b to-white">
      {/* Navbar */}
      <nav className="bg-white shadow fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
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

      {/* Main Content with padding to account for fixed navbar */}
      <div className="max-w-4xl mx-auto px-4 py-16 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Alumni Association FAQ
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about your alumni benefits and services
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search FAQs..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => toggleItem(index)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openItems.includes(index) && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600">{faq.answer}</p>
                  <span className="inline-block mt-2 text-sm font-medium text-blue-600">
                    {faq.category}
                  </span>
                </div>
              )}
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No FAQs found matching your search criteria.</p>
            </div>
          )}
        </div>
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
};

export default App;