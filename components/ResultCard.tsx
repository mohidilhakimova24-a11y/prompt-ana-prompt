import React, { useState, useEffect } from 'react';
import { OptimizedVariant } from '../types';
import { Copy, Check, Sparkles, Pencil, Save, ArrowUp, Plus } from 'lucide-react';

interface ResultCardProps {
  variant: OptimizedVariant;
  index: number;
  onReplace: (content: string) => void;
  onAppend: (content: string) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ variant, index, onReplace, onAppend }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(variant.content);

  useEffect(() => {
    setContent(variant.content);
  }, [variant.content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-lg group flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500/20 text-indigo-300 p-1.5 rounded-lg">
            <Sparkles size={16} />
          </div>
          <h3 className="font-semibold text-slate-200">{variant.title}</h3>
        </div>
        <div className="flex gap-2">
            {variant.tags.map(tag => (
                <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full bg-slate-700 text-slate-400">
                    {tag}
                </span>
            ))}
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="relative flex-grow group/textarea">
          <textarea 
            readOnly={!isEditing}
            className={`w-full h-48 rounded-lg p-4 pr-14 text-sm font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 border transition-colors duration-200 ${
              isEditing 
                ? 'bg-slate-900 text-slate-100 border-indigo-500/50 ring-indigo-500/20' 
                : 'bg-slate-900/50 text-slate-300 border-slate-800 focus:ring-indigo-500/50'
            }`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-200 ${isEditing ? 'opacity-100' : 'opacity-0 group-hover/textarea:opacity-100 focus-within:opacity-100'}`}>
            {/* Replace Button */}
            <button 
              onClick={() => onReplace(content)}
              className="p-2 bg-slate-700 hover:bg-indigo-600 text-white rounded-md transition-colors shadow-lg"
              title="Almashtirish (Replace)"
            >
              <ArrowUp size={16} />
            </button>

             {/* Append Button */}
             <button 
              onClick={() => onAppend(content)}
              className="p-2 bg-slate-700 hover:bg-emerald-600 text-white rounded-md transition-colors shadow-lg"
              title="Qo'shish (Append)"
            >
              <Plus size={16} />
            </button>

            {/* Edit/Save Button */}
            <button 
              onClick={toggleEdit}
              className={`p-2 rounded-md transition-colors text-white shadow-lg ${
                isEditing ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-700 hover:bg-indigo-600'
              }`}
              title={isEditing ? "Saqlash" : "Tahrirlash"}
            >
              {isEditing ? <Save size={16} /> : <Pencil size={16} />}
            </button>

            {/* Copy Button */}
            <button 
              onClick={handleCopy}
              className="p-2 bg-slate-700 hover:bg-indigo-600 text-white rounded-md transition-colors shadow-lg"
              title="Nusxalash"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
        
        <div className="mt-4 bg-slate-700/30 rounded-lg p-3 border border-slate-700/50">
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-indigo-400">Nima uchun bu ishlaydi: </span>
            {variant.reasoning}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;