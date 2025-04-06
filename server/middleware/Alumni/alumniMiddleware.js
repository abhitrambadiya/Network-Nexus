// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import Alumni from '../../models/Alumni/alumniLogin.js';

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_ALUMNI, {
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET_ALUMNI);

      // Get alumni from the token
      req.alumni = await Alumni.findById(decoded.id).select('-password');

      if (!req.alumni) {
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

// Alumni only middleware
export const alumniOnly = (req, res, next) => {
  if (req.alumni && req.aalumni.isAlumni) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an alumni' });
  }
};