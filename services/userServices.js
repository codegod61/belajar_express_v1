import fs from 'fs/promises';
import pool from '../config/dbConfig.js';
import AppError from '../utils/errorHandling.js';

export async function getUsers({ page = 1, limit = 10, searchName, searchEmail }) {
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM users WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) FROM users WHERE 1=1`;

    const values = [];
    let index = 1;


    if(searchName) {
        query += ` AND name ILIKE $${index}`;
        countQuery += ` AND name ILIKE $${index}`;
        values.push(`${searchName}%`);
        index++
    }

    if(searchEmail) {
        query += ` AND email ILIKE $${index}`;
        countQuery += ` AND email ILIKE $${index}`;
        values.push(`${searchEmail}%`);
        index++
    }

    query += ` LIMIT $${index} OFFSET $${index + 1}`;
    values.push(limit, offset);

    const dataQuery = await pool.query(query, values);
    const countResult = await pool.query(
        countQuery,
        values.slice(0, index - 1) // tanpa limit & offset
    );

    const total = parseInt(countResult.rows[0].count);

    if(page < 1 || page > Math.ceil(total / limit)) {
        throw new AppError('Page Not Found', 404, []);
    }

    if(limit < 1) {
        throw new AppError('Limit must be greater than 0', 400, []);
    }

    return {
        result: dataQuery.rows,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
    };
}

export async function createUser(newUser) {
    const data = await getUsers();
    const newId = data.length === 0 ? 1 : Math.max(...data.map((item) => item.id)) + 1
    data.push({ id: newId, ...newUser });

    await fs.writeFile('data/users.json', JSON.stringify(data, null, 2));

    return { ...newUser };
}

export async function getUserById(id) {
    const data = await pool.query(`SELECT * FROM users where id = $1`, [id]);

    if (data.rows.length === 0) {
        throw new AppError('Data Not Found', 404, []);
    }

    return data.rows[0];
}

export async function deleteUserById(id) {
    const data = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);

    if (data.rows.length === 0) {
        throw new AppError('Data Not Found', 404, []);
    }

    return data.rows[0];
}

