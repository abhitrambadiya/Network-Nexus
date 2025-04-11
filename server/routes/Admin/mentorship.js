// routes/programRoutes.js
import express from 'express';
const router = express.Router();
import {
  getAllPrograms,
  approveProgram,
  markProgramComplete,
  deleteProgram
} from '../../controllers/Admin/mentorshipController.js';

// Routes
router.get('/', getAllPrograms);
router.put('/:id/approve', approveProgram);
router.put('/:id/complete', markProgramComplete);
router.delete('/:id', deleteProgram);

export default router;
