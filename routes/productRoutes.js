import express from 'express';
import * as ProductController from '../controllers/productControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { schemaCreateProduct } from '../validations/joiValidation.js';


const router = express.Router();


router.get('/', authMiddleware, ProductController.getProducts);

router.post('/', authMiddleware, validate(schemaCreateProduct), ProductController.createProduct);

router.get('/:id', authMiddleware, ProductController.getProductById);

router.delete('/:id', authMiddleware, ProductController.deleteProductById);

export default router;