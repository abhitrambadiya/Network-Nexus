// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import Admin from '../../models/Admin/adminLogin.js';

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_ADMIN, {
    expiresIn: '30d',
  });
};

// Protect Routes
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

      // Get admin from the token
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
  if (req.admin && req.admin.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};