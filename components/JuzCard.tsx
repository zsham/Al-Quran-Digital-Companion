
import React from 'react';
import { JuzData } from '../types';

interface JuzCardProps {
  juz: JuzData;
  onClick: (juz: JuzData) => void;
}

const JuzCard: React.FC<JuzCardProps> = ({ juz, onClick }) => {
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
      
      <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center">
        Read Details
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default JuzCard;
