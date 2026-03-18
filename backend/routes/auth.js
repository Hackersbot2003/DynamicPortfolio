import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/seed', async (req, res) => {
  try {
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) return res.json({ message: 'Admin already exists', email: existing.email });
    const user = await User.create({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
    res.json({ message: 'Admin created!', email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
