import fs from 'fs/promises';
import pool from '../config/dbConfig.js';
import { generateId } from '../utils/ulid.js';

export async function getDataProducts({ page = 1, limit = 10, prodName, priceStart = 0, priceEnd = 99999999, prodDesc }) {
    if(priceStart < 0 || priceEnd < 0) {
        const err = new Error('Price cannot be negative');
        err.status = 400;
        throw err;
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
        data: result.rows,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
    };
}

export async function filterDataProducts({ prodName, prodPrice, prodDesc, queryPage, queryLimit}) {
        const data = await getDataProducts();

        if(data.length === 0) {
            const err = new Error('Data is empty');
            err.status = 404;
            throw err;
        }

        let queryProdName = prodName || "";
        let queryProdPrice = prodPrice;
        let queryProdDesc = prodDesc || "";
        let page = parseInt(queryPage) || 1;
        let limit = parseInt(queryLimit) || 10;
        const startIndex = (page - 1) * limit;

        const filteredData = data.filter((item) => {
            const searchProdName = item.name.toLowerCase().includes(queryProdName.toLowerCase());
            const searchProdPrice = queryProdPrice ? item.price.toString().includes(queryProdPrice.toString()) : true;
            const searchProdDesc = item.description.toLowerCase().includes(queryProdDesc.toLowerCase());

            if(queryProdName && !searchProdName) {
                return false;
            }

            if(queryProdPrice && !searchProdPrice) {
                return false;
            }

            if(queryProdDesc && !searchProdDesc) {
                return false;
            }

            return true;
        })

        const total = filteredData.length;

        const filter = filteredData.slice(startIndex, startIndex + limit);
        
        if(page > Math.ceil(total / limit)) {
            const err = new Error('Page Not Found');
            err.status = 404;
            throw err;
        }

        return { filter, total, page, totalPages: Math.ceil(total / limit) }
}

// export async function filterDataProducts({ name, price, description }) {
//     const data = await getDataProducts();
//     let message;
//     let result;
//     let queryName = name || '';
//     let queryPrice = price || '';
//     let queryDesc = description || '';

//     if(data.length === 0) {
//         const err = new Error('Data is Empty');
//         err.status = 404;
//         throw err;
//     }

//     const resultQuery = data.filter((item) => {
//         const matchName = item.name.toLowerCase().includes(queryName.toLowerCase());
//         const matchPrice = item.price.toString().includes(queryPrice.toString());
//         const matchDesc = item.description.toLowerCase().includes(queryDesc.toLowerCase());

//         if(queryName && !matchName) {
//             return false;
//         } else if (queryPrice && !matchPrice) {
//             return false;
//         } else if (queryDesc && !matchDesc) {
//             return false
//         } else {
//             return true;
//         }
//     });

//     if(queryName && queryPrice && queryDesc) {
//         message = 'Data found with name, price and description';
//         result = resultQuery;
//     } else if (queryName && queryPrice) {
//         message = 'Data found with name and price';
//         result = resultQuery;
//     } else if (queryName && queryDesc) {
//         message = 'Data found with name and description';
//         result = resultQuery;
//     } else if (queryPrice && queryDesc) {
//         message = 'Data found with price and description';
//         result = resultQuery;
//     } else if (queryName) {
//         message = 'Data found with name';
//         result = resultQuery;
//     } else if (queryPrice) {
//         message = 'Data found with price';
//         result = resultQuery;
//     } else if (queryDesc) {
//         message = 'Data found with description';
//         result = resultQuery;
//     } else {
//         message = 'No query provided, showing all data';
//         result = data;
//     }

//     return { message, data: result };
// }

export async function createDataProduct(newProduct) {
    const id = generateId();

    const result = await pool.query(
        `INSERT INTO products (id, name, price, description) VALUES ($1, $2, $3, $4)`,
        [id, newProduct.name, newProduct.price, newProduct.description ]
    );
    
    if(result.rowCount === 0) {
        const err = new Error('Failed to create data');
        err.status = 500;
        throw err;
    }

    return;
}

export async function getProductDataById(id) {
    const data = await getDataProducts();

    const item = data.find((item) => item.id === id);

    if(!item) {
        const err = new Error('Data Not Found');
        err.status = 404;
        throw err;
    }

    return item;
}

export async function deleteProductDataById(id) {
    const data = await getDataProducts();

    const item = data.find((item) => item.id === id);

    if(!item) {
        const err = new Error('Data Not Found');
        err.status = 404;
        throw err;
    }

    const newData = data.filter((item) => item.id !== id);

    await fs.writeFile('data/products.json', JSON.stringify(newData, null, 2));

    return item;
}