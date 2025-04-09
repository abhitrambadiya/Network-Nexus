// routes/admin/adminRoutes.js
import express from 'express';
import { 
  loginAdmin, 
  forgotPassword, 
  verifyOTP, 
  resetPassword,
  getAdminProfile
} from '../../controllers/Admin/adminLoginController.js';
import { protect } from '../../middleware/Admin/adminMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.get('/profile', protect, getAdminProfile);

// Protected routes
router.put('/reset-password', protect, resetPassword);


router.post('/logout', (req, res) => {
  res.clearCookie('token', {
      httpOnly: true,
      secure: false,  // Set to true if using HTTPS
      sameSite: 'Lax'
  });

  res.status(200).json({ message: 'Logout successful' });
});


export default router;