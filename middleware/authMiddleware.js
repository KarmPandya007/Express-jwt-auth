import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split("")[1];
    }

    if (!token) {
        res.status(401).json({
            message: "No token authorization denied."
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        console.log(`The decode user is : ${req.user}`)
    } catch (error) {
        res.status(400).json({
            message: "Token is not valid."
        })
    }
}

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this resource"
      });
    }
    next();
  };
};

