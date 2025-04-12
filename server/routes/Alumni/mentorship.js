// routes/mentorship.js
import express from 'express';
const router = express.Router();
import { createMentorship }from'../../controllers/Alumni/mentorship.js';
import { protect } from '../../middleware/Alumni/alumniMiddleware.js';

// Alumni route to create internship
router.post('/', protect, createMentorship);

export default router;