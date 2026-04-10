import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team', // Using Team as user for now
    required: true,
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  }],
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  }],
  status: {
    type: String,
    enum: ['Waiting', 'Active', 'Finished'],
    default: 'Waiting',
  },
  settings: {
    budgetPerTeam: { type: Number, default: 1000000000 }, // 100 Cr
    maxPlayersPerTeam: { type: Number, default: 15 },
    bidIncrement: { type: Number, default: 5000000 }, // 50L
  },
  chatHistory: [{
    sender: { type: String },
    message: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;
