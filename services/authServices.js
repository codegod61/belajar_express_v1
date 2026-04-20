import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/dbConfig.js';
import { generateId } from '../utils/ulid.js';

async function getUserByEmail(email) {
    const data = await pool.query(`SELECT * FROM users where email = $1 LIMIT 1`, [email]);
    
    if(data.rows.length === 0) {
        return null;
    }

    return data.rows[0];
}

// sedang percobaan karena di data.json belum menggunakan password
export async function loginUser({email, password}) {

    const user = await getUserByEmail(email);
    if(!user) {
        const err = new Error('Invalid email or password');
        err.status = 404;
        throw err;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        const err = new Error('Invalid email or password');
        err.status = 404;
        throw err;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: '1h'}
    );

    return {
        user: { email: user.email },
        token
    }
}

export async function registerUser(newUser) {

    const id = generateId();
    const saltRound = 12;
    const existingUser = await getUserByEmail(newUser.email);
    if(existingUser) {
        const err = new Error('User already exists');
        err.status = 409;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(newUser.password, saltRound);

    await pool.query(
        `INSERT INTO users (id, name, email, password) 
        VALUES ($1, $2, $3, $4)`,
        [id, newUser.name, newUser.email, hashedPassword]
    );

    return;
}