import express from 'express';
import { getSuccessStories } from '../../controllers/LandingPage/alumniSuccessStoriesController.js';

const router = express.Router();

router.get('/success-stories', getSuccessStories);

export default router;