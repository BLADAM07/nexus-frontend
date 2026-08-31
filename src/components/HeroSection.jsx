import React from 'react';

export default function HeroSection({ onExploreClick, onSolveNodeClick, stats = {} }) {
  return (
    <section id="hero-section" className="relative py-10 sm:py-14 lg:py-16 w-full flex items-center bg-[#0d0d10] border-b border-[#222228] overflow-hidden">
      {/* Background Graphic overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-[#101014] to-black"></div>
      
      {/* Geometric background grid */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-brand-yellow text-brand-dark text-[10px] font-extrabold px-2.5 py-0.5 tracking-wider uppercase">
                APEX CONTEST DATABASE
              </span>
              <span className="text-gray-400 text-xs tracking-wider">
                OFFICIAL CHAMPION ROSTER & COUNTER SUITE
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              BE STRATEGIC. <br />
              <span className="text-brand-yellow">BE UNSTOPPABLE.</span>
            </h2>

            <p className="mt-3 text-xs sm:text-sm lg:text-base text-gray-300 max-w-xl font-inter leading-relaxed">
              Explore 328+ champions, solve complex story & war nodes across 43+ immunity types, manage your personal roster, and follow admin-customized rankup paths.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
              <button
                onClick={onExploreClick}
                className="bg-brand-yellow text-brand-dark font-extrabold py-3 px-5 sm:px-6 text-xs tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2 rounded-sm shadow-md"
              >
                <span>EXPLORE 328+ CHAMPIONS</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button
                onClick={onSolveNodeClick}
                className="bg-[#1b1b22] border border-[#383844] text-white font-bold py-3 px-5 sm:px-6 text-xs tracking-wider hover:border-brand-yellow hover:text-brand-yellow transition-colors flex items-center gap-2 rounded-sm"
              >
                <i className="fa-solid fa-shield-virus text-green-400"></i>
                <span>OPEN NODE SOLVER</span>
              </button>
            </div>
          </div>

          {/* Live Counter Badges (Desktop / Tablet) */}
          <div className="hidden sm:flex flex-row lg:flex-col gap-3 flex-shrink-0">
            <div className="bg-[#141418]/90 border border-[#2b2b34] p-3 px-6 text-left lg:text-right backdrop-blur min-w-[150px]">
              <div className="text-2xl font-black text-white">{stats.championsCount || 327}</div>
              <div className="text-[10px] text-gray-400 tracking-wider font-bold">TOTAL CHAMPIONS</div>
            </div>
            <div className="bg-[#141418]/90 border border-[#2b2b34] p-3 px-6 text-left lg:text-right backdrop-blur min-w-[150px]">
              <div className="text-2xl font-black text-brand-yellow">{stats.immunitiesCount || 43}</div>
              <div className="text-[10px] text-gray-400 tracking-wider font-bold">IMMUNITY TYPES</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
