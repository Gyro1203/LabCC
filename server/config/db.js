import mysql from 'mysql2/promise';
import { HOST, DB_USERNAME, PASSWORD, DATABASE } from './configEnv.js';

const db = mysql.createPool({
    host: `${HOST}`,
    user: `${DB_USERNAME}`,
    password: `${PASSWORD}`,
    database: `${DATABASE}`,
    port: 3306,
    waitForConnections: true
});

export default db;