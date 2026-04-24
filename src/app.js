import 'dotenv/config';

import express from 'express';
const app = express();

import usersRoute from '../routes/userRoutes.js';
import productRoute from '../routes/productRoutes.js';
import authRoute from '../routes/authRoutes.js';
import { logger } from '../utils/logger.js';
import { pinoHttp } from 'pino-http';

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(pinoHttp({ logger, autoLogging: process.env.NODE_ENV !== 'test' }));

app.use('/v1/auth', authRoute); 
app.use('/users', usersRoute);
app.use('/products', productRoute);

app.use((err, req, res, next) => {
  req.log.error(err);

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message,
    errors: err.errors || []
  })
})

export default app;