
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Header from './components/Header';
import JuzCard from './components/JuzCard';
import JuzDetail from './components/JuzDetail';
import { JUZ_LIST } from './constants';
import { JuzData } from './types';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJuz, setSelectedJuz] = useState<JuzData | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'bookmarks'>('all');
  
  // Storage for Bookmarks
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    const saved = localStorage.getItem('quran_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Storage for User Likes
  const [userLikes, setUserLikes] = useState<number[]>(() => {
    const saved = localStorage.getItem('quran_likes');
    return saved ? JSON.parse(saved) : [];
  });

  // Storage for Follower status
  const [isFollowing, setIsFollowing] = useState<boolean>(() => {
    return localStorage.getItem('creator_following') === 'true';
  });

  // Base follower count (simulated)
  const [followersCount, setFollowersCount] = useState<number>(12450);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('quran_likes', JSON.stringify(userLikes));
  }, [userLikes]);

  useEffect(() => {
    localStorage.setItem('creator_following', String(isFollowing));
  }, [isFollowing]);

  const toggleBookmark = (id: number) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const toggleLike = (id: number) => {
    setUserLikes(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleToggleFollow = () => {
    setIsFollowing(prev => !prev);
  };

  const currentFollowers = followersCount + (isFollowing ? 1 : 0);

  const handleFindClick = () => {
    setViewMode('all');
    setTimeout(() => {
      const searchElement = document.getElementById('search-container');
      searchElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInputRef.current?.focus();
    }, 100);
  };

  const filteredJuz = useMemo(() => {
    let list = JUZ_LIST;
    
    if (viewMode === 'bookmarks') {
      list = list.filter(juz => bookmarks.includes(juz.id));
    }

    if (searchTerm) {
      list = list.filter(juz => 
        juz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        juz.id.toString() === searchTerm ||
        juz.startSurah.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return list;
  }, [searchTerm, viewMode, bookmarks]);

  const handleNavigate = (view: 'all' | 'bookmarks') => {
    setViewMode(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        activeView={viewMode} 
        onNavigate={handleNavigate}
        onFindClick={handleFindClick}
        bookmarkCount={bookmarks.length}
        isFollowing={isFollowing}
        onToggleFollow={handleToggleFollow}
        followersCount={currentFollowers}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">
            {viewMode === 'all' ? (
              <>Connect with the <span className="text-emerald-700">Holy Quran</span></>
            ) : (
              <>Your Saved <span className="text-amber-500">Bookmarks</span></>
            )}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            {viewMode === 'all' 
              ? "A comprehensive digital companion for exploring all 30 Juz of the Quran. Join thousands of users in searching, reflecting, and deepening spiritual understanding."
              : "Access your frequently visited Juz and spiritual reflections in one place."
            }
          </p>
        </section>

        {/* Search Bar */}
        <div id="search-container" className="max-w-2xl mx-auto mb-12 sticky top-24 z-40 transition-all duration-300">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              ref={searchInputRef}
              type="text"
              placeholder={viewMode === 'all' ? "Search by Juz number, name, or Surah..." : "Search your bookmarks..."}
              className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-md focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Juz Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredJuz.length > 0 ? (
            filteredJuz.map(juz => (
              <JuzCard 
                key={juz.id} 
                juz={juz} 
                onClick={(j) => setSelectedJuz(j)} 
                userLiked={userLikes.includes(juz.id)}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center animate-in fade-in zoom-in duration-500">
              <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                {viewMode === 'bookmarks' && !searchTerm ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">
                {viewMode === 'bookmarks' && !searchTerm ? "No bookmarks yet" : "No results found"}
              </h3>
              <p className="text-slate-500 mb-6">
                {viewMode === 'bookmarks' && !searchTerm 
                  ? "Click the heart icon on any Juz detail to save it here." 
                  : "Try searching for a different Juz number or Surah name."}
              </p>
              <button 
                onClick={() => {
                  if (viewMode === 'bookmarks' && !searchTerm) {
                    handleNavigate('all');
                  } else {
                    setSearchTerm('');
                  }
                }}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all"
              >
                {viewMode === 'bookmarks' && !searchTerm ? "Explore All Juz" : "Clear Search"}
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-20 border-t border-slate-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 text-white mb-2">
              <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-bold text-slate-900">Q</div>
              <span className="text-xl font-bold">Quran Digital</span>
            </div>
            <p className="text-sm">Bringing the light of the Quran to your digital life.</p>
          </div>
          <div className="text-center md:text-right space-y-2">
            <p className="text-sm">© {new Date().getFullYear()} Al-Quran Digital Companion. All rights reserved. Zurisham Yunus</p>
            <p className="text-xs">This app uses content references for educational purposes.</p>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <JuzDetail 
        juz={selectedJuz} 
        onClose={() => setSelectedJuz(null)} 
        isBookmarked={selectedJuz ? bookmarks.includes(selectedJuz.id) : false}
        onToggleBookmark={toggleBookmark}
        isLiked={selectedJuz ? userLikes.includes(selectedJuz.id) : false}
        onToggleLike={toggleLike}
      />
    </div>
  );
};

export default App;
