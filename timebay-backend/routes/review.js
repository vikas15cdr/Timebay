import express from 'express';
import { leaveReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:sellerId', protect, leaveReview); // Buyer reviews seller

export default router;
