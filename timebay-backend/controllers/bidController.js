import Bid from '../models/Bid.js';
import Task from '../models/Task.js';


export const placeBid = async (req, res) => {
  try {
    const { price, message } = req.body;
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId);
    if (!task || task.status !== 'open') {
      return res.status(400).json({ message: 'Task not available for bidding' });
    }

    const bid = await Bid.create({
      task: taskId,
      seller: req.user._id,
      price,
      message
    });

    // Emit socket event to buyer
    const io = req.app.get('io');
    if (io && task.buyer) {
      io.to(task.buyer.toString()).emit('newBid', {
        taskId: task._id,
        message: `New bid placed by ${req.user.name}`
      });
    }

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getBidsForTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);

    if (!task || task.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view bids' });
    }

    const bids = await Bid.find({ task: taskId }).populate('seller', 'name email');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const acceptBid = async (req, res) => {
  try {
    const bidId = req.params.bidId;
    const bid = await Bid.findById(bidId).populate('task');

    if (!bid || bid.task.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this bid' });
    }

    bid.status = 'accepted';
    await bid.save();

    bid.task.status = 'assigned';
    bid.task.selectedBid = bid._id;
    await bid.task.save();

    // Emit socket event to seller
    const io = req.app.get('io');
    if (io && bid.seller) {
      io.to(bid.seller.toString()).emit('bidAccepted', {
        taskId: bid.task._id,
        message: `Your bid was accepted!`
      });
    }

    res.json({ message: 'Bid accepted and task assigned', bid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ seller: req.user._id }).populate('task');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
