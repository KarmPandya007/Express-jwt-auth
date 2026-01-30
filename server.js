import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import testRoutes from './routes/testRoutes.js'

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

app.use('/api/test', testRoutes)
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running in port http://localhost:${PORT}`)
})