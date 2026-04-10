import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuction } from '../context/AuctionContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Gavel, Users, DollarSign, Award } from 'lucide-react';

const AdminDashboard = () => {
    const [players, setPlayers] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Batsman',
        basePrice: '',
        image: ''
    });
    const { startAuction, endAuction, currentPlayer } = useAuction();

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/players');
            setPlayers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddPlayer = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/players', formData);
            setFormData({ name: '', category: 'Batsman', basePrice: '', image: '' });
            setShowAddForm(false);
            fetchPlayers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePlayer = async (id) => {
        if (window.confirm('Are you sure you want to delete this player?')) {
            try {
                await axios.delete(`http://localhost:5000/api/players/${id}`);
                fetchPlayers();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-slate-950 px-4 py-2 rounded-lg font-bold transition-all shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    <span>{showAddForm ? 'Cancel' : 'Add Player'}</span>
                </button>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleAddPlayer} className="bg-slate-900 p-6 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                                <input
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                                <select
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Batsman</option>
                                    <option>Bowler</option>
                                    <option>All-rounder</option>
                                    <option>Wicket-keeper</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Base Price (₹)</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                                    value={formData.basePrice}
                                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="bg-yellow-500 text-slate-950 px-4 py-2 rounded-lg font-bold">
                                Save Player
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-slate-800/50 text-slate-400 text-sm uppercase">
                            <th className="px-6 py-4">Player</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {players.map((player) => (
                            <tr key={player._id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                                        <Award className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <span className="font-semibold text-white">{player.name}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-300">{player.category}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                        player.status === 'Sold' ? 'bg-green-500/10 text-green-500' :
                                        player.status === 'Under Hammer' ? 'bg-yellow-500/10 text-yellow-500 animate-pulse' :
                                        'bg-slate-800 text-slate-400'
                                    }`}>
                                        {player.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {player.status === 'Available' && (
                                        <button
                                            onClick={() => startAuction(player._id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
                                            title="Start Auction"
                                        >
                                            <Gavel className="w-5 h-5" />
                                        </button>
                                    )}
                                    {player.status === 'Under Hammer' && (
                                        <button
                                            onClick={() => endAuction(player._id)}
                                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all"
                                            title="End Auction"
                                        >
                                            <Gavel className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeletePlayer(player._id)}
                                        className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white p-2 rounded-lg border border-red-500/30 transition-all font-bold"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
