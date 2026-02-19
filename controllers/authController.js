import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const REFRESH_COOKIE_NAME = 'refreshToken';

const signAccessToken = (user) => jwt.sign(
  { id: user._id, username: user.username, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: ACCESS_TOKEN_EXPIRY }
);

const signRefreshToken = (user) => jwt.sign(
  { sub: user._id.toString(), tokenVersion: user.tokenVersion },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: REFRESH_TOKEN_EXPIRY }
);

const parseCookies = (cookieHeader = '') => {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, pair) => {
      const [key, ...rest] = pair.split('=');
      cookies[key] = decodeURIComponent(rest.join('='));
      return cookies;
    }, {});
};

const setRefreshTokenCookie = (res, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  const maxAge = 7 * 24 * 60 * 60;

  const cookieParts = [
    `${REFRESH_COOKIE_NAME}=${encodeURIComponent(refreshToken)}`,
    'HttpOnly',
    'Path=/api/auth',
    'SameSite=Strict',
    `Max-Age=${maxAge}`
  ];

  if (isProd) cookieParts.push('Secure');

  res.setHeader('Set-Cookie', cookieParts.join('; '));
};

const clearRefreshTokenCookie = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieParts = [
    `${REFRESH_COOKIE_NAME}=`,
    'HttpOnly',
    'Path=/api/auth',
    'SameSite=Strict',
    'Max-Age=0'
  ];

  if (isProd) cookieParts.push('Secure');

  res.setHeader('Set-Cookie', cookieParts.join('; '));
};

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

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const cookies = parseCookies(req.headers.cookie || '');
    const refreshToken = cookies[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token not found' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.sub);

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const accessToken = signAccessToken(user);
    const rotatedRefreshToken = signRefreshToken(user);
    setRefreshTokenCookie(res, rotatedRefreshToken);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken
    });
  } catch (error) {
    clearRefreshTokenCookie(res);
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

export const logoutUser = async (req, res) => {
  clearRefreshTokenCookie(res);
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const logoutAllDevices = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    clearRefreshTokenCookie(res);
    return res.status(200).json({ success: true, message: 'Logged out from all devices' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to logout from all devices' });
  }
};
