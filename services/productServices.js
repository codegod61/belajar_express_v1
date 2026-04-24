import fs from 'fs/promises';
import pool from '../config/dbConfig.js';
import { generateId } from '../utils/ulid.js';
import AppError from '../utils/errorHandling.js';

export async function getDataProducts({ page = 1, limit = 10, prodName, priceStart = 0, priceEnd = 99999999, prodDesc }) {
    if(priceStart < 0 || priceEnd < 0) {
        throw new AppError('Price must be greater than or equal to 0', 400, []);
    }
    
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM products WHERE 1=1`;
    let queryCount = `SELECT COUNT(*) FROM products WHERE 1=1`;
    let index = 1;
    let values = [];

    if(prodName) {
        query += ` AND name ilike $${index}`;
        queryCount += ` AND name ilike $${index}`;
        values.push(`${prodName.toLowerCase()}%`);
        index++;
    };

    if(priceStart) {
        query += ` AND price >= $${index}`;
        queryCount += ` AND price >= $${index}`;
        values.push(parseInt(priceStart));
        index++;
    };

    if(priceEnd) {
        query += ` AND price <= $${index}`;
        queryCount += ` AND price <= $${index}`;
        values.push(parseInt(priceEnd));
        index++;
    }


    if(prodDesc) {
        query += ` AND description ilike $${index}`;
        queryCount += ` AND description ilike $${index}`;
        values.push(`${prodDesc.toLowerCase()}%`);
        index++;
    };


    query += ` ORDER BY id LIMIT $${index} OFFSET $${index + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    const countQuery = await pool.query(queryCount, values.slice(0, index - 1));

    const total = parseInt(countQuery.rows[0].count);

    if(page < 1 || page > Math.ceil(total / limit)) {
        throw new AppError('Page Not Found', 404, []);
    }

    if(limit < 1) {
        throw new AppError('Limit must be greater than 0', 400, []);
    }

    return {
        data: result.rows,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
    };
}

export async function createDataProduct(newProduct) {
    const id = generateId();

    const result = await pool.query(
        `INSERT INTO products (id, name, price, description) VALUES ($1, $2, $3, $4)`,
        [id, newProduct.name, newProduct.price, newProduct.description ]
    );
    
    if(result.rowCount === 0) {
        throw new AppError('Failed to create data', 500, []);
    }

    return;
}

export async function getProductDataById(id) {
    const data = await pool.query(`SELECT * FROM products WHERE id = $1`, [id]);

    const item = data.rows[0];

    if(!item) {
        throw new AppError('Data Not Found', 404, []);
    }

    return item;
}

export async function deleteProductDataById(id) {
    const data = await pool.query(`DELETE FROM products WHERE id = $1 RETURNING *`, [id]);

    const item = data.rows[0];

    if(!item) {
        throw new AppError('Data Not Found', 404, []);
    }

    return item;
}