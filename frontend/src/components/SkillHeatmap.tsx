import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface Skill {
  name: string;
  level: number; // 0 to 100
  color: string;
}

const SkillHeatmap: React.FC<{ skills: Skill[] }> = ({ skills }) => {
  // Calculate average skill level for overall visualization
  const avgLevel = skills.length > 0
    ? skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length
    : 0;

  // Get dominant color based on average
  const getDominantColor = () => {
    if (avgLevel < 50) return 'rgba(245, 158, 11, 0.6)'; // Amber
    if (avgLevel < 75) return 'rgba(20, 184, 166, 0.6)'; // Teal
    return 'rgba(99, 102, 241, 0.8)'; // Purple
  };

  return (
    <div className="w-full h-full flex flex-col p-6">
      {/* Header with Overall Score */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Skill DNA Profile</h3>
          <p className="text-xs text-slate-400">Based on AI analysis of your technical competencies</p>
        </div>
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke={getDominantColor()}
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ strokeDasharray: "220 220" }}
              animate={{ strokeDasharray: `${(avgLevel / 100) * 220} 220` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-black text-white">{Math.round(avgLevel)}%</span>
          </div>
        </div>
      </div>

      {/* Grid of Skill Cards */}
      <div className="grid grid-cols-2 gap-4 flex-grow content-start">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, ease: "easeOut" }}
            className={`glass rounded-2xl p-4 border transition-all group relative overflow-hidden ${
              skill.level >= 85 ? 'border-primary/50' : 'border-white/10 hover:border-white/20'
            }`}
          >
            {/* Skill Level Indicator Bar (vertical) */}
            <div className="relative h-24 w-full flex items-end justify-center mb-3">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 right-0 rounded-full transition-all"
                  style={{
                    backgroundColor: skill.color
                  }}
                />
              </div>
              
              {/* Aura Intensity Glow removed */}
              {/* Level number */}
              <div className="relative z-10 bg-black/50 rounded-full px-2 py-1 text-xs font-bold text-white">
                {skill.level}%
              </div>
            </div>

            {/* Skill Name */}
            <p className="text-xs font-bold text-white text-center truncate">
              {skill.name}
            </p>

            {/* Tier badge */}
            <div className="mt-2 flex justify-center">
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                skill.level >= 85 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                skill.level >= 70 ? 'bg-primary/20 text-primary border border-primary/30' :
                skill.level >= 50 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-slate-500/20 text-slate-400 border border-slate-500/30'
              }`}>
                {skill.level >= 85 ? 'Expert' : skill.level >= 70 ? 'Advanced' : skill.level >= 50 ? 'Intermediate' : 'Beginner'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insights Footer */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Zap className="text-amber-400" size={12} />
          <span>Top {Math.round(avgLevel)}% of candidates in your skill tier</span>
        </div>
      </div>
    </div>
  );
};

export default SkillHeatmap;
