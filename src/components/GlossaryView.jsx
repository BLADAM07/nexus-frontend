import React, { useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';

export default function GlossaryView({ glossaryList = [] }) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? glossaryList.filter(g => g.term.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase()))
    : glossaryList;

  return (
    <section className="py-8 sm:py-12 bg-[#0c0c0e] min-h-[80vh]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#222226] gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 tracking-wider rounded-sm">
                STRATEGY & MECHANICS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
                BEGINNER GUIDE & NODE GLOSSARY
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-inter">
              Master combat mechanics, node cancelers, and champion viability tips from the dataset guide.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search glossary terms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#18181c] border border-[#333] px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-yellow rounded shadow-inner"
            />
          </div>
        </div>

        {/* Premium Dataset Download Banner */}
        <div className="my-8 bg-gradient-to-r from-[#141418] to-[#0c0c0e] border border-[#2a2a30] p-5 sm:p-6 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-yellow group-hover:bg-white transition-colors duration-300"></div>
          
          <div className="flex items-center space-x-4 sm:space-x-5 z-10">
            <div className="bg-[#1a1a20] p-3 rounded-full border border-[#333] shadow-inner group-hover:border-gray-500 transition-colors">
              <FileSpreadsheet className="w-7 h-7 text-brand-yellow group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <h3 className="text-white font-extrabold tracking-widest text-sm sm:text-base uppercase drop-shadow-md">
                Complete MCOC Roster Dataset
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm font-inter mt-1 leading-relaxed">
                Download the official master Excel sheet containing tier lists, class info, and synergy data.
              </p>
            </div>
          </div>

          <a 
            href="/excle/MCOC_dataset.xlsx" 
            download
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-brand-yellow hover:bg-white text-black px-6 py-3 rounded font-black text-xs sm:text-sm tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_15px_rgba(255,255,0,0.15)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] z-10"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>DOWNLOAD .XLSX</span>
          </a>
        </div>

        {/* Glossary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => (
            <div key={idx} className="bg-[#141416] border border-[#242428] p-5 hover:border-gray-500 transition-colors">
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>
                <h4 className="font-extrabold text-sm text-white tracking-wide">
                  {item.term}
                </h4>
              </div>
              <p className="text-xs text-gray-300 font-inter leading-relaxed mb-3">
                {item.description}
              </p>
              {item.tips && (
                <div className="bg-[#1a1a20] border border-[#2c2c36] p-3 text-[11px] font-inter text-gray-300">
                  <span className="text-brand-yellow font-bold uppercase text-[10px] block mb-1">
                    Playstyle & Handling Tip:
                  </span>
                  {item.tips}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
