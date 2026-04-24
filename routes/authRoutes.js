import express from 'express';
import * as AuthControllers from '../controllers/authControllers.js';
import { validate } from '../middlewares/validate.js';
import { schemaRegisterUser, schemaLoginUser } from '../validations/joiValidation.js';

const router = express.Router();

router.post('/register', validate(schemaRegisterUser), AuthControllers.register);

router.post('/login', validate(schemaLoginUser), AuthControllers.login);

export default router;