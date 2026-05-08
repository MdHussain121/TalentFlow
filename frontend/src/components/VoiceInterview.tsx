import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Play, MessageSquare, ShieldAlert } from 'lucide-react';

const VoiceInterview: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startInterview = () => {
    setIsActive(true);
    setTranscript(["AI: Welcome to your technical assessment. Can you describe your experience with distributed systems?"]);
  };

  const handleEndSession = async () => {
    setIsActive(false);
    setIsAnalyzing(true);
    
    // Simulate getting a transcript from speech-to-text
    const dummyTranscript = "I have worked with microservices using Docker and Kubernetes. I also used Redis for caching and RabbitMQ for messaging.";
    
    try {
      const response = await fetch('http://localhost:3000/ai/analyze/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: dummyTranscript })
      });
      
      const data = await response.json();
      setTranscript(prev => [...prev, `You: ${dummyTranscript}`, `AI Feedback: ${data.analysis || "Great technical depth! Consider explaining the 'why' behind using RabbitMQ over Kafka for your specific use case."}`]);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">AI Mock Interview</h3>
        <span className={`flex items-center gap-2 text-xs ${isActive ? 'text-emerald-500' : 'text-slate-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
          {isActive ? 'Live Feedback Active' : (isAnalyzing ? 'Analyzing...' : 'Ready to Start')}
        </span>
      </div>

      <div className="flex-grow glass bg-black/20 rounded-xl p-4 overflow-y-auto flex flex-col gap-3 min-h-[200px]">
        {transcript.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center">
            <MessageSquare size={32} className="mb-2 opacity-20" />
            <p className="text-sm">Start your AI-guided interview session to receive real-time sentiment analysis.</p>
          </div>
        ) : (
          transcript.map((line, i) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={i}
              className={`p-3 rounded-lg text-sm ${line.startsWith('AI:') ? 'bg-primary/10 border border-primary/20 self-start max-w-[80%]' : (line.startsWith('AI Feedback:') ? 'bg-emerald-500/10 border border-emerald-500/20 self-start w-full italic' : 'bg-white/5 border border-white/10 self-end max-w-[80%]')}`}
            >
              {line}
            </motion.div>
          ))
        )}
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-[10px] text-slate-500 animate-pulse">
            <ShieldAlert size={12} className="text-orange-500" />
            Generating Technical Sentiment Analysis...
          </div>
        )}
      </div>

      {/* Audio Visualizer */}
      <div className="h-16 flex items-center justify-center gap-1">
        {isActive ? (
          Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-primary/60 rounded-full"
              animate={{ height: [10, Math.random() * 40 + 10, 10] }}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
            />
          ))
        ) : (
          <div className="w-full h-[1px] bg-white/10" />
        )}
      </div>

      <div className="flex gap-3 mt-auto">
        {!isActive ? (
          <button 
            onClick={startInterview}
            disabled={isAnalyzing}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark transition-all flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            <Play size={18} fill="currentColor" /> Start Interview
          </button>
        ) : (
          <>
            <button 
              onClick={handleEndSession}
              className="flex-grow py-3 rounded-xl bg-red-500/20 text-red-500 border border-red-500/20 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 font-bold"
            >
              <MicOff size={18} /> End & Analyze
            </button>
            <button className="px-6 py-3 rounded-xl glass hover:bg-white/5 transition-all">
              <ShieldAlert size={18} className="text-orange-500" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceInterview;
