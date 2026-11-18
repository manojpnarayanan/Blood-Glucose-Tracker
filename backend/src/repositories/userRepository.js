const db = require('../config/db');

class UserRepository {
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
    const result = await db.query(query, [email.trim()]);
    return result.rows[0] || null;
  }

  async findById(id) {
    const query = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async create({ name, email, passwordHash }) {
    const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, LOWER($2), $3)
      RETURNING id, name, email, created_at
    `;
    const result = await db.query(query, [name.trim(), email.trim(), passwordHash]);
    return result.rows[0];
  }
}

module.exports = new UserRepository();