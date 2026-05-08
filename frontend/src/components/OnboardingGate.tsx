import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, X, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingGateProps {
  onAnalysisComplete: (data: any) => void;
  onCancel?: () => void;
}

const OnboardingGate: React.FC<OnboardingGateProps> = ({ onAnalysisComplete, onCancel }) => {
  const [status, setStatus] = useState<'upload' | 'parsing' | 'complete'>('upload');
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated progress steps during parsing
  useEffect(() => {
    if (status === 'parsing') {
      const steps = [
        { progress: 15, msg: 'Extracting text from resume...' },
        { progress: 30, msg: 'Identifying technical skills...' },
        { progress: 50, msg: 'Analyzing job history patterns...' },
        { progress: 70, msg: 'Building skill DNA profile...' },
        { progress: 85, msg: 'Searching matching opportunities...' },
        { progress: 95, msg: 'Generating personalized roadmap...' },
        { progress: 100, msg: 'Complete!' }
      ];

      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < steps.length) {
          setProgress(steps[currentIndex].progress);
          setCurrentStep(steps[currentIndex].msg);
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 600);

      return () => clearInterval(interval);
    }
  }, [status]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setStatus('parsing');
      handleAnalyze(file);
    }
  };

  const handleAnalyze = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3000/ai/resume/suggest', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Resume analysis failed');

      const apiData = await response.json();

      // Build complete data with roadmap
      const fullData = {
        ...apiData,
        profile: {
          ...apiData.profile,
          skills: apiData.profile?.skills || ['React', 'TypeScript', 'Python']
        },
        roadmap: {
          target: apiData.suggested_jobs[0]?.title || "Software Engineer",
          weeks: [
            { week: 1, focus: "Tech Stack Mastery", tasks: ["Deep dive into React 19", "Advanced TypeScript patterns"] },
            { week: 2, focus: "System Design", tasks: ["Vector DB Integration", "API Architecture"] },
            { week: 3, focus: "Mock Simulations", tasks: ["Technical drills", "Behavioral prep"] },
            { week: 4, focus: "Final Sprint", tasks: ["Portfolio polish", "Application strategy"] }
          ]
        }
      };

      // Mark resume as uploaded in localStorage
      localStorage.setItem('resumeUploaded', 'true');
      localStorage.setItem('resumeData', JSON.stringify({
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        skills: fullData.profile?.skills || []
      }));

      // Cache the job results (runs exactly once)
      localStorage.setItem('jobSearchCached', JSON.stringify({
        results: apiData.suggested_jobs || [],
        timestamp: new Date().toISOString()
      }));

      setStatus('complete');

      // Small delay before callback to show completion state
      setTimeout(() => {
        onAnalysisComplete(fullData);
      }, 1500);

    } catch (error) {
      console.error('Analysis error:', error);
      alert("AI Analysis failed. Please ensure the backend is running.");
      setStatus('upload');
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    setStatus('upload');
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Start Your Journey
          </h2>
          <p className="text-slate-400 text-sm">
            Upload your resume to unlock personalized opportunities
          </p>
        </div>

        {/* Main Card */}
        <div className="glass rounded-3xl border border-white/10 p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {/* Upload State */}
            {status === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full glass-card p-10 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/20 hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="text-primary" size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white mb-1">Drop your resume here</p>
                    <p className="text-xs text-slate-500">PDF, DOCX, or TXT (Max 10MB)</p>
                  </div>
                  <button className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
                    Browse Files <ArrowRight size={16} />
                  </button>
                </div>

                <p className="text-center text-[10px] text-slate-500 mt-6">
                  By uploading, you agree to our AI-powered analysis for personalized job matching
                </p>
              </motion.div>
            )}

            {/* Parsing State */}
            {status === 'parsing' && (
              <motion.div
                key="parsing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-8"
              >
                <div className="flex flex-col items-center gap-6">
                  {/* Animated Progress Circle */}
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="6"
                      />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="rgb(99, 102, 241)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "251.2 251.2" }}
                        animate={{ strokeDasharray: `${(progress / 100) * 251.2} 251.2` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-white">{progress}%</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Loader2 className="text-primary animate-spin" size={18} />
                      <p className="text-lg font-bold text-white">{currentStep}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      AI is analyzing your profile...
                    </p>
                  </div>

                  {/* Progress Steps */}
                  <div className="w-full space-y-2">
                    {['Extracting Skills', 'Analyzing Experience', 'Finding Matches'].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${progress > (i + 1) * 30 ? 'bg-emerald-500' : 'bg-white/10'}`}>
                          {progress > (i + 1) * 30 && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <span className={`text-xs ${progress > (i + 1) * 30 ? 'text-white' : 'text-slate-500'}`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Complete State */}
            {status === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                >
                  <CheckCircle className="text-emerald-500" size={48} />
                </motion.div>
                <p className="text-lg font-bold text-white">Analysis Complete!</p>
                <p className="text-sm text-slate-400 text-center">
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reset Button (only in upload state) */}
          {status === 'upload' && fileName && (
            <button
              onClick={handleReset}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X size={18} className="text-slate-400" />
            </button>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-600 mt-8">
          Powered by Gemini AI • Your data is secure
        </p>
      </motion.div>
    </div>
  );
};

export default OnboardingGate;
