import React, { useState, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, History, DollarSign, User, TrendingUp, AlertCircle } from 'lucide-react';

const AuctionRoom = () => {
    const { currentPlayer, bidHistory, placeBid, error } = useAuction();
    const { user } = useAuth();
    const [bidAmount, setBidAmount] = useState('');

    useEffect(() => {
        if (currentPlayer) {
            setBidAmount(currentPlayer.currentBid + (currentPlayer.currentBid === 0 ? currentPlayer.basePrice : 10000000));
        }
    }, [currentPlayer]);

    const handleBid = (e) => {
        e.preventDefault();
        const amount = parseInt(bidAmount);
        if (amount > 0) {
            placeBid(currentPlayer._id, amount);
        }
    };

    const quickBids = [5000000, 10000000, 50000000, 100000000]; // 50L, 1Cr, 5Cr, 10Cr

    if (!currentPlayer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="bg-slate-900 p-8 rounded-full border border-slate-800 shadow-2xl">
                    <Gavel className="w-20 h-20 text-slate-700" />
                </div>
                <h2 className="text-3xl font-bold text-slate-400">Waiting for next player...</h2>
                <p className="text-slate-500 max-w-sm">The auctioneer will bring the next player under the hammer soon.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Player Info Section */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-8 space-y-6"
            >
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 p-6">
                        <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-4 py-1.5 rounded-full text-sm font-bold animate-pulse uppercase tracking-wider">
                            UNDER THE HAMMER
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-64 h-64 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner group overflow-hidden">
                           {currentPlayer.image ? (
                               <img src={currentPlayer.image} alt={currentPlayer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           ) : (
                               <User className="w-32 h-32 text-slate-600 group-hover:scale-110 transition-transform duration-500" />
                           )}
                        </div>

                        <div className="space-y-4 md:space-y-6 text-center md:text-left">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{currentPlayer.name}</h1>
                                <span className="text-lg md:text-xl text-yellow-500 font-bold uppercase tracking-widest">{currentPlayer.category}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:gap-8">
                                <div className="space-y-1">
                                    <p className="text-slate-500 text-[10px] md:text-sm uppercase font-bold tracking-tighter">Base Price</p>
                                    <p className="text-lg md:text-2xl font-bold text-white">₹ {(currentPlayer.basePrice / 10000000).toFixed(2)} Cr</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-500 text-[10px] md:text-sm uppercase font-bold tracking-tighter">Current Bid</p>
                                    <p className="text-xl md:text-3xl font-black text-green-500">₹ {(currentPlayer.currentBid / 10000000).toFixed(2)} Cr</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bidding Controls */}
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                        <span>Place Your Bid</span>
                    </h3>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-3 md:p-4 rounded-xl flex items-center space-x-3">
                            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                            <p className="text-sm md:font-medium">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                        {quickBids.map((increment) => (
                            <button
                                key={increment}
                                onClick={() => setBidAmount(currentPlayer.currentBid + increment)}
                                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all hover:scale-105"
                            >
                                + ₹ {(increment / 10000000).toFixed(2)} Cr
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleBid} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                            <input
                                type="number"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 md:py-4 pl-10 pr-4 text-xl md:text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black px-8 md:px-12 py-3 md:py-4 rounded-xl text-lg md:text-xl shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2"
                        >
                            <Gavel className="w-5 h-5 md:w-6 md:h-6" />
                            <span>PLACE BID</span>
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* Sidebar: Bid History & Info */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-4 space-y-6"
            >
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 h-[400px] lg:h-[80vh] flex flex-col shadow-2xl">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                            <History className="w-6 h-6 text-yellow-500" />
                            <span>Bid History</span>
                        </h3>
                        <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">{bidHistory.length} Bids</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {bidHistory.map((bid, index) => (
                                <motion.div
                                    key={`${bid.teamName}-${bid.bidAmount}-${index}`}
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`p-4 rounded-2xl border ${index === 0 ? 'bg-yellow-500/10 border-yellow-500/30 ring-1 ring-yellow-500/20' : 'bg-slate-800/50 border-slate-700/50'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-500 text-slate-950' : 'bg-slate-700 text-slate-400'}`}>
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                            <span className={`font-bold ${index === 0 ? 'text-white' : 'text-slate-300'}`}>{bid.teamName}</span>
                                        </div>
                                        <span className={`text-lg font-black ${index === 0 ? 'text-yellow-500' : 'text-white'}`}>₹ {(bid.bidAmount / 10000000).toFixed(2)} Cr</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {bidHistory.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-600 italic">
                                No bids yet. Be the first!
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuctionRoom;
