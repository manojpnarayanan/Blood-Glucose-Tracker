const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function initializeDatabase() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running database schema migration...');
        await db.query(schemaSql);
        console.log('Database initialized successfully: tables created!');
        process.exit(0);
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
        process.exit(1);
    }
}

initializeDatabase();