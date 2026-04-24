import express from 'express';
import * as UserController from '../controllers/userControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, UserController.getUsersData);

router.post('/', authMiddleware, UserController.createUserData);

router.get('/:id', authMiddleware, UserController.getUserDataById);

router.delete('/:id', authMiddleware, UserController.deleteUserData)

export default router;
