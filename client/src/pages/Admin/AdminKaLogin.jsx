import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Trophy, BookOpen, Award, Briefcase, Check, AlertCircle, X } from 'lucide-react';
import axios from 'axios'; // Make sure to install axios

// API base URL - adjust this to match your backend
const API_URL = "http://localhost:5001/api/admin";

function LoginPage() {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: formData.email,
        password: formData.password
      });
      
      // Store token in localStorage
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(response.data));
      
      // Redirect to admin home
      window.location.href = '/admin-home';
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await axios.post(`${API_URL}/forgot-password`, {
        email: forgotEmail
      });
      
      setShowForgotModal(false);
      setShowOtpModal(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, {
        email: forgotEmail,
        otp: otp
      });
      
      setTempToken(response.data.tempToken);
      setShowOtpModal(false);
      setShowNewPasswordModal(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      await axios.put(
        `${API_URL}/reset-password`, 
        { newPassword },
        { headers: { Authorization: `Bearer ${tempToken}` } }
      );
      
      setShowNewPasswordModal(false);
      setShowNotification(true);
      
      // Clear all input fields
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setForgotEmail('');
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 bg-indigo-600 rounded-full opacity-5 top-0 left-0 -mt-20 -ml-20 animate-float"></div>
        <div className="absolute w-96 h-96 bg-indigo-600 rounded-full opacity-5 top-1/4 right-0 -mr-32 animate-floatReverse"></div>
        <div className="absolute w-96 h-96 bg-indigo-600 rounded-full opacity-5 bottom-0 left-0 -mb-40 -ml-40 animate-float"></div>
      </div>

      {/* Floating icons */}
      <Trophy size={64} className="absolute left-[15%] top-[20%] text-indigo-600 opacity-10 animate-float" />
      <BookOpen size={80} className="absolute right-[10%] top-[30%] text-indigo-600 opacity-10 animate-floatReverse" />
      <Award size={96} className="absolute left-[10%] bottom-[20%] text-indigo-600 opacity-10 animate-float" />
      <Briefcase size={64} className="absolute right-[15%] bottom-[15%] text-indigo-600 opacity-10 animate-floatReverse" />

      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center animate-slideInRight">
          <Check className="mr-2" size={20} />
          <span>Password reset successful!</span>
          <button onClick={() => setShowNotification(false)} className="ml-4">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="w-full max-w-4xl relative z-10">
        <div className="w-full max-w-md mx-auto animate-scaleIn">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
            {/* Form header */}
            <div className="px-8 py-6 bg-indigo-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-600 opacity-50 skew-x-[-12deg]"></div>
              <div className="absolute inset-0 opacity-25">
                <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full opacity-20"></div>
              </div>
              <h2 className="text-3xl font-bold text-white text-center relative z-10 animate-fadeIn">
                Admin Panel
              </h2>
            </div>

            {/* Form content */}
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">
                Welcome Back!
              </h3>
              <p className="text-gray-500 text-center mb-8">
                Please enter your details to sign in
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg flex items-center">
                  <AlertCircle size={20} className="mr-2" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative animate-slideIn">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-all focus:border-indigo-800 focus:ring-2 focus:ring-indigo-100 hover:border-indigo-600"
                    required
                  />
                </div>

                <div className="relative animate-slideIn">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-all focus:border-indigo-800 focus:ring-2 focus:ring-indigo-100 hover:border-indigo-600"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:bg-indigo-900 animate-slideIn disabled:opacity-70"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  {!isLoading && <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />}
                </button>
              </form>

              <div className="mt-6 text-center animate-slideIn">
                <p className="text-gray-500">
                  <button
                    onClick={() => setShowForgotModal(true)}
                    className="inline-block px-1 py-0.5 rounded bg-white text-indigo-600 font-semibold cursor-pointer transition-all hover:bg-gray-50 hover:-translate-y-0.5"
                  >
                    Forgot Password?
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Forgot Password</h3>
              <button onClick={() => setShowForgotModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Enter your email address and we'll send you an OTP to reset your password.</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg flex items-center">
                <AlertCircle size={20} className="mr-2" />
                {error}
              </div>
            )}
            
            <form onSubmit={handleForgotSubmit}>
              <div className="relative mb-4">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-all focus:border-indigo-800 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:bg-indigo-900 disabled:opacity-70"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">OTP Verification</h3>
              <button onClick={() => setShowOtpModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Enter the 6-digit OTP sent to your email address.</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg flex items-center">
                <AlertCircle size={20} className="mr-2" />
                {error}
              </div>
            )}
            
            <form onSubmit={handleOtpSubmit}>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-all focus:border-indigo-800 focus:ring-2 focus:ring-indigo-100 text-center text-xl tracking-widest"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-1 transition-all hover:bg-indigo-900 disabled:opacity-70"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Password Modal */}
      {showNewPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Reset Password</h3>
              <button onClick={() => setShowNewPasswordModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Create a new password for your account.</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg flex items-center">
                <AlertCircle size={20} className="mr-2" />
                {error}
              </div>
            )}
            
            <form onSubmit={handlePasswordReset}>
              <div className="relative mb-4">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-all focus:border-indigo-800 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>
              <div className="relative mb-4">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-all focus:border-indigo-800 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:bg-indigo-900 disabled:opacity-70"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;