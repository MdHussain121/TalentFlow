import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Cpu,
  Target,
  Globe,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-background text-slate-200 overflow-x-hidden selection:bg-primary/30">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-6 py-8 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">TalentFlow <span className="text-primary text-sm align-top">AI</span></h1>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#vision" className="hover:text-white transition-colors">Vision</a>
          <a href="#network" className="hover:text-white transition-colors">Network</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-20 pb-32 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 mb-8">
            The Future of Technical Hiring is Here
          </span>
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Accelerate Your <br />
            Career with <span className="text-primary">Neural AI</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            TalentFlow AI bridges the gap between ambitious students and global opportunities using real-time skill DNA analysis and Gemini-powered mock simulations.
          </p>
          <button
            onClick={onStart}
            className="px-10 py-5 rounded-2xl bg-primary text-white font-bold shadow-2xl shadow-primary/40 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3 mx-auto"
          >
            Get Started <ArrowRight size={20} />
          </button>
        </motion.div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h3 className="text-3xl font-black mb-4">Hyper-Personalized Growth</h3>
          <p className="text-slate-500 max-w-lg mx-auto">Everything you need to crack your dream role, powered by state-of-the-art LLMs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Cpu className="text-primary" size={32} />,
              title: "Neural Skill Mapping",
              desc: "Upload your resume and get a live heatmap of your strengths and latent technical potential."
            },
            {
              icon: <Target className="text-emerald-500" size={32} />,
              title: "AI Mock Drills",
              desc: "Experience real-time technical interviews with Gemini 2.5 and get instant sentiment feedback."
            },
            {
              icon: <Globe className="text-purple-500" size={32} />,
              title: "Global Job Search",
              desc: "Neural search connects you to direct internship roles worldwide based on your unique DNA."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass-card p-10 hover:border-primary/30 transition-all group"
            >
              <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-block group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-32 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-black mb-8">Our Vision</h3>
          <p className="text-slate-400 text-lg leading-relaxed mb-12">
            We believe every student, regardless of their background, deserves AI-powered tools to compete for the world's best internships. Our mission is to level the playing field with technology that was once reserved for elite institutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Merit-Based", desc: "Skills matter more than schools" },
              { title: "Borderless", desc: "Connect globally without barriers" },
              { title: "Continuous", desc: "Real-time feedback for growth" }
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-6 border border-white/10">
                <h4 className="font-bold text-lg mb-2 text-white">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Section */}
      <section id="network" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-black mb-8">Powering Your Network</h3>
          <p className="text-slate-400 text-lg leading-relaxed mb-12">
            From resume analysis to interview simulations, our AI engine processes millions of data points to connect you with opportunities that match your unique skill DNA.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 border border-white/10"
          >
            <Sparkles className="mx-auto text-primary mb-6" size={48} />
            <h4 className="text-2xl font-bold mb-4">Ready to Get Started?</h4>
            <p className="text-slate-400 mb-8">Upload your resume and let AI find your perfect match.</p>
            <button
              onClick={onStart}
              className="px-10 py-4 rounded-xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Enter Dashboard
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Zap className="text-primary fill-current" size={24} />
            <span className="font-bold text-xl">TalentFlow AI</span>
          </div>
          <div className="flex gap-12 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
