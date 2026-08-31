import React from 'react';
import ChampionCard from './ChampionCard';

const CLASS_CONFIG = [
  { name: 'Cosmic', color: 'text-[#00d2ff]', border: 'border-[#00d2ff]/40', icon: '/images/classes/cosmic.svg' },
  { name: 'Skill', color: 'text-[#ff3344]', border: 'border-[#ff3344]/40', icon: '/images/classes/skill.svg' },
  { name: 'Mutant', color: 'text-[#ffcc00]', border: 'border-[#ffcc00]/40', icon: '/images/classes/mutant.svg' },
  { name: 'Mystic', color: 'text-[#a855f7]', border: 'border-[#a855f7]/40', icon: '/images/classes/mystic.svg' },
  { name: 'Science', color: 'text-[#00cc66]', border: 'border-[#00cc66]/40', icon: '/images/classes/science.svg' },
  { name: 'Tech', color: 'text-[#0080ff]', border: 'border-[#0080ff]/40', icon: '/images/classes/tech.svg' },
  { name: 'Synergy Support', color: 'text-amber-400', border: 'border-amber-400/40', icon: '/images/Champion-star.png' },
];

export default function TierListView({
  tierData = {},
  onSelectChampion,
  onAddToRoster
}) {
  return (
    <section className="py-8 sm:py-12 bg-[#0c0c0e] min-h-[80vh]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-[#222226] mb-8">
          <div className="flex items-center space-x-2">
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 tracking-wider">
              ACT 8 & BATTLEGROUNDS META
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
              S-TIER STORY & META CHAMPIONS
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1 font-inter">
            Class-by-class breakdown of top progression champions from your dataset (Hercules, Serpent, Onslaught, Kushala, Doom, Silk, Nimrod).
          </p>
        </div>

        {/* Classes Sections */}
        <div className="space-y-10">
          {CLASS_CONFIG.map(cfg => {
            const champsInClass = tierData[cfg.name] || [];
            if (champsInClass.length === 0) return null;

            return (
              <div key={cfg.name} className="bg-[#141416] border border-[#242428] p-6">
                <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-[#222228]">
                  <img src={cfg.icon} alt={cfg.name} className="w-6 h-6 object-contain" />
                  <h3 className={`text-lg font-extrabold tracking-wider uppercase ${cfg.color}`}>
                    {cfg.name} CLASS S-TIER META
                  </h3>
                  <span className="bg-brand-yellow text-brand-dark text-[10px] font-black px-2 py-0.5">
                    {champsInClass.length} ELITE PICKS
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
                  {champsInClass.map(champ => (
                    <div
                      key={champ.name}
                      onClick={() => onSelectChampion && onSelectChampion(champ)}
                      className="bg-[#19191d] border border-[#2c2c34] hover:border-brand-yellow p-1.5 sm:p-4 text-center cursor-pointer transition-all group flex flex-col justify-between rounded-sm"
                    >
                      <div className="relative aspect-square mb-1.5 sm:mb-3 bg-[#202026] p-1 sm:p-2 flex items-center justify-center rounded-sm overflow-hidden">
                        <img
                          src={champ.image}
                          alt={champ.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = cfg.icon;
                          }}
                        />
                        <span className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 bg-red-600 text-white text-[7px] sm:text-[8px] font-black px-1 sm:px-1.5 py-0.2 rounded-xs">
                          S-TIER
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-[11px] sm:text-xs text-white group-hover:text-brand-yellow truncate mb-0.5">
                          {champ.name}
                        </h4>
                        <span className="text-[8px] sm:text-[10px] text-gray-400 font-inter hidden xs:block sm:block truncate">
                          Top Meta
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToRoster && onAddToRoster(champ);
                        }}
                        className="mt-1.5 sm:mt-3 w-full bg-[#24242c] hover:bg-brand-yellow hover:text-brand-dark text-gray-300 py-1 text-[8px] sm:text-[10px] font-bold border border-[#343440] transition-colors rounded-xs truncate flex items-center justify-center gap-1"
                      >
                        <i className="fa-solid fa-plus text-[7px] sm:text-[9px]"></i>
                        <span className="hidden xs:inline sm:inline">ADD</span>
                        <span className="xs:hidden sm:hidden">+</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
