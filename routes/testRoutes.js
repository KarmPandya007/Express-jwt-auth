import express from 'express'
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router();

// Test routes with RBAC
router.get('/user', verifyToken, authorizeRoles('user', 'manager', 'admin'), (req, res) => {
  res.json({
    success: true,
    message: `Welcome ${req.user.username}`,
    role: req.user.role
  });
});

router.get('/manager', verifyToken, authorizeRoles('manager', 'admin'), (req, res) => {
  res.json({
    success: true,
    message: `Welcome Manager, ${req.user.username}`,
    role: req.user.role
  });
});

router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.json({
    success: true,
    message: `Welcome Admin, ${req.user.username}`,
    role: req.user.role
  });
});

export default router;