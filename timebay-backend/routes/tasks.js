import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTask);         // Buyer creates task
router.get('/', getTasks);                     // Public task listing
router.get('/:id', getTaskById);               // View single task
router.put('/:id', protect, updateTask);       // Buyer updates task
router.delete('/:id', protect, deleteTask);    // Buyer deletes task

export default router;
