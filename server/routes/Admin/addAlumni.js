import express from 'express';
import { addSingleAlumni } from '../../controllers/Admin/alumniController.js';

const router = express.Router();

/**
 * @route   POST /api/alumni/add
 * @desc    Add a single alumni record
 * @access  Admin
 */
router.post('/add', addSingleAlumni);

// Export the router
export default router;