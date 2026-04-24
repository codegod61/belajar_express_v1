import Joi from "joi";
import AppError from "../utils/errorHandling.js";

export const validate = (schema) => async (req, res, next) => {
  try {
    const value = await schema.validateAsync(req.body, {
      abortEarly: false, // biar semua error keluar
      stripUnknown: true // buang field yang ga dikenal
    });

    req.validatedBody = value;
    next();
  } catch (err) {
    if (err.isJoi) {
      const formattedErrors = err.details.map(e => ({
        field: e.path[0],
        message: e.message
      }));

      return next(new AppError('Validation Failed', 400, formattedErrors));
    }

    next(err);
  }
};