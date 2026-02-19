import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || '1h';

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const registerUser = async (req, res) => {
  try {
    const username = req.body.username.trim();
    const { password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ username, password: hashedPassword, role: 'user' });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const username = req.body.username.trim();
    const { password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      expiresIn: ACCESS_TOKEN_EXPIRY,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
};
