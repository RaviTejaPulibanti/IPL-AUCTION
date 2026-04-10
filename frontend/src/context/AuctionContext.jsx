import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const AuctionContext = createContext();

export const useAuction = () => useContext(AuctionContext);

export const AuctionProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      newSocket.emit('join_auction');

      newSocket.on('auction_started', (player) => {
        setCurrentPlayer(player);
        setBidHistory([]);
      });

      newSocket.on('bid_update', ({ player, teamName }) => {
        setCurrentPlayer(player);
        setBidHistory((prev) => [{ teamName, bidAmount: player.currentBid }, ...prev]);
      });

      newSocket.on('auction_ended', ({ player, team }) => {
        setCurrentPlayer(null);
        // Optionally show toast or notification
      });

      newSocket.on('error', (err) => {
        setError(err.message);
        setTimeout(() => setError(null), 3000);
      });

      return () => newSocket.close();
    }
  }, [user]);

  const placeBid = (playerId, bidAmount) => {
    if (socket && user) {
      socket.emit('place_bid', {
        playerId,
        teamId: user._id,
        bidAmount,
      });
    }
  };

  const startAuction = (playerId) => {
      if (socket && user?.isAdmin) {
          socket.emit('start_auction', playerId);
      }
  };

  const endAuction = (playerId) => {
      if (socket && user?.isAdmin) {
          socket.emit('end_auction', playerId);
      }
  };

  return (
    <AuctionContext.Provider value={{ 
        currentPlayer, 
        bidHistory, 
        error, 
        placeBid, 
        startAuction, 
        endAuction 
    }}>
      {children}
    </AuctionContext.Provider>
  );
};
