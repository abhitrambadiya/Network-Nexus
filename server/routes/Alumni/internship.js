// routes/internshipRoutes.js
import express from 'express';
const router = express.Router();
import { createInternship }from'../../controllers/Alumni/internship.js';
import { protect } from '../../middleware/Alumni/alumniMiddleware.js';

// Alumni route to create internship
router.post('/', protect, createInternship);

export default router;