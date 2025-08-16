import express from 'express';
import {
  getAllUsers,
  deleteUser,
  getAllTasks,
  deleteTask,
  updateUserRole
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, isAdmin); // All routes below require admin

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

router.get('/tasks', getAllTasks);
router.delete('/tasks/:id', deleteTask);

export default router;
