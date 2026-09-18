import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'savora_super_secret_jwt_token_key_2026';
      
      const decoded = jwt.verify(token, secret);
      
      if (mongoose.connection.readyState === 1) {
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
          return next();
        }
      }

      req.user = { id: decoded.id, role: decoded.role || 'customer', name: decoded.name || 'User', email: decoded.email };
      return next();
    } catch (error) {
      console.error('[JWT Auth Middleware Error]:', error.message);
      return res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided in Authorization header' });
  }
};

export default protect;
