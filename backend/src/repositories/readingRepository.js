const db = require('../config/db');

class ReadingRepository {

    async findByUserAndDate(userId, date) {
        const query = `
      SELECT id, user_id, reading_date::text AS date, slot, glucose_value AS value, created_at, updated_at
      FROM readings
      WHERE user_id = $1 AND reading_date = $2
      ORDER BY 
        CASE slot
          WHEN 'Morning (fasting)' THEN 1
          WHEN 'After breakfast' THEN 2
          WHEN 'After lunch' THEN 3
          WHEN 'After dinner' THEN 4
        END ASC
    `;
        const result = await db.query(query, [userId, date]);
        return result.rows;
    }

    async findByUserAndDateRange(userId, startDate, endDate) {
        const query = `
      SELECT id, user_id, reading_date::text AS date, slot, glucose_value AS value, created_at
      FROM readings
      WHERE user_id = $1 AND reading_date >= $2 AND reading_date <= $3
      ORDER BY reading_date ASC, 
        CASE slot
          WHEN 'Morning (fasting)' THEN 1
          WHEN 'After breakfast' THEN 2
          WHEN 'After lunch' THEN 3
          WHEN 'After dinner' THEN 4
        END ASC
    `;
        const result = await db.query(query, [userId, startDate, endDate]);
        return result.rows;
    }
    async findByUserAndDateRangePaginated(userId, startDate, endDate, limit, offset) {
        const query = `
    SELECT id, user_id, reading_date::text AS date, slot, glucose_value AS value, created_at
    FROM readings
    WHERE user_id = $1 AND reading_date >= $2 AND reading_date <= $3
    ORDER BY reading_date ASC,
      CASE slot
        WHEN 'Morning (fasting)' THEN 1
        WHEN 'After breakfast' THEN 2
        WHEN 'After lunch' THEN 3
        WHEN 'After dinner' THEN 4
      END ASC
    LIMIT $4 OFFSET $5
  `;
        const result = await db.query(query, [userId, startDate, endDate, limit, offset]);
        return result.rows;
    }
    async countByUserAndDateRange(userId, startDate, endDate) {
        const query = `
    SELECT COUNT(*)::int AS count
    FROM readings
    WHERE user_id = $1 AND reading_date >= $2 AND reading_date <= $3
  `;
        const result = await db.query(query, [userId, startDate, endDate]);
        return result.rows[0].count;
    }


    async findByUserDateAndSlot(userId, date, slot) {
        const query = `
      SELECT id, user_id, reading_date::text AS date, slot, glucose_value AS value
      FROM readings
      WHERE user_id = $1 AND reading_date = $2 AND slot = $3
    `;
        const result = await db.query(query, [userId, date, slot]);
        return result.rows[0] || null;
    }


    async countByDate(userId, date) {
        const query = `
      SELECT COUNT(*)::int AS count
      FROM readings
      WHERE user_id = $1 AND reading_date = $2
    `;
        const result = await db.query(query, [userId, date]);
        return result.rows[0].count;
    }


    async findById(id, userId) {
        const query = `
      SELECT id, user_id, reading_date::text AS date, slot, glucose_value AS value
      FROM readings
      WHERE id = $1 AND user_id = $2
    `;
        const result = await db.query(query, [id, userId]);
        return result.rows[0] || null;
    }


    async create({ userId, date, slot, value }) {
        const query = `
      INSERT INTO readings (user_id, reading_date, slot, glucose_value)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, reading_date::text AS date, slot, glucose_value AS value, created_at, updated_at
    `;
        const result = await db.query(query, [userId, date, slot, value]);
        return result.rows[0];
    }


    async update(id, userId, { date, slot, value }) {
        const query = `
      UPDATE readings
      SET reading_date = $1, slot = $2, glucose_value = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND user_id = $5
      RETURNING id, user_id, reading_date::text AS date, slot, glucose_value AS value, updated_at
    `;
        const result = await db.query(query, [date, slot, value, id, userId]);
        return result.rows[0];
    }


    async delete(id, userId) {
        const query = `
      DELETE FROM readings
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;
        const result = await db.query(query, [id, userId]);
        return result.rows[0] || null;
    }
}

module.exports = new ReadingRepository();