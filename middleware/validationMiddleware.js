const usernameRegex = /^[a-zA-Z0-9_]+$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const validateRegisterInput = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length < 3 || username.trim().length > 30) {
    return res.status(400).json({ success: false, message: 'Username must be between 3 and 30 characters.' });
  }

  if (!usernameRegex.test(username.trim())) {
    return res.status(400).json({ success: false, message: 'Username can only contain letters, numbers, and underscores.' });
  }

  if (!password || typeof password !== 'string' || password.length < 8 || password.length > 72) {
    return res.status(400).json({ success: false, message: 'Password must be between 8 and 72 characters.' });
  }

  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({ success: false, message: 'Password must include uppercase, lowercase, and a number.' });
  }

  return next();
};

export const validateLoginInput = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ success: false, message: 'Username is required.' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Password is required.' });
  }

  return next();
};
