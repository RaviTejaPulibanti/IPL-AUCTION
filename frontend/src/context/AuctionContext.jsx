import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const AuctionContext = createContext();

export const useAuction = () => useContext(AuctionContext);

export const AuctionProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && !socket) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

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
      });

      newSocket.on('new_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      newSocket.on('error', (err) => {
        setError(err.message);
        setTimeout(() => setError(null), 3000);
      });

      return () => {
          newSocket.close();
          setSocket(null);
      };
    }
  }, [user]);

  const joinRoom = (code) => {
    if (socket) {
      socket.emit('join_auction', code);
      setRoomCode(code);
      console.log('Joined room:', code);
    }
  };

  const sendMessage = (message) => {
    if (socket && roomCode && user) {
        socket.emit('send_message', {
            roomCode,
            message,
            sender: user.name
        });
    }
  };

  const placeBid = (playerId, bidAmount) => {
    if (socket && user && roomCode) {
      socket.emit('place_bid', {
        roomCode,
        playerId,
        teamId: user._id,
        bidAmount,
      });
    }
  };

  const startAuction = (playerId) => {
      if (socket && user?.isAdmin && roomCode) {
          socket.emit('start_auction', { roomCode, playerId });
      }
  };

  const endAuction = (playerId) => {
      if (socket && user?.isAdmin && roomCode) {
          socket.emit('end_auction', { roomCode, playerId });
      }
  };

  return (
    <AuctionContext.Provider value={{ 
        currentPlayer, 
        bidHistory, 
        messages,
        error, 
        joinRoom,
        sendMessage,
        placeBid, 
        startAuction, 
        endAuction 
    }}>
      {children}
    </AuctionContext.Provider>
  );
};
