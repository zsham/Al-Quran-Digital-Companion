
import React, { useEffect, useState } from 'react';

interface HeaderProps {
  activeView: 'all' | 'bookmarks';
  onNavigate: (view: 'all' | 'bookmarks') => void;
  onFindClick: () => void;
  bookmarkCount: number;
  isFollowing: boolean;
  onToggleFollow: () => void;
  followersCount: number;
}

const Header: React.FC<HeaderProps> = ({ 
  activeView, 
  onNavigate, 
  onFindClick, 
  bookmarkCount,
  isFollowing,
  onToggleFollow,
  followersCount
}) => {
  const [hasOwnKey, setHasOwnKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasOwnKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasOwnKey(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-emerald-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div 
          className="flex items-center space-x-3 mb-4 md:mb-0 cursor-pointer group"
          onClick={() => onNavigate('all')}
        >
          <div className="bg-amber-400 p-2 rounded-lg shadow-inner group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Al-Quran Companion</h1>
            <p className="text-xs text-emerald-200 uppercase tracking-widest">By Pablo84Studio</p>
          </div>
        </div>
        
        <nav className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm font-medium">
          <div className="flex space-x-6 items-center">
            <button 
              onClick={() => onNavigate('all')}
              className={`transition-colors py-2 border-b-2 ${activeView === 'all' ? 'text-amber-400 border-amber-400' : 'text-emerald-100 border-transparent hover:text-white'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('bookmarks')}
              className={`transition-colors py-2 border-b-2 flex items-center space-x-2 ${activeView === 'bookmarks' ? 'text-amber-400 border-amber-400' : 'text-emerald-100 border-transparent hover:text-white'}`}
            >
              <span>Bookmarks</span>
              {bookmarkCount > 0 && (
                <span className="bg-amber-500 text-emerald-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {bookmarkCount}
                </span>
              )}
            </button>
            <button 
              onClick={handleSelectKey}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full border transition-all ${hasOwnKey ? 'border-emerald-600 bg-emerald-800 text-emerald-200' : 'border-amber-400 text-amber-400 hover:bg-amber-400/10'}`}
              title="Use your own API key to avoid rate limits"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] font-bold uppercase">{hasOwnKey ? 'Key Active' : 'Select API Key'}</span>
            </button>
          </div>

          <div className="h-8 w-px bg-emerald-800 hidden md:block"></div>

          <div className="flex items-center space-x-3 bg-emerald-950/50 px-3 py-1.5 rounded-full border border-emerald-800">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-emerald-400 leading-none">FOLLOWERS</span>
              <span className="text-xs font-bold text-amber-400 leading-none">{followersCount.toLocaleString()}</span>
            </div>
            <button 
              onClick={onToggleFollow}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
                isFollowing 
                  ? 'bg-emerald-800 text-emerald-300 border border-emerald-700' 
                  : 'bg-amber-400 text-emerald-900 hover:bg-amber-300'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
