
import React from 'react';
import { JuzData } from '../types';

interface JuzCardProps {
  juz: JuzData;
  onClick: (juz: JuzData) => void;
  userLiked: boolean;
}

const JuzCard: React.FC<JuzCardProps> = ({ juz, onClick, userLiked }) => {
  const displayLikes = juz.baseLikes + (userLiked ? 1 : 0);

  return (
    <div 
      onClick={() => onClick(juz)}
      className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 bg-emerald-50 rounded-bl-3xl group-hover:bg-amber-100 transition-colors">
        <span className="text-2xl arabic-font text-emerald-800 font-bold">{juz.arabicName}</span>
      </div>
      
      <div className="mb-4">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-2">
          JUZ {juz.id}
        </span>
        <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{juz.name}</h3>
      </div>
      
      <div className="space-y-1 text-sm text-slate-500 mb-6">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/>
          </svg>
          {juz.startSurah}
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" className="opacity-0"/>
          </svg>
          to {juz.endSurah}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <button className="flex-grow py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center">
          Read Details
        </button>
        <div className="ml-4 flex items-center space-x-1 text-slate-400 group-hover:text-emerald-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${userLiked ? 'text-red-500 fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-xs font-bold">{displayLikes.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default JuzCard;
