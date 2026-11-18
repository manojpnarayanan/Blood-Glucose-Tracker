const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
  async register({ name, email, password }) {
    if (!name || !name.trim()) {
      throw new Error('Name is required.');
    }
    if (!email || !email.trim()) {
      throw new Error('Email is required.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await userRepository.create({ name, email, passwordHash });
    const token = this.generateToken(user);

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = this.generateToken(user);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'sweety_jwt_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }
}

module.exports = new AuthService();