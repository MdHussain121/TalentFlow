import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, Loader2, X } from 'lucide-react';

interface ResumeUploadProps {
  onUpload: (data: any) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUpload }) => {
  const [status, setStatus] = useState<'idle' | 'selected' | 'uploading' | 'complete'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setStatus('selected');
    }
  };

  const handleAnalyze = async () => {
    if (!fileInputRef.current?.files?.[0]) return;
    const file = fileInputRef.current.files[0];
    setStatus('uploading');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Connect to Live AI Engine for Resume Analysis
      const response = await fetch('http://localhost:3000/ai/resume/suggest', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Resume Sync Failed');
      
      const data = await response.json();
      
      // Augment with roadmap logic (mock roadmap for now)
      const fullData = {
        ...data,
        roadmap: {
          target: data.suggested_jobs[0]?.title || "Software Engineer",
          weeks: [
            { week: 1, focus: "Advanced Tech Stack", tasks: ["Deep dive into internals", "Project scaffolding"] },
            { week: 2, focus: "System Design", tasks: ["Architecture patterns", "Scalability focus"] },
            { week: 3, focus: "Mock Drills", tasks: ["Technical rounds", "Behavioral prep"] },
            { week: 4, focus: "Final Sprint", tasks: ["Portfolio review", "Applying strategy"] }
          ]
        }
      };

      setStatus('complete');
      onUpload(fullData);
    } catch (error) {
      console.error(error);
      setStatus('idle');
      alert("API Sync Failed. Please ensure your backend is running.");
    }
  };

  const reset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    setStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.docx,.txt"
      />
      
      <div 
        onClick={() => status === 'idle' && fileInputRef.current?.click()}
        className={`w-full glass-card p-6 flex flex-col items-center justify-center gap-3 border-dashed border-2 transition-all group ${status === 'idle' ? 'border-white/20 hover:border-primary/50 cursor-pointer' : 'border-primary/30'}`}
      >
        {status === 'idle' && (
          <>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="text-primary" size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">Select Resume File</p>
              <p className="text-[10px] text-slate-500 mt-1">PDF, DOCX, or TXT</p>
            </div>
          </>
        )}

        {status === 'selected' && (
          <>
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 w-full relative">
              <FileText className="text-primary" size={20} />
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate pr-6">{fileName}</p>
                <p className="text-[10px] text-slate-500">Ready for AI Analysis</p>
              </div>
              <button onClick={reset} className="absolute right-3 p-1 hover:bg-white/10 rounded-full">
                <X size={14} className="text-slate-500" />
              </button>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
              className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all mt-2"
            >
              Analyze with Live AI
            </button>
          </>
        )}

        {status === 'uploading' && (
          <div className="py-4 flex flex-col items-center gap-3">
            <Loader2 className="text-primary animate-spin" size={32} />
            <div className="text-center">
              <p className="text-sm font-bold text-primary">Neural Syncing with Gemini 2.0</p>
              <p className="text-[10px] text-slate-500 mt-1">Fetching real-time internships via JSearch API...</p>
            </div>
          </div>
        )}

        {status === 'complete' && (
          <div className="py-4 flex flex-col items-center gap-3">
            <CheckCircle2 className="text-emerald-500" size={32} />
            <p className="text-sm font-bold text-emerald-500">Analysis Complete!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
