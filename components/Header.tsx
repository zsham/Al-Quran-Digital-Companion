
import React from 'react';

interface HeaderProps {
  activeView: 'all' | 'bookmarks';
  onNavigate: (view: 'all' | 'bookmarks') => void;
  onFindClick: () => void;
  bookmarkCount: number;
}

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate, onFindClick, bookmarkCount }) => {
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
            <p className="text-xs text-emerald-200 uppercase tracking-widest">30 Juz Digital Library</p>
          </div>
        </div>
        
        <nav className="flex space-x-6 text-sm font-medium items-center">
          <button 
            onClick={() => onNavigate('all')}
            className={`transition-colors py-2 border-b-2 ${activeView === 'all' ? 'text-amber-400 border-amber-400' : 'text-emerald-100 border-transparent hover:text-white'}`}
          >
            Home
          </button>
          <button 
            onClick={onFindClick}
            className="text-emerald-100 hover:text-white transition-colors py-2 border-b-2 border-transparent"
          >
            Find Juz
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
