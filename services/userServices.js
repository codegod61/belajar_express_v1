import fs from 'fs/promises';
import pool from '../config/dbConfig.js';

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
        const err = new Error('Invalid page number');
        err.status = 400;
        throw err;
    }

    if(limit < 1) {
        const err = new Error('Limit must be greater than 0');
        err.status = 400;
        throw err;
    }

    return {
        result: dataQuery.rows,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
    };
}

export async function filterUser({ queryEmail, queryUsername, queryPage, queryLimit }) {
    const data = await getUsers();

    if(data.length === 0) {
        const err = new Error('Data is empty');
        err.status = 404;
        throw err;
    }

    const filterData = data.map((item) => ({
        id: item.id,
        email: item.email,
        username: item.username
    }));


    let page = parseInt(queryPage) || 1;
    let limit = parseInt(queryLimit) || 10;
    const searchEmail = queryEmail || "";
    const searchName = queryUsername || "";

    // sebagai startIndex
    const skip = (page - 1) * limit;

    const filteredData = filterData.filter((item) => {
        const filterEmail = item.email.toLowerCase().includes(searchEmail.toLowerCase());
        const filterName = item.username.toLowerCase().includes(searchName.toLowerCase());

        if (searchEmail && !filterEmail) {
            return false;
        }

        if (searchName && !filterName) {
            return false
        }

        return true
    });

    const total = filteredData.length;

    const result = filteredData.slice(skip, skip + limit);

    if(page > Math.ceil(total / limit)) {
        const err = new Error('Page Not Found');
        err.status = 404;
        throw err;
    }
    
    return { result, page, total, totalPages: Math.ceil(total / limit) };
}

// export async function filterUser({ nama, alamat }) {
//     const data = await getUsers();

//     // dibawah ini untuk filter data
//     const name = nama || '';
//     const address = alamat || '';

//     let resultQuery = data.filter((item) => {
//         const matchName = item.nama.toLowerCase().includes(name.toLowerCase());
//         const matchAddress = item.alamat.toLowerCase().includes(address.toLowerCase());
//         // jika name diisi DAN matchName kosong, maka return false
//         if (name && !matchName) {
//             return false;
//         } else if (address && !matchAddress) {
//             return false;
//         } else {
//             return true
//         }

//     });

//     // Jika data.length sama dengan 0 / string kosong / [] saja, maka lakukan aksi dibawah
//     if (data.length === 0) {
//         const err = new Error('Data is Empty');
//         err.status = 404;
//         throw err;
//     }


//     return { resultQuery };
// }

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
        const err = new Error('Data Not Found');
        err.status = 404;
        throw err;
    }

    return data.rows[0];
}

export async function deleteUserById(id) {
    const data = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);

    if (data.rows.length === 0) {
        const err = new Error('Data Not Found');
        err.status = 404;
        throw err;
    }

    return data.rows[0];
}

