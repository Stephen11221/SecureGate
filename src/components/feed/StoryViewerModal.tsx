import React, { useEffect, useState } from 'react';
import { Story } from '../../types';
import { X, ShieldAlert, ArrowLeft, ArrowRight, Share2, Check } from 'lucide-react';

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(c => c + 1);
            return 0;
          } else {
            clearInterval(interval);
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(c => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
      setProgress(0);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`https://securegate.co.ke/intel/story/${currentStory.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Progress bars header */}
        <div className="p-4 pb-2 bg-slate-950/80 border-b border-slate-800">
          <div className="flex gap-1.5 mb-3">
            {stories.map((s, idx) => (
              <div key={s.id} className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-100"
                  style={{
                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentStory.author.avatar}
                alt={currentStory.author.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-emerald-500/50"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{currentStory.author.name}</span>
                  {currentStory.isOfficialKeCERT && (
                    <span className="text-[10px] font-mono text-emerald-400 border border-emerald-800/80 bg-emerald-950/80 px-1.5 py-0.2 rounded">
                      KeCERT
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {currentStory.author.handle} · {currentStory.timestamp}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyShareLink}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Share encrypted intel link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Story Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {currentStory.image && (
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img
                src={currentStory.image}
                alt={currentStory.title}
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-mono uppercase tracking-wider font-semibold">
              {currentStory.type.replace('_', ' ')}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Cryptographically Verified</span>
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight">{currentStory.title}</h3>

          <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs text-slate-300 leading-relaxed font-sans">
            {currentStory.fullContent}
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              Kenya Infosec Classification: AMBER-RESTRICTED
            </span>
            <span>254-INTEL-MESH</span>
          </div>
        </div>

        {/* Navigation bottom bar */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors disabled:opacity-30 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-mono text-slate-500">
            {currentIndex + 1} / {stories.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer"
          >
            <span>{currentIndex === stories.length - 1 ? 'Finish' : 'Next'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
