import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Globe,
  ShieldCheck,
  Sparkles,
  Zap,
  BarChart3,
  UserCircle,
  Search,
  Bell,
  Settings,
  ChevronRight,
  Users,
  Video,
  Briefcase,
  FileText,
  Map,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import SkillHeatmap from './components/SkillHeatmap';
import PeerCircles from './components/PeerCircles';
import VoiceInterview from './components/VoiceInterview';
import NorthStarOrbit from './components/NorthStarOrbit';
import NeuralSearch from './components/NeuralSearch';
import ResumeUpload from './components/ResumeUpload';
import AIChatbot from './components/AIChatbot';
import LandingPage from './components/LandingPage';
import MockInterview from './components/MockInterview';
import OnboardingGate from './components/OnboardingGate';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(() => {
    return window.location.pathname === '/dashboard';
  });

  const [showOnboarding, setShowOnboarding] = useState(true);

  const [activeTab, setActiveTab] = useState('overview');

  // Ensure we show onboarding on every fresh start
  useEffect(() => {
    if (isStarted) {
      // We keep showOnboarding true until the user finishes the upload in this session
    }
  }, [isStarted]);

  // Update URL when navigation state changes
  useEffect(() => {
    const newUrl = isStarted ? '/dashboard' : '/';
    if (window.location.pathname !== newUrl) {
      window.history.pushState({}, '', newUrl);
    }
  }, [isStarted]);

  // Listen for browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setIsStarted(window.location.pathname === '/dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [suggestedJobs, setSuggestedJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [feedback, setFeedback] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [skills, setSkills] = useState([
    { name: "React / Next.js", level: 92, color: "#61dafb" },
    { name: "TypeScript", level: 85, color: "#3178c6" },
    { name: "FastAPI / Python", level: 78, color: "#009688" },
    { name: "Docker / K8s", level: 65, color: "#2496ed" },
    { name: "Vector Databases", level: 72, color: "#6366f1" }
  ]);
  const [readinessScore, setReadinessScore] = useState(87);

  const onLandingStart = () => {
    window.history.pushState({}, '', '/dashboard');
    setIsStarted(true);
  };

  const onNavigateToLanding = () => {
    window.history.pushState({}, '', '/');
    setIsStarted(false);
  };

  const showFeedback = (message: string, type: 'success' | 'info' = 'info') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSearchResults = (results: any[]) => {
    setSuggestedJobs(results);
    setActiveTab('realtime');
    showFeedback(`Neural Search: Found ${results.length} active roles.`, "success");
  };

  const handleResumeAnalysis = (data: any) => {
    setSuggestedJobs(data.suggested_jobs);
    setRoadmap(data.roadmap);

    const newSkills = data.profile.skills.map((s: string, i: number) => ({
      name: s,
      level: Math.floor(Math.random() * 30) + 70,
      color: ["#61dafb", "#3178c6", "#009688", "#2496ed", "#6366f1"][i % 5]
    }));
    setSkills(newSkills);
    setReadinessScore(prev => Math.min(prev + 5, 100));

    // Hide onboarding and switch to overview tab
    setShowOnboarding(false);
    setActiveTab('overview');
    showFeedback("AI Analysis Complete! Your Skill Heatmap has been updated.", "success");
  };

  const handleOnboardingComplete = (data: any) => {
    // Load cached job search results
    const cachedData = localStorage.getItem('jobSearchCached');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setSuggestedJobs(parsed.results);
      } catch (e) {
        console.error('Failed to load cached results');
      }
    }

    handleResumeAnalysis(data);
  };

  const generateRoadmapForJob = async (job: any) => {
    showFeedback(`Generating Custom Roadmap for ${job.title}...`);
    try {
      const response = await fetch('http://localhost:8000/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: job.title,
          company: job.company,
          skills: skills.map(s => s.name)
        })
      });
      const data = await response.json();
      setRoadmap(data);
      setActiveTab('roadmap');
      showFeedback("Your personalized roadmap is ready!", "success");
    } catch (error) {
      console.error("Roadmap generation failed", error);
    }
  };

  if (!isStarted) {
    return <LandingPage onStart={onLandingStart} />;
  }

  // Show OnboardingGate if user is in dashboard but has no resume
  if (showOnboarding) {
    return <OnboardingGate onAnalysisComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background text-slate-200 font-sans selection:bg-primary/30 overflow-x-hidden">
      {/* Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl glass border flex items-center gap-3 shadow-2xl ${feedback.type === 'success' ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-primary/50 bg-primary/10'}`}
          >
            {feedback.type === 'success' ? <CheckCircle className="text-emerald-500" size={18} /> : <AlertCircle className="text-primary" size={18} />}
            <span className="text-sm font-medium">{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-white/5 p-6 hidden lg:flex flex-col z-50">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={onNavigateToLanding}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="text-white fill-current" size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">TalentFlow <span className="text-primary text-xs align-top">AI</span></h1>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
            { id: 'skills', label: 'Skill Heatmap', icon: <Cpu size={18} /> },
            { id: 'interview', label: 'Mock Interview', icon: <Sparkles size={18} /> },
            { id: 'realtime', label: 'Real-Time Jobs', icon: <Globe size={18} /> },
            { id: 'roadmap', label: 'Crack Roadmap', icon: <Map size={18} /> },
            { id: 'circles', label: 'Peer Circles', icon: <Users size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'text-slate-400 hover:bg-white/5'}`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          {/* Profile section removed */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 md:p-10 min-h-screen pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 auto-rows-auto"
            >
              {/* New Premium Overview Hero */}
              <div className="col-span-1 md:col-span-2 lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Main Readiness Card */}
                <div className="lg:col-span-8 bento-item p-12 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap size={200} className="text-primary -rotate-12" />
                  </div>
                  
                  <div className="relative z-10 shrink-0 transform hover:scale-105 transition-transform duration-500">
                    <NorthStarOrbit progress={readinessScore} label="Market Readiness" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col justify-center text-center md:text-left">
                    <div className="flex items-center gap-3 mb-6 self-center md:self-start">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        Day-in-the-Life Simulator Active
                      </span>
                    </div>
                    
                    <h2 className="text-5xl font-black mb-6 leading-[1.1] tracking-tight text-white italic">
                      YOUR CAREER ORBIT <br/>
                      <span className="text-primary not-italic">IS EXPANDING</span>
                    </h2>
                    
                    <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-8">
                      Based on your recent <span className="text-white font-medium">GitHub commits</span> and <span className="text-white font-medium">mock interview sentiment</span>, your readiness score has increased by <span className="text-emerald-500 font-bold">+12%</span> this week.
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                        <CheckCircle size={14} className="text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Technical Alignment: High</span>
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                        <CheckCircle size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Interview Depth: 8.4/10</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Quick Stats */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                  <div className="bento-item p-8 flex-grow flex flex-col justify-between group">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                        <Cpu size={14} className="text-primary" /> Skill DNA Match
                      </h3>
                      <div className="space-y-4">
                        {skills.slice(0, 3).map((s, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                              <span className="text-slate-300">{s.name}</span>
                              <span className="text-primary">{s.level}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${s.level}%` }}
                                className="h-full bg-primary"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('skills')}
                      className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors flex items-center gap-2 group-hover:gap-3 transition-all"
                    >
                      View Full Analysis <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="bento-item p-8 bg-primary/5 border-primary/20 flex items-center justify-between group cursor-pointer" onClick={() => setActiveTab('realtime')}>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">New Roles Found</p>
                      <h4 className="text-2xl font-black text-white italic">12 MATCHES</h4>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                      <Globe size={24} />
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bento-item p-10 min-h-[600px] flex flex-col"
            >
              <div className="mb-8">
                <h3 className="text-3xl font-bold mb-2">Detailed Skill Analysis</h3>
                <p className="text-slate-400 text-sm">Visualizing your technical DNA and market alignment based on AI resume parsing.</p>
              </div>
              <div className="flex-grow">
                <SkillHeatmap skills={skills} />
              </div>
            </motion.div>
          )}

          {activeTab === 'interview' && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bento-item p-10 min-h-[600px] flex flex-col"
            >
              <MockInterview
                jobTitle={selectedJob?.title}
                company={selectedJob?.company}
              />
            </motion.div>
          )}

          {activeTab === 'realtime' && (
            <motion.div
              key="realtime"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                  <h3 className="text-3xl font-bold mb-2">Real-Time Recommendations</h3>
                  <p className="text-slate-400 text-sm">Direct matches from the global internship database based on your Skill DNA.</p>
                </div>
              </div>

              {/* Neural Search inside the tab to avoid global overlapping */}
              <div className="mb-12 flex justify-center">
                <div className="w-full max-w-3xl">
                  <NeuralSearch onSearchResults={handleSearchResults} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {suggestedJobs.length > 0 ? suggestedJobs.map((job, i) => (
                  <div key={i} className="bento-item p-6 flex flex-col gap-4 border-l-4 border-l-primary hover:border-l-emerald-500 transition-all hover:translate-y-[-4px]">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase size={20} className="text-primary" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                        {job.match || "High Match"}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-tight mb-1">{job.title}</h4>
                      <p className="text-sm text-slate-400">{job.company}</p>
                      <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1 uppercase font-bold tracking-tighter">
                        <Map size={10} /> {job.location || "Remote / Global"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 mt-auto pt-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(job.link || "https://google.com/search?q=" + job.title, "_blank")}
                          className="flex-grow py-2.5 rounded-lg bg-primary text-white text-[10px] font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          APPLY NOW
                        </button>
                        <button
                          onClick={() => generateRoadmapForJob(job)}
                          className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
                          title="View Preparation Roadmap"
                        >
                          <Map size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setActiveTab('interview');
                          showFeedback(`Setting up ${job.title} Mock Interview...`);
                        }}
                        className="w-full py-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles size={12} /> START MOCK INTERVIEW
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-20 text-center glass rounded-3xl border border-white/5">
                    <Loader2 className="mx-auto text-primary mb-4 animate-spin" size={32} />
                    <p className="text-slate-400">Syncing with JSearch Neural Network...</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'roadmap' && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-3xl font-bold mb-2">4-Week Cracking Roadmap</h3>
                  <p className="text-slate-400 text-sm">Your AI-generated preparation plan for <span className="text-white font-medium">{roadmap?.target || "your target role"}</span>.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(roadmap?.weeks || [
                  { week: 1, focus: "Tech Stack Mastery", tasks: ["Deep dive into React 19", "Advanced TypeScript"] },
                  { week: 2, focus: "System Architecture", tasks: ["Vector DB Integration", "Scaling API Gateway"] },
                  { week: 3, focus: "Mock Simulation", tasks: ["Voice Pitch Drill", "Logic AST Analysis"] },
                  { week: 4, focus: "Final Deployment", tasks: ["Portfolio Freeze", "Application Blast"] }
                ]).map((w: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bento-item p-6 relative overflow-hidden group border-t-2 border-t-primary/20 hover:border-t-primary transition-all"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <span className="text-6xl font-black italic">0{w.week}</span>
                    </div>

                    <div className="flex flex-col gap-1 mb-6">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">Week {w.week}</p>
                      <h4 className="font-bold text-lg leading-tight">{w.focus}</h4>
                    </div>

                    <div className="space-y-3">
                      {(w.tasks || []).map((task: string, ti: number) => (
                        <div key={ti} className="flex items-start gap-2 text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors">
                          <CheckCircle size={14} className="text-primary shrink-0 mt-0.5" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {!roadmap && (
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="text-primary" />
                    <p className="text-sm text-slate-400 italic">Showing standard track. Upload resume for a custom AI path.</p>
                  </div>
                  <button onClick={() => setActiveTab('overview')} className="text-xs font-bold text-primary underline underline-offset-4">Get Started</button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'circles' && (
            <PeerCircles />
          )}
        </AnimatePresence>

        <footer className="mt-16 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[11px] font-medium tracking-widest uppercase">
          {/* Footer content removed */}
        </footer>
      </main>

      <AIChatbot />
    </div>
  );
};

export default App;
