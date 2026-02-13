
import React, { useState } from 'react';
import { TopicStructure, QuizQuestion, QuizResult } from '../../types';
import { generateQuiz } from '../../geminiService';

interface QuizModuleProps {
  exploredTopics: TopicStructure[];
  onQuizComplete: (result: QuizResult) => void;
}

const QuizModule: React.FC<QuizModuleProps> = ({ exploredTopics, onQuizComplete }) => {
  const [selectedTopic, setSelectedTopic] = useState<TopicStructure | null>(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const startQuiz = async (topic: TopicStructure) => {
    setLoading(true);
    setSelectedTopic(topic);
    try {
      const data = await generateQuiz(topic);
      setQuestions(data);
      setCurrentIdx(0);
      setScore(0);
      setShowFeedback(null);
      setIsFinished(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (showFeedback !== null) return;
    setShowFeedback(idx);
    const correct = questions[currentIdx].correctIndex === idx;
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1);
        setShowFeedback(null);
      } else {
        setIsFinished(true);
        onQuizComplete({
          topic: selectedTopic!.topic,
          score: score + (correct ? 1 : 0),
          total: questions.length,
          timestamp: Date.now()
        });
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-8">
        <div className="h-2 w-64 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-teal-600 w-1/2 animate-pulse"></div>
        </div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-[11px] mono">Accessing Knowledge Vault...</p>
      </div>
    );
  }

  if (isFinished && selectedTopic) {
    const pct = (score / questions.length) * 100;
    return (
      <section className="bg-white p-16 text-center animate-in zoom-in duration-500 border border-slate-100 rounded-[3rem] shadow-xl">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Verification Result</h2>
        <div className="inline-block bg-teal-50 text-teal-700 font-black uppercase tracking-widest text-[11px] py-2 px-6 rounded-full mb-10 border border-teal-100">
          Rank: {pct >= 100 ? "Optimization Master" : pct >= 75 ? "Expert" : "Practitioner"}
        </div>
        <div className="text-8xl font-black text-slate-900 mb-12 tracking-tighter">
          {score}<span className="text-slate-200 text-4xl font-bold ml-2">/ {questions.length}</span>
        </div>
        <button 
          onClick={() => setSelectedTopic(null)}
          className="w-full py-6 bg-slate-900 hover:bg-teal-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-300 shadow-md"
        >
          Return to Hub
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700 max-w-4xl mx-auto">
      <section className="bg-white p-16 border border-slate-100 rounded-[3rem] shadow-sm relative overflow-hidden text-center">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Domain Verification</h2>
          <p className="text-slate-400 font-semibold italic">Validate system proficiency in extracted domains</p>
        </div>

        {exploredTopics.length === 0 ? (
          <div className="py-20 border-2 border-dashed border-slate-100 rounded-[2rem]">
            <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">No extracted domains available.</p>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-4">Research a topic in the Library first</p>
          </div>
        ) : (
          <div className="grid gap-4 text-left">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2 px-2">Ready for Verification</h3>
            {exploredTopics.map((topic, i) => (
              <button 
                key={i}
                onClick={() => startQuiz(topic)}
                className="w-full bg-slate-50/50 p-6 flex items-center justify-between group hover:border-teal-600 transition-all border border-slate-100 rounded-2xl shadow-sm"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-100">📋</div>
                  <div>
                    <h4 className="font-black text-slate-900 tracking-tight text-lg group-hover:text-teal-700">{topic.topic}</h4>
                    <p className="text-[9px] text-slate-300 uppercase font-black tracking-widest mt-1">Ready for Assessment</p>
                  </div>
                </div>
                <div className="bg-slate-900 text-white text-[10px] font-black px-6 py-2 rounded-lg uppercase tracking-widest transition-all group-hover:bg-teal-600">
                  Begin
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default QuizModule;
