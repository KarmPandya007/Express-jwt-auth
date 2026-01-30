import express from 'express'
import { getAllUsers, getUserById, updateUserById, deleteUserById, deleteAllUsers } from "../controllers/userController.js";
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router();

// Get all users - Admin only
router.get('/', verifyToken, authorizeRoles('admin'), getAllUsers);

// Get user by ID - User (own profile), Manager, Admin
router.get('/:id', verifyToken, authorizeRoles('user', 'manager', 'admin'), getUserById);

// Update user by ID - User (own profile), Admin
router.put('/:id', verifyToken, authorizeRoles('user', 'admin'), updateUserById);

// Delete user by ID - Admin only
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteUserById);

// Delete all users - Admin only (dangerous operation!)
router.delete('/', verifyToken, authorizeRoles('admin'), deleteAllUsers);

export default router;