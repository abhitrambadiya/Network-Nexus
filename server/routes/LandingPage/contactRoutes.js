import express from 'express';
import { submitContact } from '../../controllers/LandingPage/contactController.js';
import rateLimit from 'express-rate-limit';

// Configure rate limiting
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 5 requests per window
  message: {
    success: false,
    message: 'Too many submission attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const router = express.Router();

router.post('/submit', contactLimiter, submitContact);

export default router;