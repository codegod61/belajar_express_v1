import express from 'express';
import * as ProductController from '../controllers/productControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { logMethod, logOriginalUrl } from '../utils/logger.js';


const router = express.Router();

const logStuff = [logOriginalUrl, logMethod, authMiddleware];

router.get('/', logStuff, ProductController.getProducts);

router.get('/filter', logStuff, ProductController.filterProductsData);

router.post('/', logStuff, ProductController.createProduct);

router.get('/:id', logStuff, ProductController.getProductById);

router.delete('/:id', logStuff, ProductController.deleteProductById);

export default router;