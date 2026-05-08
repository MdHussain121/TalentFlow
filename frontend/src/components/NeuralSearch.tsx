import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';

interface NeuralSearchProps {
  onSearchResults: (results: any[]) => void;
}

const NeuralSearch: React.FC<NeuralSearchProps> = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions] = useState([
    "AI Internships in Bangalore",
    "Remote Frontend roles",
    "Meta Software Engineer Intern",
    "Deep Learning Research"
  ]);

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim() || isSearching) return;
    
    setIsSearching(true);
    try {
      const response = await fetch('http://localhost:3000/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      if (!response.ok) throw new Error('Search Failed');
      
      const data = await response.json();
      onSearchResults(data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (s: string) => {
    setQuery(s);
    handleSearch(s);
  };

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-xl group">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isSearching ? <Loader2 className="animate-spin text-primary" size={18} /> : <Search className="text-slate-500 group-hover:text-primary transition-colors" size={18} />}
        </div>
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="block w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-24 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-slate-600"
          placeholder="Neural Search global internships..."
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <button 
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="px-4 py-1.5 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
          >
            {isSearching ? 'SEARCHING' : 'SEARCH'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isFocused && query === '' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-3 p-4 glass rounded-2xl z-[60] flex flex-wrap gap-2 border border-white/10 shadow-2xl"
          >
            <div className="w-full mb-2 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Sparkles size={12} className="text-primary" /> Suggestions
            </div>
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => handleSuggestionClick(s)}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-slate-400 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeuralSearch;
