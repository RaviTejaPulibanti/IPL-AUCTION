import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, LogIn, Trophy, Users, Settings } from 'lucide-react';

const Lobby = () => {
    const [roomName, setRoomName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/api/rooms', { name: roomName });
            navigate(`/auction/${data.roomCode}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create room');
        }
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/api/rooms/join', { roomCode });
            navigate(`/auction/${data.roomCode}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join room');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <header className="text-center mb-16">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block bg-yellow-500/10 p-4 rounded-3xl border border-yellow-500/20 mb-6"
                >
                    <Trophy className="w-16 h-16 text-yellow-500" />
                </motion.div>
                <h1 className="text-5xl font-black text-white mb-4">Auction Lobby</h1>
                <p className="text-slate-400 text-lg">Create a private room for your friends or join an existing auction.</p>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl mb-8 text-center font-bold">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Room */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6"
                >
                    <div className="flex items-center space-x-3 text-yellow-500">
                        <Plus className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">Create Room</h2>
                    </div>
                    <form onSubmit={handleCreateRoom} className="space-y-4">
                        <div>
                            <label className="block text-slate-500 text-sm font-bold uppercase mb-2">Room Name</label>
                            <input
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-yellow-500/50 outline-none"
                                placeholder="E.g. Weekend Mega Auction"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black py-4 rounded-xl shadow-lg transition-all"
                        >
                            CREATE & START
                        </button>
                    </form>
                </motion.div>

                {/* Join Room */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6"
                >
                    <div className="flex items-center space-x-3 text-blue-500">
                        <LogIn className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">Join Room</h2>
                    </div>
                    <form onSubmit={handleJoinRoom} className="space-y-4">
                        <div>
                            <label className="block text-slate-500 text-sm font-bold uppercase mb-2">Room Code</label>
                            <input
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none uppercase"
                                placeholder="Enter 6-digit code"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg transition-all"
                        >
                            JOIN AUCTION
                        </button>
                    </form>
                </motion.div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 text-slate-500 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                    <Users className="w-5 h-5" />
                    <span className="text-sm font-medium">Up to 10 Teams</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-500 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Custom Budgets</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-500 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                    <Trophy className="w-5 h-5" />
                    <span className="text-sm font-medium">Live Leaderboard</span>
                </div>
            </div>
        </div>
    );
};

export default Lobby;
