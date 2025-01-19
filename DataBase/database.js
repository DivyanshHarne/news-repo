require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'wordpass4',
    database: process.env.DB_DATABASE || 'frontpage_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0 
});

const initializeDatabase = async () => {
    const connection = await pool.promise().getConnection();
    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\`;`);
        console.log(`Database '${process.env.DB_DATABASE}' ensured.`);
        await connection.query(`USE \`${process.env.DB_DATABASE}\`;`);
        const [tables] = await connection.query("SHOW TABLES LIKE 'hacker_news';");
        if (tables.length > 0)await connection.query("TRUNCATE TABLE hacker_news;");
        else {
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS hacker_news (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255),
                    url VARCHAR(255),
                    author VARCHAR(100),
                    points VARCHAR(50),
                    comments VARCHAR(50),
                    description TEXT,
                    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE KEY unique_url (url),
                    published_stories_count INT
                );
            `;
            await connection.query(createTableQuery);
            console.log('Table `hacker_news` ensured.');
        }
    } catch (err) {
        console.error('Error initializing database:', err.message);
    } finally {
        connection.release(); 
    }
};


initializeDatabase();

module.exports = pool;
