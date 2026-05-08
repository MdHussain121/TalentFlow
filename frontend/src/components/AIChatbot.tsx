import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am your AI Career Co-Pilot. How can I help you with your talent journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Connect to Live AI Engine through Gateway
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(m => ({
            role: m.role === 'bot' ? 'model' : 'user',
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error('API Sync Failed');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "I'm having trouble syncing with the neural engine. Please check your API key in the .env file." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-96 glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="p-4 bg-primary/20 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Career Co-Pilot</h3>
                  <p className="text-[10px] text-primary font-medium">Live Gemini 2.0 Synced</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'}`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="animate-spin text-primary" size={14} />
                    <span className="text-[10px] text-slate-500">Neural Syncing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your career..."
                  className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary/50 transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="p-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? 'bg-white/10 rotate-90 scale-90' : 'bg-primary hover:scale-110 shadow-primary/40'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="text-white" />}
      </button>
    </div>
  );
};

export default AIChatbot;
