const authService = require('../services/authService');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: parseInt(process.env.COOKIE_MAX_AGE, 10)
};

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });

      res.cookie('sweety_token', result.token, COOKIE_OPTIONS);
      res.status(201).json({ user: result.user });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      res.cookie('sweety_token', result.token, COOKIE_OPTIONS);
      res.status(200).json({ user: result.user });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res) {
    res.clearCookie('sweety_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: 'Logged out successfully.' });
  }

  async getMe(req, res) {
    res.status(200).json({ user: req.user });
  }
}

module.exports = new AuthController();