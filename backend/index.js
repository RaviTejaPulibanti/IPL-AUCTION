import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import connectDB from './db.js';
import authRoutes from './routes/authRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import Player from './models/Player.js';
import Team from './models/Team.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);

// Socket.io logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_auction', () => {
    socket.join('auction_room');
    console.log(`User joined auction room: ${socket.id}`);
  });

  socket.on('place_bid', async (data) => {
    const { playerId, teamId, bidAmount } = data;

    try {
      const player = await Player.findById(playerId);
      const team = await Team.findById(teamId);

      if (!player || !team) return;

      if (bidAmount > team.budget) {
        socket.emit('error', { message: 'Insufficient budget' });
        return;
      }

      if (bidAmount <= player.currentBid && player.currentBid !== 0) {
        socket.emit('error', { message: 'Bid must be higher than current bid' });
        return;
      }
      
      if (bidAmount < player.basePrice && player.currentBid === 0) {
        socket.emit('error', { message: 'Bid must be at least base price' });
        return;
      }

      player.currentBid = bidAmount;
      player.soldTo = teamId;
      player.status = 'Under Hammer';
      await player.save();

      io.to('auction_room').emit('bid_update', {
        player,
        teamName: team.name,
      });
    } catch (error) {
      console.error('Bid error:', error);
    }
  });

  socket.on('start_auction', async (playerId) => {
      try {
          const player = await Player.findById(playerId);
          if (player) {
              player.status = 'Under Hammer';
              await player.save();
              io.to('auction_room').emit('auction_started', player);
          }
      } catch (err) {
          console.error(err);
      }
  });

  socket.on('end_auction', async (playerId) => {
      try {
          const player = await Player.findById(playerId);
          if (player && player.soldTo) {
              player.status = 'Sold';
              await player.save();
              
              // Deduct budget from team
              const team = await Team.findById(player.soldTo);
              team.budget -= player.currentBid;
              team.players.push(player._id);
              await team.save();

              io.to('auction_room').emit('auction_ended', { player, team });
          } else if (player) {
              player.status = 'Unsold';
              await player.save();
              io.to('auction_room').emit('auction_ended', { player, team: null });
          }
      } catch (err) {
          console.error(err);
      }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('IPL Auction API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
