import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import * as AuthControllers from '../controllers/authControllers.js';
import { logMethod, logOriginalUrl } from '../utils/logger.js';

const router = express.Router();

const logStuff = [logOriginalUrl, logMethod]

router.post('/register', logStuff, AuthControllers.register);

router.post('/login', logStuff, AuthControllers.login);

export default router;