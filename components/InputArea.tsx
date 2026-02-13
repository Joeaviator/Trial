
import React, { useState } from 'react';

interface InputAreaProps {
  onSuggest: (activity: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSuggest, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSuggest(input);
      setInput('');
    }
  };

  const examples = [
    "Healthy Meal Prep",
    "Smart Commute",
    "Digital Detox",
    "Fitness Routine"
  ];

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What would you like to optimize?"
          className="w-full bg-white border border-zinc-200 rounded-[2.5rem] py-7 pl-10 pr-48 focus:outline-none focus:border-[#00C2B2] transition-all shadow-sm placeholder:text-zinc-300 text-lg font-semibold text-[#1E293B] tracking-tight"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-3 top-3 bottom-3 px-10 bg-[#1E293B] hover:bg-[#00C2B2] text-white font-extrabold uppercase tracking-widest text-[11px] rounded-[2rem] transition-all duration-300 disabled:bg-zinc-100 disabled:text-zinc-400 flex items-center justify-center min-w-[150px]"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Optimize"
          )}
        </button>
      </form>
      <div className="flex flex-wrap gap-3">
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => setInput(ex)}
            className="text-[10px] bg-white hover:bg-[#00C2B2] hover:text-white border border-zinc-100 px-6 py-2.5 rounded-full text-zinc-500 font-bold uppercase tracking-widest transition-all shadow-sm"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InputArea;
