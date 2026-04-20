import express from 'express';
import * as UserController from '../controllers/userControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { logMethod, logOriginalUrl } from '../utils/logger.js';
const router = express.Router();

const logStuff = [logOriginalUrl, logMethod, authMiddleware]

router.get('/', logStuff, UserController.getUsersData);

router.get('/filter', logStuff, UserController.filterUsersData);

router.post('/', logStuff, UserController.createUserData);

router.get('/:id', logStuff, UserController.getUserDataById);

router.delete('/:id', logStuff, UserController.deleteUserData)

export default router;
