import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'savora_super_secret_jwt_token_key_2026';

  if (!process.env.JWT_SECRET) {
    console.warn('[JWT Utils Warning] JWT_SECRET is missing in environment. Using default fallback key.');
  }

  const payload = {
    id: user._id || user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  return jwt.sign(payload, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;
