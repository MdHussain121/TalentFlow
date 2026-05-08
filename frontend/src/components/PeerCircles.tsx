import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MessageSquare, Zap, Video, Mic, Settings, X,
  UserPlus, Circle, Clock, ArrowRight, Sparkles, Trophy, Send, Bot
} from 'lucide-react';

interface Peer {
  id: string; name: string; role: string; readiness: number;
  status: 'online' | 'busy' | 'away'; avatar: string;
}
interface PeerCircle {
  id: string; name: string; topic: string; members: number;
  maxMembers: number; type: 'public' | 'private'; intensity: 'High' | 'Medium' | 'Casual';
}
interface Message {
  id: number; user: string; text: string; time: string; isAI?: boolean;
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

const API_BASE = 'http://localhost:3000/ai';

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const PeerCircles: React.FC = () => {
  const [activeCircle, setActiveCircle] = useState<PeerCircle | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [liveCount, setLiveCount] = useState(128);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate live peer count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(c => c + Math.floor(Math.random() * 5) - 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAITyping]);

  const joinCircle = (circle: PeerCircle) => {
    setActiveCircle(circle);
    setError(null);
    setChatHistory([]);
    const welcome: Message = { id: 1, user: 'System', text: `You joined ${circle.name}. Topic: ${circle.topic}`, time: getTime() };
    const greeting: Message = { id: 2, user: 'Arjun Mehta', text: `Hey! Glad you're here. Let's dive into ${circle.topic} 🔥`, time: getTime(), isAI: true };
    setMessages([welcome, greeting]);
  };

  const leaveCircle = () => {
    setActiveCircle(null);
    setMessages([]);
    setChatHistory([]);
    setError(null);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeCircle || isAITyping) return;

    const userMsg: Message = { id: Date.now(), user: 'You', text: inputText, time: getTime() };
    const currentInput = inputText;
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsAITyping(true);
    setError(null);

    // Build updated history
    const updatedHistory = [...chatHistory, { role: 'user', content: currentInput }];

