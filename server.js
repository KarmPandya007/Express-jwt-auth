import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import { verifyToken, authorizeRoles } from './middleware/authMiddleware.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
await connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Test routes with RBAC
app.get('/user', verifyToken, authorizeRoles('user', 'manager', 'admin'), (req, res) => {
  res.json({
    success: true,
    message: `Welcome ${req.user.username}`,
    role: req.user.role
  });
});

app.get('/manager', verifyToken, authorizeRoles('manager', 'admin'), (req, res) => {
  res.json({
    success: true,
    message: `Welcome Manager ${req.user.username}`,
    role: req.user.role
  });
});

app.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.json({
    success: true,
    message: `Welcome Admin ${req.user.username}`,
    role: req.user.role
  });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running in port http://localhost:${PORT}`)
})