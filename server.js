import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { validateEnv } from './config/env.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();

const authAttempts = new Map();
const authLimiter = (req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 100;

  const attempts = authAttempts.get(key) || [];
  const recentAttempts = attempts.filter((timestamp) => now - timestamp < windowMs);

  if (recentAttempts.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again later.'
    });
  }

  recentAttempts.push(now);
  authAttempts.set(key, recentAttempts);
  return next();
};

const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-XSS-Protection', '0');
  next();
};

app.use(securityHeaders);
app.use(express.json({ limit: '10kb' }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || '*',
    credentials: true
  })
);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running in port http://localhost:${PORT}`);
});
