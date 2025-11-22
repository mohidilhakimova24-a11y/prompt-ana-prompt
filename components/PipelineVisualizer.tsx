import React from 'react';
import { PipelineStage } from '../types';
import { 
  ScanSearch, 
  Wand2, 
  Layers, 
  FileJson, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';

interface PipelineVisualizerProps {
  currentStage: PipelineStage;
}

const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ currentStage }) => {
  const stages = [
    { id: 'PREPROCESSING', label: 'Qayta ishlash', icon: ScanSearch, desc: 'Imlo tekshirish va Normalizatsiya' },
    { id: 'OPTIMIZING', label: 'Asosiy Optimizator', icon: Wand2, desc: 'Takomillashtirish va Uslub' },
    { id: 'GENERATING', label: 'Versiya Yaratish', icon: Layers, desc: 'Variantlar Yaratish' },
    { id: 'FORMATTING', label: 'Formatlovchi', icon: FileJson, desc: 'Tuzilgan Natija' },
  ];

  // Helper to determine if a step is active, completed, or pending
  const getStepStatus = (stepId: string) => {
    if (currentStage === 'IDLE') return 'pending';
    if (currentStage === 'COMPLETE') return 'completed';
    if (currentStage === 'ERROR') return 'error';
    
    const stageOrder = ['PREPROCESSING', 'OPTIMIZING', 'GENERATING', 'FORMATTING'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const stepIndex = stageOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
        
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-slate-800 -z-10 transform -translate-y-8" />

        {stages.map((stage, index) => {
          const status = getStepStatus(stage.id);
          const Icon = stage.icon;

          let circleColor = "bg-slate-800 border-slate-700 text-slate-500";
          let textColor = "text-slate-500";
          let glow = "";

          if (status === 'active') {
            circleColor = "bg-indigo-600 border-indigo-400 text-white";
            textColor = "text-indigo-400";
            glow = "shadow-[0_0_20px_rgba(79,70,229,0.5)]";
          } else if (status === 'completed') {
            circleColor = "bg-emerald-600 border-emerald-400 text-white";
            textColor = "text-emerald-400";
          }

          return (
            <div key={stage.id} className="flex flex-col items-center z-10 w-full md:w-1/4">
              <div 
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 transition-all duration-500 ${circleColor} ${glow}`}
              >
                {status === 'completed' ? (
                  <CheckCircle2 size={28} />
                ) : (
                  <Icon size={28} className={status === 'active' ? 'animate-pulse' : ''} />
                )}
              </div>
              <h3 className={`font-semibold text-sm uppercase tracking-wider ${textColor}`}>
                {stage.label}
              </h3>
              <p className="text-xs text-slate-500 mt-1 text-center hidden md:block">
                {stage.desc}
              </p>
              
              {/* Mobile Arrow (between items, except last) */}
              {index < stages.length - 1 && (
                 <ArrowRight className="md:hidden my-2 text-slate-700" size={20} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineVisualizer;