import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressOrbitProps {
  progress: number; // 0 to 100
  label: string;
}

const NorthStarOrbit: React.FC<ProgressOrbitProps> = ({ progress, label }) => {
  // Map progress to color: 0-30 (Amber), 31-70 (Teal), 71-100 (Electric Cobalt)
  const getColor = () => {
    if (progress < 40) return 'rgba(245, 158, 11, 0.6)'; // Amber
    if (progress < 75) return 'rgba(20, 184, 166, 0.6)'; // Teal
    return 'rgba(99, 102, 241, 0.8)'; // Electric Cobalt
  };

  const orbitColor = getColor();

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer Glow */}
      <motion.div 
        className="absolute inset-0 rounded-full blur-[60px]"
        animate={{ 
          backgroundColor: orbitColor,
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Rotating Ring */}
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="128"
          cy="128"
          r="110"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />
        <motion.circle
          cx="128"
          cy="128"
          r="110"
          fill="none"
          stroke={orbitColor}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 691" }}
          animate={{ strokeDasharray: `${(progress / 100) * 691} 691` }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <motion.span 
          className="text-4xl font-black mb-1"
          key={progress}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {progress}%
        </motion.span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">{label}</span>
      </div>


    </div>
  );
};

export default NorthStarOrbit;
