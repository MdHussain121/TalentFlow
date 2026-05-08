import React from 'react';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  level: number;
}

interface NeuralGapAnalysisProps {
  skills: Skill[];
}

const NeuralGapAnalysis: React.FC<NeuralGapAnalysisProps> = ({ skills }) => {
  // We need at least 3 points for a radar chart
  const dataPoints = skills.length >= 3 ? skills : [
    ...skills,
    { name: 'System Design', level: 60 },
    { name: 'Soft Skills', level: 85 }
  ].slice(0, 5);

  const size = 300;
  const center = size / 2;
  const radius = (size / 2) - 40;
  const angleStep = (Math.PI * 2) / dataPoints.length;

  const points = dataPoints.map((skill, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = center + radius * (skill.level / 100) * Math.cos(angle);
    const y = center + radius * (skill.level / 100) * Math.sin(angle);
    return { x, y, labelX: center + (radius + 25) * Math.cos(angle), labelY: center + (radius + 25) * Math.sin(angle), skill };
  });

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Background web lines
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 relative">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grids */}
        {gridLevels.map((level, i) => (
          <polygon
            key={i}
            points={dataPoints.map((_, j) => {
              const angle = j * angleStep - Math.PI / 2;
              const x = center + radius * level * Math.cos(angle);
              const y = center + radius * level * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {dataPoints.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Area */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          points={polygonPoints}
          fill="rgba(99, 102, 241, 0.2)"
          stroke="#6366f1"
          strokeWidth="2"
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.labelX}
            y={p.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[9px] font-black uppercase tracking-tighter fill-slate-500"
          >
            {p.skill.name.split(' ')[0]}
          </text>
        ))}

        {/* Data points */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            initial={{ r: 0 }}
            animate={{ r: 3 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            cx={p.x}
            cy={p.y}
            fill="#6366f1"
            className="drop-shadow-[0_0_5px_rgba(99,102,241,0.8)]"
          />
        ))}
      </svg>

      {/* Legend / Overlay */}
      <div className="absolute top-0 right-0 p-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skill DNA</span>
        </div>
      </div>
    </div>
  );
};

export default NeuralGapAnalysis;
