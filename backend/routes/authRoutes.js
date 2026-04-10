import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Team from '../models/Team.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new team
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, owner, username, password, isAdmin } = req.body;

  try {
    const teamExists = await Team.findOne({ username });

    if (teamExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const team = await Team.create({
      name,
      owner,
      username,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    if (team) {
      res.status(201).json({
        _id: team._id,
        name: team.name,
        username: team.username,
        isAdmin: team.isAdmin,
        token: generateToken(team._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid team data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Authenticate a team & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const team = await Team.findOne({ username });

    if (team && (await bcrypt.compare(password, team.password))) {
      res.json({
        _id: team._id,
        name: team.name,
        username: team.username,
        isAdmin: team.isAdmin,
        token: generateToken(team._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

export default router;
