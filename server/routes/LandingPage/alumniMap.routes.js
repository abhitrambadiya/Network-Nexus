import express from 'express';
import { getMapAlumniData } from '../../controllers/LandingPage/alumniMap.controller.js';

const router = express.Router();

// GET /api/alumni-map - Get alumni data for map visualization
router.get('/', getMapAlumniData);

export default router;