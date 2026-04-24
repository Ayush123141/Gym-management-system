import express from 'express';
import { getLocations, createLocation } from '../controllers/locationController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getLocations);
router.post('/', verifyToken, createLocation);

export default router;
