import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const err = new Error('Authorization header missing');
    err.status = 401;
    return next(err);
  }
  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  try {
    const decoded =  jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error verifying token: ', err);
    const error = new Error('Invalid token');
    error.status = 403;
    return next(error);
  }
};