import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  location: String,
  deadline: Date,
  maxBudget: Number,
  status: { type: String, enum: ['open', 'assigned', 'completed'], default: 'open' },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  selectedBid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
