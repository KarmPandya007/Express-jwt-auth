import express from 'express'
import { getAllUsers, getUserById, updateUserById, deleteUserById, deleteAllUsers } from "../controllers/userController.js";
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router();

router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', verifyToken, deleteUserById);
router.delete('/', verifyToken, deleteAllUsers);



export default router;