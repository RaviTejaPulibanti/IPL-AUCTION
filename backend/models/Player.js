import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'],
  },
  basePrice: {
    type: Number,
    required: true,
  },
  currentBid: {
    type: Number,
    default: 0,
  },
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null,
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Unsold', 'Under Hammer'],
    default: 'Available',
  },
  image: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);
export default Player;
