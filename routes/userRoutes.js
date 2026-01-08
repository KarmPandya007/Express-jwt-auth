import express from 'express'
import { getAllUsers, getUserById, createUser, updateUserById, deleteUserById, deleteAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.get('/', getAllUsers);
// router.get('/:id', getUserById);
// router.post('/', createUser);
// router.put('/:id', updateUserById);
// router.delete('/:id', deleteUserById);
router.delete('/', deleteAllUsers);



export default router;