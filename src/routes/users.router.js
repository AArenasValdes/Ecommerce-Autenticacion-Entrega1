import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.controller.js';

export const usersRouter = Router();

// Protegido: solo admin
usersRouter.use(requireAuth, requireRole('admin'));

usersRouter.get('/', getAllUsers);
usersRouter.get('/:uid', getUserById);
usersRouter.post('/', createUser);
usersRouter.put('/:uid', updateUser);
usersRouter.delete('/:uid', deleteUser);