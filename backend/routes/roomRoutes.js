import express from 'express';
import Room from '../models/Room.js';
import { protect } from '../middleware/authMiddleware.js';
import crypto from 'crypto';

const router = express.Router();

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, settings } = req.body;

  try {
    const roomCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    const room = new Room({
      roomCode,
      name,
      admin: req.user._id,
      teams: [req.user._id], // Creator joins as first team
      settings: settings || {}
    });

    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Join a room by code
// @route   POST /api/rooms/join
// @access  Private
router.post('/join', protect, async (req, res) => {
  const { roomCode } = req.body;

  try {
    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.teams.includes(req.user._id)) {
      return res.json(room); // Already in
    }

    if (room.status !== 'Waiting') {
        return res.status(400).json({ message: 'Auction already started or finished' });
    }

    room.teams.push(req.user._id);
    await room.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get room details
// @route   GET /api/rooms/:code
// @access  Private
router.get('/:code', protect, async (req, res) => {
  try {
    const room = await Room.findOne({ roomCode: req.params.code })
      .populate('teams', 'name owner budget')
      .populate('players');
    
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
