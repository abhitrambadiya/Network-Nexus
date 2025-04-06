// routes/alumni/alumniRoutes.js
import express from 'express';
import { 
  loginAlumni, 
  forgotPassword, 
  verifyOTP, 
  resetPassword 
} from '../../controllers/Alumni/alumniLoginController.js';
import { protect } from '../../middleware/Alumni/alumniMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginAlumni);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);

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