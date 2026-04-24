import { schemaRegisterUser } from "../validations/joiValidation.js";
import { loginUser, registerUser } from "../services/authServices.js";

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.validatedBody;
        req.log.info({ email }, 'Login request');

        const result = await loginUser({ email, password });

        req.log.info({
            userId: result.user.id,
            email
        }, 'User Login Success');

        return res.status(200).json({
            message: "Berhasil Login",
            data: result
        })
    } catch (err) {
        if (err.message === 'Invalid email or password') {
            req.log.warn({ email: req.validatedBody.email }, 'Invalid login attempt');
        }

        req.log.error(err, 'Login failed');
        next(err);
    }
}

export const register = async (req, res, next) => {
    try {
        const { email, name, password } = req.validatedBody;
        req.log.info({ email }, 'register request');

        const result = await registerUser({ name, email, password });

        req.log.info({
            userId: result.id,
            email
        }, 'User register Success');

        return res.status(201).json({
            message: "Create user successfully",
            data: {
                name,
                email
            }
        })
    } catch (err) {
        if (err.message === 'User already exists') {
            req.log.warn({ email: req.validatedBody.email }, 'Invalid register ');
        }

        req.log.error(err, 'register failed');
        next(err);
    }
}