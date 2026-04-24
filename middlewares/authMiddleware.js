import jwt from 'jsonwebtoken';
import AppError from '../utils/errorHandling.js';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError('Authorization header missing', 401, []));
  }
  const token = authHeader?.split(' ')[1];

  try {
    const decoded =  jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    // req.log.info({
    //   err,
    //   msg: 'JWT Verification Failed',
    //   path: req.url,
    //   method: req.method
    // });
    return next(new AppError('Invalid token', 403, [{ field: 'token', message: 'Token is invalid or expired' }]));
  }
};