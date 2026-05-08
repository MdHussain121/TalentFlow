import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Zap, 
  Shield, 
  Video, 
  Mic, 
  Settings, 
  X, 
  UserPlus, 
  Circle,
  Clock,
  ArrowRight,
  Sparkles,
  Trophy,
  ChevronRight
} from 'lucide-react';

interface Peer {
  id: string;
  name: string;
  role: string;
  readiness: number;
  status: 'online' | 'busy' | 'away';
  avatar: string;
}

interface PeerCircle {
  id: string;
  name: string;
  topic: string;
  members: number;
  maxMembers: number;
  type: 'public' | 'private';
  intensity: 'High' | 'Medium' | 'Casual';
}

const PEERS: Peer[] = [
  { id: '1', name: 'Arjun Mehta', role: 'Fullstack Dev', readiness: 92, status: 'online', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun' },
  { id: '2', name: 'Sarah Chen', role: 'Frontend Lead', readiness: 88, status: 'busy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: '3', name: 'Mike Ross', role: 'Backend Eng', readiness: 75, status: 'online', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
  { id: '4', name: 'Priya Rai', role: 'UI/UX Designer', readiness: 95, status: 'online', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
  { id: '5', name: 'David Kim', role: 'DevOps', readiness: 82, status: 'away', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
];

const CIRCLES: PeerCircle[] = [
  { id: 'c1', name: 'Frontend Alchemists', topic: 'React 19 & Next.js Performance', members: 4, maxMembers: 6, type: 'public', intensity: 'High' },
  { id: 'c2', name: 'Backend Scalers', topic: 'System Design: Distributed Systems', members: 3, maxMembers: 5, type: 'public', intensity: 'Medium' },
  { id: 'c3', name: 'DS/Algo Grind', topic: 'Dynamic Programming Patterns', members: 8, maxMembers: 10, type: 'public', intensity: 'High' },
  { id: 'c4', name: 'UI/UX Critique', topic: 'Accessibility in Modern Web', members: 2, maxMembers: 4, type: 'public', intensity: 'Casual' },
];

const PeerCircles: React.FC = () => {
  const [activeCircle, setActiveCircle] = useState<PeerCircle | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

  const joinCircle = (circle: PeerCircle) => {
    setActiveCircle(circle);
    setMessages([
      { id: 1, user: 'System', text: `Welcome to ${circle.name}!`, time: 'Now' },
      { id: 2, user: 'Arjun Mehta', text: 'Hey! Ready for some practice?', time: '2m' }
    ]);
  };

  const leaveCircle = () => {
    setActiveCircle(null);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      user: 'You',
      text: inputText,
      time: 'Now'
    };
    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate AI or Peer response
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        user: PEERS[Math.floor(Math.random() * PEERS.length)].name,
        text: "That's a great point! I was also thinking about that approach.",
        time: 'Now'
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <AnimatePresence mode="wait">
        {!activeCircle ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Header Section */}
            <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Peer Circles</h2>
                <p className="text-slate-400 text-sm">Join live study groups and practice with top-tier candidates.</p>
              </div>
              <div className="flex gap-3">
                 <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    128 PEERS LIVE
                 </div>
                 <button className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-all flex items-center gap-2">
                    <UserPlus size={14} /> CREATE CIRCLE
                 </button>
              </div>
            </div>

            {/* Circles Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {CIRCLES.map((circle) => (
                <motion.div 
                  key={circle.id}
                  whileHover={{ y: -4 }}
                  className="bento-item p-6 flex flex-col group cursor-pointer"
                  onClick={() => joinCircle(circle)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                      <Users size={24} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${
                        circle.intensity === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        circle.intensity === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}>
                        {circle.intensity} INTENSITY
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Users size={10} /> {circle.members}/{circle.maxMembers}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{circle.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 flex-grow">{circle.topic}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex -space-x-2">
                      {PEERS.slice(0, 3).map((peer, i) => (
                        <img key={i} src={peer.avatar} className="w-6 h-6 rounded-full border-2 border-background" alt="" />
                      ))}
                      <div className="w-6 h-6 rounded-full bg-white/5 border-2 border-background flex items-center justify-center text-[8px] font-bold">
                        +{circle.members - 3}
                      </div>
                    </div>
                    <div className="text-primary group-hover:translate-x-2 transition-transform">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Online Peers Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bento-item p-6">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <Circle className="text-emerald-500 fill-emerald-500" size={8} /> Active Peers
                </h3>
                <div className="space-y-4">
                  {PEERS.map((peer) => (
                    <div key={peer.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                      <div className="relative">
                        <img src={peer.avatar} className="w-10 h-10 rounded-xl" alt="" />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#1a1c1e] ${
                          peer.status === 'online' ? 'bg-emerald-500' :
                          peer.status === 'busy' ? 'bg-red-500' : 'bg-amber-500'
                        }`} />
                      </div>
                      <div className="flex-grow">
                        <p className="text-xs font-bold">{peer.name}</p>
                        <p className="text-[10px] text-slate-500">{peer.role}</p>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] font-bold text-primary">{peer.readiness}%</span>
                         <div className="w-12 h-1 bg-white/5 rounded-full mt-1">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${peer.readiness}%` }} />
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-2 rounded-xl bg-white/5 text-[10px] font-bold text-slate-400 hover:bg-white/10 transition-all">
                  VIEW ALL DIRECTORY
                </button>
              </div>

              <div className="bento-item p-6 bg-primary/5 border-primary/20">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-4 text-primary">
                  <Trophy size={20} />
                </div>
                <h3 className="font-bold text-sm mb-2">Circle Leaderboard</h3>
                <p className="text-[10px] text-slate-400 mb-4">Top contributors in technical peer circles this month.</p>
                <div className="space-y-2">
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-200">1. Siddharth Soni</span>
                      <span className="text-primary font-bold">2.4k pts</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">2. Arjun Mehta</span>
                      <span className="text-slate-400">1.9k pts</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="room"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col h-[calc(100vh-200px)] bento-item overflow-hidden"
          >
            {/* Room Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={leaveCircle}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-slate-400"
                  >
                    <X size={20} />
                  </button>
                  <div>
                    <h2 className="font-bold flex items-center gap-2">
                      {activeCircle.name} 
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] border border-emerald-500/20 uppercase">Live Now</span>
                    </h2>
                    <p className="text-[10px] text-slate-500">{activeCircle.topic}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="flex -space-x-3 mr-4">
                     {PEERS.slice(0, 4).map((p, i) => (
                       <img key={i} src={p.avatar} className="w-8 h-8 rounded-full border-2 border-[#1a1c1e] hover:z-10 transition-all cursor-pointer" title={p.name} alt="" />
                     ))}
                  </div>
                  <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-all">
                     <Video size={18} />
                  </button>
                  <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-all">
                     <Mic size={18} />
                  </button>
                  <button className="p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                     <Settings size={18} />
                  </button>
               </div>
            </div>

            <div className="flex flex-grow overflow-hidden">
               {/* Left: Content/Challenge */}
               <div className="flex-grow p-8 overflow-y-auto bg-black/10">
                  <div className="max-w-2xl mx-auto space-y-8">
                     <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                           <Sparkles className="text-primary/40 group-hover:text-primary transition-all" size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">Today's Practice Topic</span>
                        <h3 className="text-xl font-bold mb-4">Optimizing Large Lists in React 19</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Discussing the implementation of virtualization, the new <code className="bg-white/10 px-1 rounded">useOptimistic</code> hook, and how to minimize re-renders in deep component trees.
                        </p>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                           <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Next Milestone</h4>
                           <p className="text-sm font-medium">Shared Mock Drill</p>
                           <div className="flex items-center gap-2 mt-2 text-[10px] text-emerald-500">
                              <Clock size={10} /> Starting in 4:20
                           </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                           <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Participant Goal</h4>
                           <p className="text-sm font-medium">3 Concept Deepdives</p>
                           <div className="w-full h-1 bg-white/5 rounded-full mt-3">
                              <div className="h-full bg-primary rounded-full w-2/3" />
                           </div>
                        </div>
                     </div>

                     <div className="pt-8">
                        <h4 className="font-bold text-sm mb-4">Shared Resources</h4>
                        <div className="space-y-2">
                           {['react-performance-docs.pdf', 'system-design-v3.excalidraw', 'optimization-snippets.ts'].map((file, i) => (
                             <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3">
                                   <Zap size={14} className="text-primary" />
                                   <span className="text-[11px] text-slate-300">{file}</span>
                                </div>
                                <ArrowRight size={12} className="text-slate-600 group-hover:text-primary" />
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right: Chat */}
               <div className="w-80 border-l border-white/5 flex flex-col bg-black/20">
                  <div className="p-4 border-b border-white/5 bg-black/10">
                     <h4 className="text-xs font-bold flex items-center gap-2">
                        <MessageSquare size={14} className="text-primary" /> Circle Chat
                     </h4>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
                     {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.user === 'You' ? 'items-end' : 'items-start'}`}>
                           <div className="flex items-center gap-2 mb-1">
                              {msg.user !== 'You' && msg.user !== 'System' && <span className="text-[9px] font-bold text-slate-500">{msg.user}</span>}
                              <span className="text-[8px] text-slate-600 uppercase">{msg.time}</span>
                           </div>
                           <div className={`px-3 py-2 rounded-2xl text-[11px] max-w-[90%] ${
                             msg.user === 'System' ? 'bg-white/5 text-slate-500 italic text-center w-full' :
                             msg.user === 'You' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/10 text-slate-200 rounded-tl-none'
                           }`}>
                              {msg.text}
                           </div>
                        </div>
                     ))}
                  </div>

                  <form onSubmit={sendMessage} className="p-4 border-t border-white/5 bg-black/30">
                     <div className="relative">
                        <input 
                          type="text" 
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Type a message..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 transition-all pr-10"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-all">
                           <Zap size={16} fill="currentColor" />
                        </button>
                     </div>
                  </form>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PeerCircles;
