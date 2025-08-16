import express from 'express';
import {
  placeBid,
  getBidsForTask,
  acceptBid,
  getMyBids
} from '../controllers/bidController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:taskId', protect, placeBid);           // Seller places bid
router.get('/task/:taskId', protect, getBidsForTask); // Buyer views bids on a task
router.put('/:bidId/accept', protect, acceptBid);     // Buyer accepts a bid
router.get('/me', protect, getMyBids);                // Seller views their bids

export default router;
