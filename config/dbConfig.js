import { Pool } from "pg";

let pool;

console.log('Current NODE_ENV:', process.env.NODE_ENV);

if (process.env.NODE_ENV == 'development') {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME_DEV,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
} else if (process.env.NODE_ENV == 'test'){
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME_TEST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
} else {
  // production / railway
  pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
  });
}

export default pool;