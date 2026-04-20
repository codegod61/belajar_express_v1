import { loginUser, registerUser } from "../services/authServices.js";


export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // cek body kosong
        if(!email && !password) {
            const err = new Error('Data tidak boleh kosong, pastikan email dan password diisi');
            err.status = 400;
            throw err;
        }

        if(!email || !password) {
            const err = new Error('Email & Password wajib diisi');
            err.status = 400;
            throw err;
        }

        if (typeof email !== 'string' || email.trim() === '' || !email.includes('@')) {
            const err = new Error('Email tidak valid');
            err.status = 400;
            throw err;
        }

        if (typeof password !== 'string' || password.trim() === '') {
            const err = new Error('Password tidak valid');
            err.status = 400;
            throw err;
        }

        const result = await loginUser({ email, password });

        return res.status(200).json({
            message: "Berhasil Login",
            data: result
        })
    } catch (err) {
        next(err);
    }
}

export const register = async (req, res, next) => {
    try {
        const { email, name, password } = req.body;

        // cek body kosong
        if(!email && !name && !password) {
            const err = new Error('Data tidak boleh kosong, pastikan email, name, dan password diisi');
            err.status = 400;
            throw err;
        }

        if(!email || !name || !password) {
            const err = new Error('Email, name, dan Password wajib diisi');
            err.status = 400;
            throw err;
        }

        if (typeof email !== 'string' || email.trim() === '' || !email.includes('@')) {
            const err = new Error('Email tidak valid');
            err.status = 400;
            throw err;
        }

        if (typeof name !== 'string' || name.trim() === '') {
            const err = new Error('name tidak valid');
            err.status = 400;
            throw err;
        }

        if (typeof password !== 'string' || password.trim() === '') {
            const err = new Error('Password tidak valid');
            err.status = 400;
            throw err;
        }

        await registerUser({ name, email, password });

        return res.status(201).json({
            message: "Create user successfully",
            data: {
                name,
                email
            }
        })
    } catch (err) {
        next(err);
    }
}