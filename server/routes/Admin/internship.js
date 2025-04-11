// routes/internshipRoutes.js
import express from 'express';
import { 
  getAllInternships, 
  createInternship, 
  getInternshipById, 
  approveInternship,
  markInternshipComplete,
  deleteInternship
} from '../../controllers/Admin/internshipController.js';

const router = express.Router();

// Get all internships and create a new one
router.route('/')
  .get(getAllInternships)
  .post(createInternship);

// Operations on a specific internship
router.route('/:id')
  .get(getInternshipById)
  .delete(deleteInternship);

// Approve an internship
router.route('/:id/approve')
  .patch(approveInternship);

// Mark an internship as complete
router.route('/:id/complete')
  .patch(markInternshipComplete);

export default router;