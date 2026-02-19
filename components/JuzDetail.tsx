
import React, { useEffect, useState, useRef } from 'react';
import { JuzData, InsightState, Verse, ReadingState } from '../types';
import { getJuzSummary, translateVerse } from '../services/geminiService';

interface JuzDetailProps {
  juz: JuzData | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
}

type TabType = 'quran' | 'insights';

const LANGUAGES = [
  { code: 'English', name: 'English' },
  { code: 'Malay', name: 'Bahasa Melayu' },
  { code: 'Indonesian', name: 'Bahasa Indonesia' },
  { code: 'French', name: 'Français' },
  { code: 'Turkish', name: 'Türkçe' },
  { code: 'Urdu', name: 'اردو' },
];

const JuzDetail: React.FC<JuzDetailProps> = ({ 
  juz, 
  onClose, 
  isBookmarked, 
  onToggleBookmark,
  isLiked,
  onToggleLike
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('quran');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [insight, setInsight] = useState<InsightState>({
    loading: false,
    content: '',
    error: null
  });
  const [reading, setReading] = useState<ReadingState>({
    loading: false,
    verses: [],
    error: null
  });

  // Local state for translations: { [ayahNumber]: { text, loading } }
  const [verseTranslations, setVerseTranslations] = useState<Record<number, { text: string; loading: boolean }>>({});

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (juz) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setActiveTab('quran');
      setVerseTranslations({});
      
      const fetchInsight = async () => {
        setInsight({ loading: true, content: '', error: null });
        try {
          const summary = await getJuzSummary(juz.id, juz.name);
          setInsight({ loading: false, content: summary, error: null });
        } catch (err) {
          setInsight({ loading: false, content: '', error: 'Failed to load AI insights.' });
        }
      };

      const fetchVerses = async () => {
        setReading({ loading: true, verses: [], error: null });
        try {
          const response = await fetch(`https://api.alquran.cloud/v1/juz/${juz.id}/quran-simple`);
          const data = await response.json();
          if (data.code === 200) {
            setReading({ loading: false, verses: data.data.ayahs, error: null });
          } else {
            throw new Error('API Error');
          }
        } catch (err) {
          setReading({ loading: false, verses: [], error: 'Failed to load Quran text. Please check your connection.' });
        }
      };

      fetchInsight();
      fetchVerses();
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

  const handleTranslate = async (ayahNumber: number, text: string) => {
    // If already translating or translated, don't do anything
    if (verseTranslations[ayahNumber]?.loading) return;

    setVerseTranslations(prev => ({
      ...prev,
      [ayahNumber]: { text: prev[ayahNumber]?.text || '', loading: true }
    }));

    const result = await translateVerse(text, targetLanguage);

    setVerseTranslations(prev => ({
      ...prev,
      [ayahNumber]: { text: result, loading: false }
    }));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!juz) return null;

  const totalLikes = juz.baseLikes + (isLiked ? 1 : 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-md overflow-hidden">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[95vh]">
        
        {/* Header Section */}
        <div className="relative shrink-0 h-32 sm:h-40 bg-emerald-800 bg-islamic-pattern p-6 flex flex-col justify-end shadow-md">
          <div className="absolute top-4 right-4 flex space-x-2 z-10">
            <button 
              onClick={() => onToggleLike(juz.id)}
              className={`p-2.5 rounded-full transition-all active:scale-90 shadow-sm flex items-center space-x-1 ${isLiked ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              title="Like this Juz"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs font-bold">{totalLikes.toLocaleString()}</span>
            </button>
            <button 
              onClick={() => onToggleBookmark(juz.id)}
              className={`p-2.5 rounded-full transition-all active:scale-90 shadow-sm ${isBookmarked ? 'bg-amber-400 text-emerald-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button 
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                onClose();
              }}
              className="text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex justify-between items-end relative z-0">
            <div>
              <span className="text-emerald-300 text-xs font-bold uppercase tracking-widest bg-emerald-900/50 px-2 py-0.5 rounded shadow-inner">Juz {juz.id}</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 drop-shadow-sm">{juz.name}</h2>
            </div>
            <div className="text-5xl sm:text-6xl arabic-font text-white/30 mb-[-0.5rem] select-none pointer-events-none">{juz.arabicName}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 flex justify-between items-center shrink-0 overflow-x-auto">
          <div className="flex space-x-1 sm:space-x-6">
            <button 
              onClick={() => setActiveTab('quran')}
              className={`px-4 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center space-x-2 ${activeTab === 'quran' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <span className="text-lg">📖</span>
              <span>Quran</span>
            </button>
            <button 
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center space-x-2 ${activeTab === 'insights' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <span className="text-lg">✨</span>
              <span>AI Insights</span>
            </button>
          </div>

          {activeTab === 'quran' && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100 mr-2">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Translate to:</span>
              <select 
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="bg-transparent text-xs font-bold text-emerald-800 outline-none cursor-pointer"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="flex-grow overflow-y-auto bg-white relative">
          {activeTab === 'quran' && (
            <div className="flex flex-col min-h-full">
              <div className="sticky top-0 z-20 bg-emerald-50/95 backdrop-blur-sm border-b border-emerald-100 p-4 sm:p-5 shadow-sm">
                <audio 
                  ref={audioRef}
                  src={juz.link}
                  onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                  onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                  onEnded={() => setIsPlaying(false)}
                />

                <div className="max-w-2xl mx-auto flex items-center space-x-4 sm:space-x-6">
                  <button 
                    onClick={togglePlay}
                    className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all active:scale-90"
                  >
                    {isPlaying ? (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    ) : (
                      <svg className="h-6 w-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                  </button>

                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-tighter">Audio Recitation</span>
                       {isPlaying && (
                        <div className="flex items-end space-x-0.5 h-2.5">
                          <div className="w-0.5 bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-0.5 bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-0.5 bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                       )}
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (audioRef.current) audioRef.current.currentTime = val;
                        setCurrentTime(val);
                      }}
                      className="w-full h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-emerald-600/70 mt-1 uppercase">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-8 pt-4">
                {reading.loading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium italic">Opening the Book of Allah...</p>
                  </div>
                ) : reading.error ? (
                  <div className="bg-red-50 p-6 rounded-2xl text-red-600 text-center mx-auto max-w-md border border-red-100">
                    <p className="font-medium">{reading.error}</p>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto space-y-8">
                    {reading.verses.map((ayah, index) => (
                      <div key={index} className="group flex flex-col items-end border-b border-slate-50 pb-8 last:border-0 hover:bg-slate-50/30 transition-all px-4 py-4 rounded-2xl">
                        <div className="w-full flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-700 rounded-full font-bold text-[10px] shadow-sm border border-emerald-200">
                              {ayah.numberInSurah}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {ayah.surah.englishName}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                               onClick={() => handleTranslate(ayah.number, ayah.text)}
                               className={`p-1.5 rounded-lg transition-all flex items-center space-x-1 ${verseTranslations[ayah.number]?.text ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                               title="Translate Ayah"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                              </svg>
                              <span className="text-[9px] font-bold uppercase">Translate</span>
                            </button>
                            <button 
                               onClick={() => {
                                 navigator.clipboard.writeText(ayah.text);
                               }}
                               className="p-1.5 hover:bg-emerald-50 rounded-lg text-slate-400 hover:text-emerald-600 transition-all"
                               title="Copy Ayah"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="w-full mb-3" dir="rtl">
                          <p className="arabic-font text-2xl sm:text-3xl text-slate-800 leading-[2.2] antialiased text-right">
                            {ayah.text}
                          </p>
                        </div>

                        {/* Translation Display */}
                        {(verseTranslations[ayah.number]?.text || verseTranslations[ayah.number]?.loading) && (
                          <div className="w-full bg-slate-50/80 p-4 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                            {verseTranslations[ayah.number]?.loading ? (
                              <div className="flex items-center space-x-2 text-slate-400">
                                <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs italic">AI Translating to {targetLanguage}...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-emerald-600 uppercase mb-1">{targetLanguage} Translation</span>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                  {verseTranslations[ayah.number]?.text}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="p-4 sm:p-8 max-w-3xl mx-auto">
              {insight.loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-slate-400 text-sm font-medium italic animate-pulse">Gemini is reflecting on this Juz...</p>
                </div>
              ) : insight.error ? (
                <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center italic">
                  {insight.error}
                </div>
              ) : (
                <div className="bg-emerald-50/40 p-6 sm:p-10 rounded-3xl border border-emerald-100/50 shadow-inner">
                  <div className="prose prose-emerald max-w-none text-slate-700 leading-relaxed text-base whitespace-pre-wrap">
                    {insight.content}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Persistent Footer */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-100 flex items-center justify-between shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
          <div className="hidden sm:block">
            <p className="text-xs font-extrabold text-slate-300 uppercase tracking-widest mb-0.5">Coverage</p>
            <p className="text-sm font-bold text-slate-600">{juz.startSurah} — {juz.endSurah}</p>
          </div>
          <button 
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              onClose();
            }}
            className="w-full sm:w-auto px-12 py-3.5 bg-slate-900 hover:bg-emerald-950 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default JuzDetail;
