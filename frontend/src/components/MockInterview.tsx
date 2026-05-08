import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ChevronRight, 
  MessageSquare, 
  Loader2, 
  Trophy, 
  AlertCircle,
  HelpCircle,
  Briefcase,
  Zap,
  Cpu
} from 'lucide-react';

interface Question {
  id: number;
  type: 'mcq' | 'short' | 'long';
  question: string;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
  ideal_keywords?: string[];
  evaluation_criteria?: string;
}

interface MockInterviewProps {
  jobTitle?: string;
  company?: string;
  onComplete?: (score: number) => void;
  onReturn?: () => void;
}

const MockInterview: React.FC<MockInterviewProps> = ({ 
  jobTitle, 
  company,
  onComplete,
  onReturn
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(-1); // -1 = loading/intro
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobTitle || !company) return;

    const loadInterview = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/interview/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: jobTitle, company })
        });
        const data = await response.json();
        if (data.questions) {
          setQuestions(data.questions);
          setCurrentIdx(0);
        } else if (data.error) {
          setError(data.error);
        }
      } catch (error) {
        console.error("Failed to load interview", error);
        setError("Network error. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };
    loadInterview();
  }, [jobTitle, company]);

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [questions[currentIdx].id]: answer });
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      calculateResults();
    }
  };

  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const calculateResults = async () => {
    setIsEvaluating(true);
    try {
      const response = await fetch('http://localhost:8000/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions, answers })
      });
      const data = await response.json();
      setEvaluation(data);
      setScore(data.total_score || 0);
      setIsFinished(true);
      if (onComplete) onComplete(data.total_score || 0);
    } catch (error) {
      console.error("Evaluation failed", error);
      setError("Failed to evaluate answers. Showing basic score.");
      // Fallback basic score
      setIsFinished(true);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!jobTitle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-6 bento-item">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
          <Briefcase className="text-primary" size={32} />
        </div>
        <h3 className="text-2xl font-black text-white mb-2 italic">SELECT A TARGET ROLE</h3>
        <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto">
          To generate specialized technical questions, please select a specific role from the <span className="text-primary font-bold">Real-Time Jobs</span> section first.
        </p>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <Zap size={12} className="text-primary" /> Personalized AI Simulation Required
        </div>
      </div>
    );
  }

  if (isEvaluating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 animate-pulse border border-primary/20">
          <Cpu className="text-primary" size={40} />
        </div>
        <h3 className="text-2xl font-black text-white italic mb-2 tracking-tighter">NEURAL EVALUATION IN PROGRESS...</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">TalentFlow AI is cross-referencing your answers with {jobTitle} specialized criteria.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-slate-400">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 animate-pulse border border-primary/20">
          <MessageSquare className="text-primary" size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Preparing Specialized Interview</h3>
        <p className="text-sm text-slate-500 mb-8 max-w-xs text-center">
          Analyzing requirements for <span className="text-primary font-bold">{jobTitle}</span> at <span className="text-slate-300">{company}</span>...
        </p>
        <Loader2 className="animate-spin text-primary mb-4" size={32} />
        <p className="text-[10px] uppercase tracking-widest font-black opacity-50">Fetching Specialized Questions from NVIDIA Neural Engine</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Neural Link Interrupted</h3>
        <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto">
          We couldn't generate specialized questions for the <span className="text-primary font-bold">{jobTitle}</span> position at this moment.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 max-w-md w-full text-left">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <HelpCircle size={14} /> How to generate questions:
          </h4>
          <ul className="space-y-3 text-[11px] text-slate-400">
            <li className="flex gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>Ensure your <span className="text-white font-medium">NVIDIA_API_KEY</span> is correctly configured in the backend <span className="text-white font-mono">.env</span> file.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>Check if the <span className="text-white font-medium">ai-engine</span> server is running on <span className="text-white font-mono">http://localhost:8000</span>.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>Wait 60 seconds if you've hit rate limits, then click the retry button below.</span>
            </li>
          </ul>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="px-10 py-3 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          RETRY GENERATION
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-full"
      >
        <div className="flex flex-col items-center justify-center py-8 text-center shrink-0">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
            <Trophy className="text-emerald-500" size={32} />
          </div>
          <h3 className="text-3xl font-black italic mb-4 tracking-tighter">ASSESSMENT COMPLETE</h3>
          {evaluation?.overall_feedback && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mb-10 max-w-3xl mx-auto">
              <p className="text-lg text-slate-300 italic leading-relaxed">"{evaluation.overall_feedback}"</p>
            </div>
          )}
        </div>

        <div className="flex-grow overflow-y-auto pr-2 space-y-6 custom-scrollbar mb-8">
          {evaluation?.evaluations?.map((ev: any, i: number) => {
            const q = questions.find(question => question.id === ev.question_id);
            return (
              <div key={i} className="glass p-10 border-l-8 transition-all rounded-3xl" style={{ borderLeftColor: ev.status === 'Correct' ? '#10b981' : ev.status === 'Partial' ? '#f59e0b' : '#ef4444' }}>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Question {i + 1}</span>
                  <span className={`text-xs font-black px-4 py-2 rounded-lg uppercase tracking-wider ${
                    ev.status === 'Correct' ? 'bg-emerald-500/10 text-emerald-500' : 
                    ev.status === 'Partial' ? 'bg-amber-500/10 text-amber-500' : 
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {ev.status}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-8 italic leading-tight">"{q?.question}"</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Your Response</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{answers[ev.question_id] || "No response provided."}</p>
                  </div>

                  <div className="flex flex-col gap-6">
                    {ev.status !== 'Correct' && (
                      <div className="bg-red-500/5 rounded-2xl p-6 border border-red-500/10">
                        <p className="text-[10px] font-black text-red-500/70 uppercase mb-3 tracking-widest">Growth Opportunity</p>
                        <p className="text-sm text-red-200/80 leading-relaxed font-medium">{ev.mistake}</p>
                      </div>
                    )}

                    <div className="bg-emerald-500/5 rounded-2xl p-6 border border-emerald-500/10">
                      <p className="text-[10px] font-black text-emerald-500/70 uppercase mb-3 tracking-widest">Optimal Analysis</p>
                      <p className="text-sm text-emerald-100/80 leading-relaxed font-bold">{ev.correct_answer}</p>
                    </div>
                  </div>
                </div>
                
                {ev.feedback && (
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-[10px] font-black text-primary uppercase mb-2 tracking-widest">AI Coaching Tip</p>
                    <p className="text-sm text-slate-400 italic">{ev.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-white/5 flex gap-4 shrink-0">
          <button 
            onClick={() => onReturn ? onReturn() : window.location.reload()}
            className="flex-grow py-4 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            BACK TO OVERVIEW
          </button>
        </div>
      </motion.div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Question {currentIdx + 1} of {questions.length}</span>
          <h4 className="font-bold text-slate-200">Technical Assessment</h4>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-slate-400">
          {q.type.toUpperCase()}
        </div>
      </div>

      <div className="flex-grow space-y-6">
        <h3 className="text-lg font-medium leading-relaxed">{q.question}</h3>

        <div className="space-y-3">
          {q.type === 'mcq' && q.options?.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className={`w-full p-4 rounded-xl text-left text-sm border transition-all ${
                answers[q.id] === opt 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  answers[q.id] === opt ? 'bg-primary text-white' : 'bg-white/10 text-slate-500'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                {opt}
              </div>
            </button>
          ))}

          {q.type === 'short' && (
            <input 
              type="text"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your brief answer here..."
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 transition-all text-slate-200"
            />
          )}

          {q.type === 'long' && (
            <textarea 
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Explain your approach in detail..."
              rows={6}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 transition-all text-slate-200 resize-none"
            />
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <HelpCircle size={12} />
          {q.type === 'mcq' ? 'Select the most accurate option' : 'AI will analyze keywords in your response'}
        </div>
        <button 
          onClick={nextQuestion}
          disabled={!answers[q.id]}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold disabled:opacity-50 hover:gap-3 transition-all"
        >
          {currentIdx === questions.length - 1 ? 'Finish' : 'Next Question'} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default MockInterview;
