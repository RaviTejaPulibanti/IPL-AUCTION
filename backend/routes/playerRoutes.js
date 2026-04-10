import express from 'express';
import Player from '../models/Player.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all players
// @route   GET /api/players
// @access  Public
router.get('/', async (req, res) => {
  try {
    const players = await Player.find({}).populate('soldTo', 'name');
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get a single player
// @route   GET /api/players/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('soldTo', 'name');
    if (player) {
      res.json(player);
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a player
// @route   POST /api/players
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { name, category, basePrice, image } = req.body;

  try {
    const player = new Player({
      name,
      category,
      basePrice,
      currentBid: 0,
      image: image || '',
      status: 'Available',
    });

    const createdPlayer = await player.save();
    res.status(201).json(createdPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a player
// @route   PUT /api/players/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { name, category, basePrice, image, status, currentBid, soldTo } = req.body;

  try {
    const player = await Player.findById(req.params.id);

    if (player) {
      player.name = name || player.name;
      player.category = category || player.category;
      player.basePrice = basePrice || player.basePrice;
      player.image = image || player.image;
      player.status = status || player.status;
      player.currentBid = currentBid !== undefined ? currentBid : player.currentBid;
      player.soldTo = soldTo !== undefined ? soldTo : player.soldTo;

      const updatedPlayer = await player.save();
      res.json(updatedPlayer);
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a player
// @route   DELETE /api/players/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (player) {
      await player.deleteOne();
      res.json({ message: 'Player removed' });
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
