import React from 'react';

export default function Footer({ onSelectClass, onNavigateTab, onOpenTerms }) {
  return (
    <footer id="footer" className="bg-[#101012] text-white border-t border-[#222226]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-14">
          
          {/* Brand Column (UX Pilot Style) */}
          <div id="footer-brand" className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo/mcoc_nexus.png"
                alt="MCOC NEXUS Emblem"
                className="w-10 h-10 object-contain rounded-full shadow-[0_0_10px_rgba(225,255,0,0.3)]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/logo.png";
                }}
              />
              <div className="flex flex-col">
                <h3 className="text-xl font-extrabold tracking-wider text-white leading-none">
                  MCOC<span className="text-brand-yellow ml-1">NEXUS</span>
                </h3>
                <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">
                  Apex Database & Suite
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-xs font-inter leading-relaxed max-w-sm">
              Your ultimate Marvel Contest of Champions companion database — champion rosters, quest node counter solvers, interactive rankup carts, and strategist coach workflows.
            </p>
            {/* Official Gmail Contact */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('mcocnexusteam@gmail.com');
                  window.open('https://mail.google.com/mail/?view=cm&fs=1&to=mcocnexusteam@gmail.com&su=MCOC%20NEXUS%20Support%20%26%20Feedback', '_blank');
                }}
                title="Click to compose email in Gmail or copy address"
                className="inline-flex items-center space-x-2.5 bg-[#17171c] hover:bg-[#1f1f26] border border-[#2c2c36] hover:border-brand-yellow/60 px-3.5 py-2 text-xs text-gray-300 hover:text-brand-yellow rounded-sm transition-all group font-inter text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-brand-yellow/10 flex items-center justify-center text-brand-yellow group-hover:bg-brand-yellow group-hover:text-brand-dark transition-colors flex-shrink-0">
                  <i className="fa-solid fa-envelope text-xs"></i>
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">OFFICIAL CONTACT</span>
                    <span className="text-[8px] bg-brand-yellow/20 text-brand-yellow px-1 rounded font-bold">GMAIL</span>
                  </div>
                  <span className="font-mono text-white group-hover:text-brand-yellow text-xs">mcocnexusteam@gmail.com</span>
                </div>
              </button>
            </div>
          </div>

          {/* Champion Classes */}
          <div id="footer-classes" className="space-y-4">
            <h4 className="font-bold text-xs tracking-wider text-gray-200 uppercase">CHAMPION CLASSES</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-inter">
              {['Cosmic', 'Tech', 'Mutant', 'Skill', 'Science', 'Mystic'].map(cls => (
                <li key={cls}>
                  <span
                    onClick={() => onSelectClass && onSelectClass(cls)}
                    className="hover:text-brand-yellow transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <img src={`/images/classes/${cls.toLowerCase()}.svg`} alt={cls} className="w-3.5 h-3.5 object-contain" />
                    <span>{cls} Champions</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Strategy */}
          <div id="footer-tools" className="space-y-4">
            <h4 className="font-bold text-xs tracking-wider text-gray-200 uppercase">TOOLS & STRATEGY</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-inter">
              <li>
                <span onClick={() => onNavigateTab('node-solver')} className="hover:text-brand-yellow transition-colors cursor-pointer flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-brand-yellow text-xs w-4"></i>
                  <span>Immunity & Node Solver</span>
                </span>
              </li>
              <li>
                <span onClick={() => onNavigateTab('upgrade-cart')} className="hover:text-brand-yellow transition-colors cursor-pointer flex items-center gap-2">
                  <i className="fa-solid fa-cart-shopping text-cyan-400 text-xs w-4"></i>
                  <span>Rankup Planner & Cart</span>
                </span>
              </li>
              <li>
                <span onClick={() => onNavigateTab('my-roster')} className="hover:text-brand-yellow transition-colors cursor-pointer flex items-center gap-2">
                  <i className="fa-solid fa-users text-green-400 text-xs w-4"></i>
                  <span>My Owned Roster</span>
                </span>
              </li>
              <li>
                <span onClick={() => onNavigateTab('tier-lists')} className="hover:text-brand-yellow transition-colors cursor-pointer flex items-center gap-2">
                  <i className="fa-solid fa-trophy text-amber-400 text-xs w-4"></i>
                  <span>S-Tier Meta Tier List</span>
                </span>
              </li>
              <li>
                <span onClick={() => onNavigateTab('duels')} className="hover:text-brand-yellow transition-colors cursor-pointer flex items-center gap-2">
                  <i className="fa-solid fa-crosshairs text-purple-400 text-xs w-4"></i>
                  <span>Duel Practice Targets</span>
                </span>
              </li>
              <li>
                <span onClick={() => onNavigateTab('glossary')} className="hover:text-brand-yellow transition-colors cursor-pointer flex items-center gap-2">
                  <i className="fa-solid fa-book-bookmark text-blue-400 text-xs w-4"></i>
                  <span>Beginner Combat Glossary</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div id="footer-bottom" className="border-t border-[#222228] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-gray-500 font-inter">
            <div className="flex flex-wrap items-center gap-6">
              <span>© 2026 MCOC NEXUS. Community project powered by player dataset.</span>
              <button
                onClick={onOpenTerms}
                className="hover:text-brand-yellow cursor-pointer underline transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={onOpenTerms}
                className="hover:text-brand-yellow cursor-pointer underline font-bold transition-colors"
              >
                Terms of Service
              </button>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-400 font-bold">
              <span>🪙 Gold</span>
              <span>•</span>
              <span>💎 Units</span>
              <span>•</span>
              <span>🏆 Glory</span>
              <span>•</span>
              <span>⚔️ Loyalty</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
