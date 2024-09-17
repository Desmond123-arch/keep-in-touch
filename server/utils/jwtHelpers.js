import jwt from 'jsonwebtoken';

// Secret key for JWT signing (should be stored in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '4h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export { generateToken, verifyToken };