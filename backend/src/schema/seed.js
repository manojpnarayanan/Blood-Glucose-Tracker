const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seed() {
    try {
        console.log('Seeding database...');

        const email = 'demo@example.com';
        const password = 'Password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const userRes = await db.query(
            `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name
       RETURNING id, name, email`,
            ['Demo Patient', email, hashedPassword]
        );

        const userId = userRes.rows[0].id;
        console.log(`Demo user ready: ${email} (password: ${password})`);

        await db.query(`DELETE FROM readings WHERE user_id = $1`, [userId]);

        const formatDate = (d) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const today = new Date();
        const readings = [];

        for (let i = 0; i < 14; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = formatDate(d);

            readings.push(
                { date: dateStr, slot: 'Morning (fasting)', value: Math.floor(Math.random() * 30) + 90 },
                { date: dateStr, slot: 'After breakfast', value: Math.floor(Math.random() * 40) + 120 },
                { date: dateStr, slot: 'After lunch', value: Math.floor(Math.random() * 50) + 130 },
                { date: dateStr, slot: 'After dinner', value: Math.floor(Math.random() * 40) + 115 }
            );
        }

        for (const r of readings) {
            await db.query(
                `INSERT INTO readings (user_id, reading_date, slot, glucose_value)
         VALUES ($1, $2, $3, $4)`,
                [userId, r.date, r.slot, r.value]
            );
        }

        console.log(`Successfully seeded ${readings.length} readings for Demo Patient!`);
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();