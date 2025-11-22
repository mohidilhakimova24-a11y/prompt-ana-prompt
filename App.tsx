import React, { useState, useRef } from 'react';
import { PromptStyle, ComplexityLevel, PipelineStage, OptimizationResult } from './types';
import { optimizePromptWithGemini } from './services/geminiService';
import PipelineVisualizer from './components/PipelineVisualizer';
import ResultCard from './components/ResultCard';
import { Sparkles, Zap, MessageSquare, AlertCircle, History, Command } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<PromptStyle>(PromptStyle.PROFESSIONAL);
  const [complexity, setComplexity] = useState<ComplexityLevel>(ComplexityLevel.MODERATE);
  
  const [status, setStatus] = useState<PipelineStage>('IDLE');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mocking the pipeline delay to show the visualizer animation properly
  // In a real streamed environment this would be event driven.
  // Here we simulate the "steps" while awaiting the single promise.
  const runPipelineSimulation = async () => {
    setStatus('PREPROCESSING');
    await new Promise(r => setTimeout(r, 800));
    
    setStatus('OPTIMIZING');
    await new Promise(r => setTimeout(r, 1000));
    
    setStatus('GENERATING');
    await new Promise(r => setTimeout(r, 800));
    
    setStatus('FORMATTING');
    await new Promise(r => setTimeout(r, 600));
  };

  const handleOptimize = async () => {
    if (!input.trim()) return;

    setError(null);
    setResult(null);
    
    // Start the API call and the simulation in parallel
    // We want the simulation to finish AT LEAST before showing results, 
    // but we don't want to wait extra if the API is slow.
    
    const apiCallPromise = optimizePromptWithGemini({
      inputPrompt: input,
      style,
      complexity
    });

    const simulationPromise = runPipelineSimulation();

    try {
        // Wait for simulation to start 'feeling' real
        await simulationPromise; 
        
        // Ensure API is done (if simulation was faster, we wait here. If API was faster, we already waited for simulation)
        const data = await apiCallPromise;
        
        setResult(data);
        setStatus('COMPLETE');
    } catch (e: any) {
        setError(e.message || "Kutilmagan xatolik yuz berdi.");
        setStatus('ERROR');
    }
  };

  const handleReplaceVariant = (content: string) => {
    setInput(content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAppendVariant = (content: string) => {
    setInput((prev) => {
      const trimmedPrev = prev.trim();
      if (!trimmedPrev) return content;
      return `${trimmedPrev}\n\n${content}`;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Command size={20} className="text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              PromptTune
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-indigo-400 transition-colors">Hujjatlar</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Andozalar</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Tarix</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-10">
        
        {/* Hero / Intro */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Promptingizni <span className="text-indigo-500">soniyalarda</span> mukammallashtiring.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            AI bilan kurashishni to'xtating. Xom g'oyangizni kiriting va bizning optimallashtirish payplaynimiz uni tuzadi, takomillashtiradi va ishlab chiqarishga tayyor promptga aylantiradi.
          </p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Input Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-xl">
              <div className="bg-slate-800/50 rounded-xl overflow-hidden">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="masalan, Kofe haqida blog post yoz..."
                  className="w-full h-64 bg-transparent p-6 text-lg text-slate-200 placeholder-slate-500 focus:outline-none resize-none"
                  disabled={status !== 'IDLE' && status !== 'COMPLETE' && status !== 'ERROR'}
                />
              </div>
              <div className="p-4 flex justify-between items-center bg-slate-900 rounded-b-xl">
                <span className="text-xs text-slate-500 font-mono">
                  {input.length} belgi
                </span>
                <button
                  onClick={handleOptimize}
                  disabled={status !== 'IDLE' && status !== 'COMPLETE' && status !== 'ERROR' || !input.trim()}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                    ${!input.trim() || (status !== 'IDLE' && status !== 'COMPLETE' && status !== 'ERROR')
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transform hover:-translate-y-0.5'
                    }
                  `}
                >
                  <Zap size={18} className={status !== 'IDLE' && status !== 'COMPLETE' && status !== 'ERROR' ? 'hidden' : ''} />
                  {status === 'IDLE' || status === 'COMPLETE' || status === 'ERROR' ? 'Promptni Optimallashtirish' : 'Qayta ishlanmoqda...'}
                </button>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles size={16} /> Konfiguratsiya
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Maqsadli Uslub
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.values(PromptStyle).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStyle(s)}
                        className={`text-left px-4 py-3 rounded-lg text-sm transition-all ${
                          style === s 
                          ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-300' 
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Murakkablik
                  </label>
                  <select 
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value as ComplexityLevel)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    {Object.values(ComplexityLevel).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-sm font-semibold text-indigo-400 mb-2">Professional Maslahat</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Murakkab kodlash vazifalari uchun model kod chiqarishdan oldin rejalashtirishi uchun "Texnik" uslub va "Chain-of-Thought" murakkabligini tanlang.
                </p>
            </div>
          </div>
        </div>

        {/* Pipeline Visualizer */}
        <div className="mb-12">
            <PipelineVisualizer currentStage={status} />
        </div>

        {/* Error Display */}
        {error && (
            <div className="mb-12 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400">
                <AlertCircle size={20} />
                <p>{error}</p>
            </div>
        )}

        {/* Results Section */}
        {result && status === 'COMPLETE' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Analysis Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Aniqlangan Maqsad</h4>
                    <p className="text-slate-200 text-lg font-medium">{result.originalAnalysis.intentDetected}</p>
                </div>
                <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-8">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Aniqlik Balli</h4>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-indigo-500 rounded-full" 
                                style={{ width: `${result.originalAnalysis.clarityScore}%` }}
                            />
                        </div>
                        <span className="text-xl font-bold text-indigo-400">{result.originalAnalysis.clarityScore}/100</span>
                    </div>
                </div>
                {result.originalAnalysis.grammarIssues.length > 0 && result.originalAnalysis.grammarIssues[0] !== 'None' && (
                    <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-8">
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Tuzatilgan Muammolar</h4>
                        <ul className="text-sm text-amber-400 list-disc list-inside">
                            {result.originalAnalysis.grammarIssues.slice(0, 2).map((issue, i) => (
                                <li key={i}>{issue}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Variants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {result.variants.map((variant, idx) => (
                <div key={idx} className="h-full">
                    <ResultCard 
                      variant={variant} 
                      index={idx} 
                      onReplace={handleReplaceVariant}
                      onAppend={handleAppendVariant}
                    />
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;