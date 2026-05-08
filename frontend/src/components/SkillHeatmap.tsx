import React from 'react';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  level: number; // 0 to 100
  color: string;
}

const SkillHeatmap: React.FC<{ skills: Skill[] }> = ({ skills }) => {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {skills.map((skill, index) => (
        <div key={index} className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-medium text-slate-400">
            <span>{skill.name}</span>
            <span>{skill.level}%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
              className="h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              style={{ backgroundColor: skill.color }}
            />
          </div>
        </div>
      ))}

      {/* Abstract Heatmap Visualizer */}
      <div className="mt-4 flex-grow relative bg-white/5 rounded-lg border border-white/5 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <motion.path
            d="M0,50 Q25,20 50,50 T100,50 T150,50 T200,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-500 uppercase tracking-widest">
          Live latent potential analysis
        </div>
      </div>
    </div>
  );
};

export default SkillHeatmap;
