import { Router } from 'express';
import {
  createUser,
  deleteUser,
  editUser,
  getUsers,
  resendOTP,
  verifyOTP,
} from '../controllers/users.controller.js';
import { loginMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/new', createUser);
router.delete('/:id', loginMiddleware, deleteUser);
router.put('/:id', loginMiddleware, editUser);
router.get('/', loginMiddleware, getUsers);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

export default router;
