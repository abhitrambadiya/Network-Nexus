import express from 'express';
import emailController from '../../controllers/LandingPage/emailController.js';

const router = express.Router();

router.post('/subscribe', emailController.subscribe);

export default router;