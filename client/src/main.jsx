import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ScrollToTop from "./ScrollToTop";
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import LandingPage from './pages/LandingPage.jsx';



// Admin Page Routes
import AdminKaLogin from './pages/Admin/AdminKaLogin.jsx';
import AdminKaHome from './pages/Admin/AdminKaHome.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDirectory from './pages/Admin/AdminDirectory.jsx';
import AdminAddAlumni from './pages/Admin/AdminAddAlumni.jsx';
import AdminInternship from './pages/Admin/AdminInternship.jsx';
import AdminMentorship from './pages/Admin/AdminMentorship.jsx';



// Alumni Page Routes
import AlumniLogin from './pages/Alumni/AlumniLogin.jsx';
import AlumniKaHome from './pages/Alumni/AlumniKaHome.jsx';
import AlumniKaMentorship from './pages/Alumni/Mentorship.jsx'
import AlumniProtectedRoute from './components/alumniProtectedRoute.jsx';
import './index.css';

// Admin layout with context provider
const AdminLayout = () => {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin-login" element={<AdminKaLogin />} />
      <Route path="/alumni-login" element={<AlumniLogin />} />
      
      {/* Protected Alumni Routes */}
      <Route path="/alumni-home" element={<AlumniProtectedRoute><AlumniKaHome /></AlumniProtectedRoute>} />
      <Route path="/alumni-mentorship" element={<AlumniProtectedRoute><AlumniKaMentorship /></AlumniProtectedRoute>} />
      
      {/* Admin Routes under AdminAuthProvider context */}
      <Route element={<AdminLayout />}>
        <Route path="/admin-home" element={<ProtectedRoute><AdminKaHome /></ProtectedRoute>} />
        <Route path="/admin-Directory" element={<ProtectedRoute><AdminDirectory /></ProtectedRoute>} />
        <Route path="/admin-AddAlumni" element={<ProtectedRoute><AdminAddAlumni /></ProtectedRoute>} />
        <Route path="/admin-Internship" element={<ProtectedRoute><AdminInternship /></ProtectedRoute>} />
        <Route path="/admin-Mentorship" element={<ProtectedRoute><AdminMentorship /></ProtectedRoute>} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);