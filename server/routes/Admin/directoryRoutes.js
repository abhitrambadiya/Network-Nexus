import express from 'express';
import { adminDirectory } from '../../controllers/Admin/directoryController.js';

const router = express.Router();

router.get('/admin-directory', adminDirectory);

export default router;