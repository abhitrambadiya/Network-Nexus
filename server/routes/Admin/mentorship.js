// routes/programRoutes.js
import express from 'express';
const router = express.Router();
import {
  getAllPrograms,
  approveProgram,
  markProgramComplete
} from '../../controllers/Admin/mentorshipController.js';

// Routes
router.get('/', getAllPrograms);
router.put('/:id/approve', approveProgram);
router.put('/:id/complete', markProgramComplete);

export default router;
