import express from 'express';
import { getTrainers, createTrainer } from '../controllers/trainerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getTrainers);
router.post('/', verifyToken, createTrainer);

export default router;
