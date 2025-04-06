import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import AdminKaLogin from './pages/Admin/AdminKaLogin.jsx';
import AdminKaHome from './pages/Admin/AdminKaHome.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDirectory from './pages/Admin/AdminDirectory.jsx';
import AdminEvent from './pages/Admin/AdminEvent.jsx';
import AdminAddAlumni from './pages/Admin/AdminAddAlumni.jsx';
import AdminInternship from './pages/Admin/AdminInternship.jsx';
import AdminMentorship from './pages/Admin/AdminMentorship.jsx';


import AlumniLogin from './pages/Alumni/AlumniLogin.jsx';
import AlumniKaHome from './pages/Alumni/AlumniKaHome.jsx';
import AlumniProtectedRoute from './components/alumniProtectedRoute.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin-login" element={<AdminKaLogin />} />
      <Route path="/admin-Directory" element={<AdminDirectory />} />
      <Route path="/admin-Event" element={<AdminEvent />} />
      <Route path="/admin-AddAlumni" element={<AdminAddAlumni />} />
      <Route path="/admin-Internship" element={<AdminInternship />} />
      <Route path="/admin-Mentorship" element={<AdminMentorship />} />


      
      <Route path="/alumni-login" element={<AlumniLogin />} />

      <Route 
        path="/admin-home" 
        element={
          <ProtectedRoute>
            <AdminKaHome />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/alumni-home" 
        element={
          <AlumniProtectedRoute>
            <AlumniKaHome />
          </AlumniProtectedRoute>
        } 
      />
      {/* Remove this duplicate route ↓ */}
      {/* <Route path="/admin-home" element={<AdminKaHome />} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);