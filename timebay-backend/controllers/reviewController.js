import User from '../models/User.js';
import Task from '../models/Task.js';
import Bid from '../models/Bid.js';

export const leaveReview = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { rating, comment, taskId } = req.body;

    const task = await Task.findById(taskId);
    if (!task || task.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this task' });
    }

    const bid = await Bid.findById(task.selectedBid);
    if (!bid || bid.seller.toString() !== sellerId) {
      return res.status(400).json({ message: 'Invalid seller for this task' });
    }

    const seller = await User.findById(sellerId);
    seller.reviews.push({
      rating,
      comment,
      from: req.user._id
    });

    // Update trustScore (average of all ratings)
    const total = seller.reviews.reduce((sum, r) => sum + r.rating, 0);
    seller.trustScore = (total / seller.reviews.length).toFixed(2);

    await seller.save();
    res.json({ message: 'Review submitted', trustScore: seller.trustScore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
