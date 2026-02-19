
import React, { useEffect, useState, useRef } from 'react';
import { JuzData, InsightState } from '../types';
import { getJuzSummary } from '../services/geminiService';

interface JuzDetailProps {
  juz: JuzData | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

const JuzDetail: React.FC<JuzDetailProps> = ({ juz, onClose, isBookmarked, onToggleBookmark }) => {
  const [insight, setInsight] = useState<InsightState>({
    loading: false,
    content: '',
    error: null
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (juz) {
      // Reset audio state when Juz changes
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      
      const fetchInsight = async () => {
        setInsight({ loading: true, content: '', error: null });
        try {
          const summary = await getJuzSummary(juz.id, juz.name);
          setInsight({ loading: false, content: summary, error: null });
        } catch (err) {
          setInsight({ loading: false, content: '', error: 'Failed to load AI insights.' });
        }
      };
      fetchInsight();
    }
  }, [juz]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!juz) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header Section */}
        <div className="relative shrink-0 h-48 bg-emerald-800 bg-islamic-pattern p-8 flex flex-col justify-end">
          <div className="absolute top-4 right-4 flex space-x-2 z-10">
            <button 
              onClick={() => onToggleBookmark(juz.id)}
              className={`p-2 rounded-full transition-colors ${isBookmarked ? 'bg-amber-400 text-emerald-900' : 'bg-white/20 text-white hover:bg-white/30'}`}
              title={isBookmarked ? "Remove from Bookmarks" : "Add to Bookmarks"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button 
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                onClose();
              }}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex justify-between items-end relative z-0">
            <div>
              <span className="text-emerald-300 text-sm font-bold uppercase tracking-widest">Juz {juz.id}</span>
              <h2 className="text-4xl font-bold text-white">{juz.name}</h2>
            </div>
            <div className="text-6xl arabic-font text-white/40 mb-[-1rem] select-none">{juz.arabicName}</div>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto flex-grow">
          {/* Audio Player Component */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-emerald-800 font-bold flex items-center">
                <span className="mr-2">🎧</span> Juz Recitation
              </h4>
              <div className="flex items-center space-x-1">
                {isPlaying && (
                  <div className="flex items-end space-x-0.5 h-4 mb-1">
                    <div className="w-1 bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {isPlaying ? 'Now Playing' : 'Paused'}
                </span>
              </div>
            </div>

            <audio 
              ref={audioRef}
              src={juz.link}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />

            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={togglePlay}
                  className="w-14 h-14 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <div className="flex-grow flex flex-col">
                  <input 
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mb-2"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Starts At</span>
              <p className="text-slate-800 font-bold">{juz.startSurah}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Ends At</span>
              <p className="text-slate-800 font-bold">{juz.endSurah}</p>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="flex items-center text-emerald-800 font-bold mb-4">
              <span className="bg-emerald-100 p-1 rounded mr-2">✨</span>
              AI Spiritual Insights
            </h4>
            
            {insight.loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative w-12 h-12">
                   <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-400 text-sm italic font-medium animate-pulse">Gemini is reflecting on this Juz...</p>
              </div>
            ) : insight.error ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm italic">
                {insight.error}
              </div>
            ) : (
              <div className="prose prose-emerald max-w-none text-slate-600 leading-relaxed text-sm whitespace-pre-wrap bg-emerald-50/30 p-6 rounded-3xl border border-emerald-100">
                {insight.content}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
          <a 
            href={juz.link}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-bold text-sm flex items-center hover:text-emerald-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download MP3
          </a>
          <button 
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              onClose();
            }}
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JuzDetail;
