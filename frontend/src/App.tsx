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

  const [showOnboarding, setShowOnboarding] = useState(() => {
    const resumeExists = localStorage.getItem('resumeUploaded') === 'true';
    return !resumeExists;
  });

  const [activeTab, setActiveTab] = useState('overview');

  // Check resume status when component mounts or when navigating to dashboard
  useEffect(() => {
    if (isStarted) {
      const resumeExists = localStorage.getItem('resumeUploaded') === 'true';
      setShowOnboarding(!resumeExists);
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

    // Hide onboarding and switch to jobs tab
    setShowOnboarding(false);
    setActiveTab('realtime');
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
      const response = await fetch('http://localhost:3000/ai/roadmap/generate', {
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
          <div className="p-4 glass rounded-2xl flex items-center gap-3 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Siddharth Soni</p>
              <p className="text-[10px] text-slate-500 truncate">25ADV3ARI0222</p>
            </div>
          </div>
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
              {/* North Star Orbit Hero */}
              <div className="col-span-1 md:col-span-2 lg:col-span-8 bento-item p-10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                <div className="relative z-10 shrink-0">
                  <NorthStarOrbit progress={readinessScore} label="Market Readiness" />
                </div>
                <div className="relative z-10 flex flex-col justify-center text-center md:text-left">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4 inline-block border border-primary/20 self-center md:self-start">
                    Day-in-the-Life Simulator Active
                  </span>
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Your Career Orbit is Expanding
                  </h2>
                  <p className="text-slate-400 max-w-md mb-8">
                    Based on your recent GitHub commits and mock interview sentiment, your readiness score has increased by <span className="text-emerald-500 font-bold">+12%</span> this week.
                  </p>
                </div>
              </div>

              {/* Skill Heatmap Card */}
              <div className="col-span-1 md:col-span-1 lg:col-span-4 bento-item flex flex-col min-h-[400px]">
                <div className="p-6 border-b border-white/5">
                  <h3 className="font-bold flex items-center gap-2 text-sm">
                    <Cpu size={18} className="text-primary" /> Live Skill Heatmap
                  </h3>
                </div>
                <div className="flex-grow">
                  <SkillHeatmap skills={skills} />
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
            <motion.div
              key="circles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 glass rounded-3xl border border-white/5"
            >
              <Users className="mx-auto text-primary mb-6 opacity-20" size={64} />
              <h3 className="text-2xl font-bold mb-2">Peer Mock Circles</h3>
              <p className="text-slate-400 max-w-md mx-auto">Pairing you with candidates aiming for similar roles. Next session starts in <span className="text-white">12:40</span>.</p>
              <button className="mt-8 px-8 py-3 rounded-xl bg-primary font-bold shadow-xl shadow-primary/20">Join Waitlist</button>
            </motion.div>
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
