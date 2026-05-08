import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ChevronRight, 
  MessageSquare, 
  Loader2, 
  Trophy, 
  AlertCircle,
  HelpCircle
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
}

const MockInterview: React.FC<MockInterviewProps> = ({ 
  jobTitle = "Software Engineer", 
  company = "a tech company",
  onComplete 
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(-1); // -1 = loading/intro
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInterview = async () => {
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

  const calculateResults = () => {
    let finalScore = 0;
    questions.forEach(q => {
      if (q.type === 'mcq') {
        if (answers[q.id] === q.correct_answer) finalScore += 15;
      } else if (q.type === 'short') {
        const ans = (answers[q.id] || "").toLowerCase();
        const keywords = q.ideal_keywords || [];
        const matches = keywords.filter(k => ans.includes(k.toLowerCase()));
        finalScore += (matches.length / Math.max(1, keywords.length)) * 15;
      } else {
        // Long answer - basic length check for simulation
        if ((answers[q.id] || "").length > 50) finalScore += 25;
      }
    });
    setScore(Math.round(finalScore));
    setIsFinished(true);
    if (onComplete) onComplete(Math.round(finalScore));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-sm font-medium">Generating {jobTitle} Interview Questions...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="text-primary mb-4" size={48} />
        <h3 className="text-lg font-bold mb-2">Generation Failed</h3>
        <p className="text-sm text-slate-400 mb-6 max-w-xs">{error || "We couldn't generate questions for this role."}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 rounded-xl bg-primary text-white text-xs font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-10 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
          <Trophy className="text-emerald-500" size={40} />
        </div>
        <h3 className="text-2xl font-bold mb-2">Interview Complete!</h3>
        <p className="text-slate-400 mb-8 max-w-xs mx-auto">
          Your readiness for the {jobTitle} role at {company} has been calculated.
        </p>
        <div className="text-6xl font-black text-primary mb-8">{score}%</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          Return to Dashboard
        </button>
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
