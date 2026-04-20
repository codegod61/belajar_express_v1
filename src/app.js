import 'dotenv/config';

import express from 'express';
const app = express();

import usersRoute from '../routes/userRoutes.js';
import productRoute from '../routes/productRoutes.js';
import authRoute from '../routes/authRoutes.js';

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.use('/v1/auth', authRoute);
app.use('/users', usersRoute);
app.use('/products', productRoute);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  })
})

app.listen(process.env.PORT, () => {
    console.log(`app listening on port ${process.env.PORT}`);
})