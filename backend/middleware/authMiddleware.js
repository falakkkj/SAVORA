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
      
      // If connected to MongoDB and decoded ID is a valid 24-char ObjectId hex string
      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(decoded.id)) {
        try {
          const user = await User.findById(decoded.id).select('-password');
          if (user) {
            req.user = user;
            return next();
          }
        } catch (dbErr) {
          console.warn('[DB User Lookup Warning]:', dbErr.message);
        }
      }

      // Seamless fallback user payload from token
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        role: decoded.role || 'customer',
        name: decoded.name || 'User',
        email: decoded.email
      };
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
