import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ExternalLink, Users, Zap, IndianRupee } from 'lucide-react';

const TEAMS = [
  { abbr: 'MI',   name: 'Mumbai Indians',          bg: '#004BA0', tc: '#fff' },
  { abbr: 'CSK',  name: 'Chennai Super Kings',      bg: '#F9CD05', tc: '#1a1a00' },
  { abbr: 'RCB',  name: 'Royal Challengers',        bg: '#C01515', tc: '#fff' },
  { abbr: 'KKR',  name: 'Kolkata Knight Riders',    bg: '#3A225D', tc: '#fff' },
  { abbr: 'DC',   name: 'Delhi Capitals',           bg: '#0078BC', tc: '#fff' },
  { abbr: 'PBKS', name: 'Punjab Kings',             bg: '#E01C2C', tc: '#fff' },
  { abbr: 'SRH',  name: 'Sunrisers Hyderabad',      bg: '#F7640C', tc: '#fff' },
  { abbr: 'GT',   name: 'Gujarat Titans',           bg: '#1B3766', tc: '#fff' },
  { abbr: 'LSG',  name: 'Lucknow SG',               bg: '#00B2A9', tc: '#fff' },
  { abbr: 'RR',   name: 'Rajasthan Royals',         bg: '#E91E8C', tc: '#fff' },
];

const Lobby = () => {
  const [playerName, setPlayerName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [roomName, setRoomName]     = useState('');
  const [roomCode, setRoomCode]     = useState('');
  const [error, setError]           = useState('');
  const navigate = useNavigate();

  const flashError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  };

  const validate = () => {
    if (!playerName.trim()) { flashError('Please enter your name first.'); return false; }
    if (selectedTeam === null) { flashError('Pick a franchise to continue.'); return false; }
    return true;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!roomName.trim()) { flashError('Give your room a name.'); return; }
    try {
      const { data } = await axios.post('http://localhost:5000/api/rooms', { name: roomName, playerName });
      navigate(`/auction/${data.roomCode}`);
    } catch (err) {
      flashError(err.response?.data?.message || 'Failed to create room');
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!roomCode.trim()) { flashError('Enter a room code.'); return; }
    try {
      const { data } = await axios.post('http://localhost:5000/api/rooms/join', { roomCode, playerName });
      navigate(`/auction/${data.roomCode}`);
    } catch (err) {
      flashError(err.response?.data?.message || 'Failed to join room');
    }
  };

  const inputCls = "w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all";
  const labelCls = "block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-10">
        <span className="flex items-center gap-2 bg-black border border-zinc-800 text-orange-500 text-xs font-semibold px-4 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
          IPL 2026 — Auction live
        </span>
        <button className="text-xs text-zinc-500 border border-zinc-800 px-3 py-1.5 rounded-full hover:text-white hover:border-zinc-600 transition-all">
          54 rooms open →
        </button>
      </div>

      {/* Hero */}
      <div className="mb-8">
        <p className="text-[11px] font-bold tracking-widest uppercase text-orange-500 mb-2">IPL Player Auction</p>
        <h1 className="text-5xl font-extrabold leading-none text-white mb-2">
          Build your<br />dream <span className="text-orange-500">XI.</span>
        </h1>
        <p className="text-zinc-400 text-sm">Create a private room, pick your franchise, bid hard.</p>
      </div>

      {/* Name */}
      <label className={labelCls}>Your name</label>
      <input className={`${inputCls} mb-6`} placeholder="Enter your name to continue…"
        value={playerName} onChange={e => setPlayerName(e.target.value)} />

      {/* Team picker */}
      <label className={labelCls}>Pick your franchise</label>
      <div className="flex flex-wrap gap-2 mb-6">
        {TEAMS.map((t, i) => (
          <motion.button key={i} whileHover={{ y: -2 }} onClick={() => setSelectedTeam(i)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
              selectedTeam === i
                ? 'border-orange-500 bg-orange-500/5 ring-2 ring-orange-500/15'
                : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
            }`}
          >
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black flex-shrink-0"
              style={{ background: t.bg, color: t.tc }}>
              {t.abbr}
            </span>
            <span className="text-white">{t.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-red-400 text-sm bg-red-500/8 border border-red-500/20 px-4 py-2.5 rounded-lg text-center mb-4">
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <Plus className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Host auction</h2>
              <p className="text-[11px] text-zinc-500">You control the room</p>
            </div>
          </div>
          <form onSubmit={handleCreate}>
            <label className={labelCls}>Room name</label>
            <input className={`${inputCls} mb-3`} placeholder="e.g. Friday Night Draft"
              value={roomName} onChange={e => setRoomName(e.target.value)} />
            <button type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[.98] text-white text-sm font-bold py-2.5 rounded-lg transition-all">
              Create &amp; start bidding
            </button>
          </form>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Join room</h2>
              <p className="text-[11px] text-zinc-500">Got a code? Jump in</p>
            </div>
          </div>
          <form onSubmit={handleJoin}>
            <label className={labelCls}>Room code</label>
            <input className={`${inputCls} mb-3 uppercase tracking-widest`}
              placeholder="6-digit code"
              value={roomCode} onChange={e => setRoomCode(e.target.value)} />
            <button type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[.98] text-white text-sm font-bold py-2.5 rounded-lg transition-all">
              Join auction
            </button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mt-2">
        {[
          { Icon: Users,        num: '350+',  lbl: 'Players in pool' },
          { Icon: Zap,          num: '10',    lbl: 'Teams per room'  },
          { Icon: IndianRupee,  num: '100Cr', lbl: 'Starting purse'  },
        ].map(({ Icon, num, lbl }) => (
          <div key={lbl} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-orange-500">{num}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">{lbl}</div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Lobby;