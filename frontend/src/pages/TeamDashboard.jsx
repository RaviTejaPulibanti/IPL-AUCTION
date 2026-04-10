import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Wallet, Users, Award, Briefcase, TrendingDown, Layout } from 'lucide-react';

const TeamDashboard = () => {
    const { user } = useAuth();
    const [teamData, setTeamData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeamData();
    }, []);

    const fetchTeamData = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/auth/me');
            setTeamData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white">Loading team data...</div>;
    if (!teamData) return <div className="text-white">No team data found.</div>;

    const totalSpent = 1000000000 - teamData.budget;

    return (
        <div className="space-y-8">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white">{teamData.name}</h2>
                    <p className="text-slate-400 font-medium">Owned by <span className="text-yellow-500">{teamData.owner}</span></p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-2xl flex items-center space-x-4 shadow-xl w-full lg:w-auto">
                    <div className="bg-green-500/10 p-2 md:p-3 rounded-xl border border-green-500/20">
                        <Wallet className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
                    </div>
                    <div>
                        <p className="text-[10px] md:text-xs text-slate-500 uppercase font-black tracking-widest">Remaining Budget</p>
                        <p className="text-xl md:text-2xl font-black text-white">₹ {(teamData.budget / 10000000).toFixed(2)} Cr</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-2">
                    <div className="flex justify-between items-start">
                        <Users className="w-8 h-8 text-blue-500" />
                        <span className="text-3xl font-black text-white">{teamData.players.length}</span>
                    </div>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Squad Size</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-2">
                    <div className="flex justify-between items-start">
                        <TrendingDown className="w-8 h-8 text-red-500" />
                        <span className="text-3xl font-black text-white">₹ {(totalSpent / 10000000).toFixed(2)} Cr</span>
                    </div>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total Spent</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-2">
                    <div className="flex justify-between items-start">
                        <Layout className="w-8 h-8 text-yellow-500" />
                        <span className="text-3xl font-black text-white">{(teamData.budget / 1000000000 * 100).toFixed(1)}%</span>
                    </div>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Budget Left</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-8 flex items-center space-x-3">
                    <Briefcase className="w-8 h-8 text-yellow-500" />
                    <span>Squad List</span>
                </h3>

                {teamData.players.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
                        <p className="text-slate-500 text-lg italic">Your squad is currently empty. Start bidding in the auction room!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamData.players.map((player) => (
                            <motion.div
                                key={player._id || player}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl hover:border-yellow-500/30 transition-all hover:bg-slate-800"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                                        <Award className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{player.category || 'Player'}</span>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">{player.name || 'Unknown Player'}</h4>
                                <div className="bg-slate-950/50 p-3 rounded-lg flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-bold uppercase">Bought For</span>
                                    <span className="text-green-500 font-black">₹ {(player.currentBid / 10000000).toFixed(2)} Cr</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamDashboard;
