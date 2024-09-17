import { verifyToken } from '../utils/jwtHelpers.js';

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Expecting "Bearer <token>"

  if (!token) {
    return res.status(403).send({ error: 'Token is required' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(403).send({ error: 'Invalid or expired token' });
  }

  // Attach user to the request object
  req.user = user;
  next();
};

export default authenticateToken;