    try {
      const res = await fetch(`${API_BASE}/peer-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          history: updatedHistory,
          circle_topic: activeCircle.topic,
          circle_name: activeCircle.name,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const aiText = data.response || 'Hmm, could you rephrase that?';

      // Pick a random peer to "speak"
      const speaker = PEERS[Math.floor(Math.random() * PEERS.length)];
      const aiMsg: Message = { id: Date.now() + 1, user: speaker.name, text: aiText, time: getTime(), isAI: true };
      setMessages(prev => [...prev, aiMsg]);
      setChatHistory([...updatedHistory, { role: 'assistant', content: aiText }]);
    } catch (err: any) {
      setError('Could not reach AI engine. Is the backend running on port 8000?');
      const fallback: Message = {
        id: Date.now() + 1, user: 'System',
        text: 'AI peer is temporarily offline. Keep the discussion going!',
        time: getTime(),
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsAITyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <AnimatePresence mode="wait">
        {!activeCircle ? (
          <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Header */}
            <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Peer Circles</h2>
                <p className="text-slate-400 text-sm">Join live AI-powered study groups and practice with top-tier candidates.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {liveCount} PEERS LIVE
                </div>
                <button className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-all flex items-center gap-2">
                  <UserPlus size={14} /> CREATE CIRCLE
                </button>
              </div>
            </div>

            {/* Circles Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {CIRCLES.map((circle) => (
                <motion.div key={circle.id} whileHover={{ y: -4 }} className="bento-item p-6 flex flex-col group cursor-pointer" onClick={() => joinCircle(circle)}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                      <Users size={24} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${circle.intensity === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          circle.intensity === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        }`}>{circle.intensity} INTENSITY</span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500"><Users size={10} /> {circle.members}/{circle.maxMembers}</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{circle.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 flex-grow">{circle.topic}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex -space-x-2">
                      {PEERS.slice(0, 3).map((peer, i) => (
                        <img key={i} src={peer.avatar} className="w-6 h-6 rounded-full border-2 border-background" alt="" />
                      ))}
                      <div className="w-6 h-6 rounded-full bg-white/5 border-2 border-background flex items-center justify-center text-[8px] font-bold">+{circle.members - 3}</div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-primary font-bold">
                      <Bot size={12} /> AI-Powered <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bento-item p-6">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <Circle className="text-emerald-500 fill-emerald-500" size={8} /> Active Peers
                </h3>
                <div className="space-y-4">
                  {PEERS.map((peer) => (
                    <div key={peer.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
                      <div className="relative">
                        <img src={peer.avatar} className="w-10 h-10 rounded-xl" alt="" />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#1a1c1e] ${peer.status === 'online' ? 'bg-emerald-500' : peer.status === 'busy' ? 'bg-red-500' : 'bg-amber-500'}`} />
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
                <button className="w-full mt-6 py-2 rounded-xl bg-white/5 text-[10px] font-bold text-slate-400 hover:bg-white/10 transition-all">VIEW ALL DIRECTORY</button>
              </div>

              <div className="bento-item p-6 bg-primary/5 border-primary/20">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-4 text-primary"><Trophy size={20} /></div>
                <h3 className="font-bold text-sm mb-2">Circle Leaderboard</h3>
                <p className="text-[10px] text-slate-400 mb-4">Top contributors in technical peer circles this month.</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]"><span className="text-slate-200">1. Siddharth Soni</span><span className="text-primary font-bold">2.4k pts</span></div>
                  <div className="flex justify-between items-center text-[10px]"><span className="text-slate-400">2. Arjun Mehta</span><span className="text-slate-400">1.9k pts</span></div>
                  <div className="flex justify-between items-center text-[10px]"><span className="text-slate-400">3. Priya Rai</span><span className="text-slate-400">1.6k pts</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="room" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col h-[calc(100vh-200px)] bento-item overflow-hidden">
            {/* Room Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20 flex-shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={leaveCircle} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-slate-400"><X size={20} /></button>
                <div>
                  <h2 className="font-bold flex items-center gap-2">
                    {activeCircle.name}
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] border border-emerald-500/20 uppercase">Live Now</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] border border-primary/20 uppercase flex items-center gap-1"><Bot size={8} /> AI Peers</span>
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
                <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-all"><Video size={18} /></button>
                <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-all"><Mic size={18} /></button>
                <button className="p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all"><Settings size={18} /></button>
              </div>
            </div>

            <div className="flex flex-grow overflow-hidden">
              {/* Left: Content Panel */}
              <div className="flex-grow p-8 overflow-y-auto bg-black/10">
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4"><Sparkles className="text-primary/40 group-hover:text-primary transition-all" size={24} /></div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">Today's Practice Topic</span>
                    <h3 className="text-xl font-bold mb-4">{activeCircle.topic}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      This is a live AI-powered study session. Ask questions, share insights, and get real-time responses from AI peers trained on your topic. The chat is powered by the TalentFlow AI engine.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Next Milestone</h4>
                      <p className="text-sm font-medium">Shared Mock Drill</p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-emerald-500"><Clock size={10} /> Starting in 4:20</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Messages Sent</h4>
                      <p className="text-sm font-medium">{messages.filter(m => m.user === 'You').length} by you</p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-primary"><Bot size={10} /> {messages.filter(m => m.isAI).length} AI responses</div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      ⚠️ {error}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Live Chat */}
              <div className="w-80 border-l border-white/5 flex flex-col bg-black/20 flex-shrink-0">
                <div className="p-4 border-b border-white/5 bg-black/10 flex-shrink-0">
                  <h4 className="text-xs font-bold flex items-center gap-2">
                    <MessageSquare size={14} className="text-primary" /> Circle Chat
                    <span className="ml-auto text-[9px] text-emerald-500 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> AI-Powered
                    </span>
                  </h4>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.user === 'You' ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {msg.user !== 'You' && msg.user !== 'System' && (
                          <span className="text-[9px] font-bold text-slate-400">{msg.user}</span>
                        )}
                        <span className="text-[8px] text-slate-600">{msg.time}</span>
                      </div>
                      <div className={`px-3 py-2 rounded-2xl text-[11px] max-w-[90%] ${msg.user === 'System' ? 'bg-white/5 text-slate-500 italic text-center w-full' :
                          msg.user === 'You' ? 'bg-primary text-white rounded-tr-none' :
                            'bg-white/10 text-slate-200 rounded-tl-none'
                        }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}

                  {isAITyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2">
                      <div className="px-3 py-2 rounded-2xl rounded-tl-none bg-white/10 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[9px] text-slate-600 mt-2">AI peer typing...</span>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="p-4 border-t border-white/5 bg-black/30 flex-shrink-0">
                  <div className="relative">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isAITyping ? 'AI peer is responding...' : 'Ask or share something...'}
                      disabled={isAITyping}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 transition-all pr-10 disabled:opacity-50"
                    />
                    <button type="submit" disabled={isAITyping || !inputText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-all disabled:opacity-30">
                      <Send size={15} />
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-600 mt-1.5 text-center">Powered by TalentFlow AI Engine</p>
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