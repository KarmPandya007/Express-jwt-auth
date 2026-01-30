import jwt from 'jsonwebtoken'

/**
 * Middleware to verify JWT token from Authorization header
 * Extracts user information and attaches to req.user
 */
export const verifyToken = (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    // Fix: split by space, not empty string
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied."
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    console.log(`Authenticated user:`, req.user);
    // Fix: Add missing next() call
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is not valid."
    });
  }
}

/**
 * Middleware to authorize based on user roles
 * Usage: authorizeRoles('admin', 'manager')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (should be set by verifyToken)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    next();
  };
};

