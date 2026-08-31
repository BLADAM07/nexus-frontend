import React from 'react';

const CLASS_COLORS = {
  Cosmic: { text: 'text-[#00d2ff]', border: 'border-[#00d2ff]/40', bg: 'bg-[#00d2ff]/10', dot: 'bg-[#00d2ff]' },
  Tech: { text: 'text-[#0080ff]', border: 'border-[#0080ff]/40', bg: 'bg-[#0080ff]/10', dot: 'bg-[#0080ff]' },
  Mutant: { text: 'text-[#ffcc00]', border: 'border-[#ffcc00]/40', bg: 'bg-[#ffcc00]/10', dot: 'bg-[#ffcc00]' },
  Skill: { text: 'text-[#ff3344]', border: 'border-[#ff3344]/40', bg: 'bg-[#ff3344]/10', dot: 'bg-[#ff3344]' },
  Science: { text: 'text-[#00cc66]', border: 'border-[#00cc66]/40', bg: 'bg-[#00cc66]/10', dot: 'bg-[#00cc66]' },
  Mystic: { text: 'text-[#a855f7]', border: 'border-[#a855f7]/40', bg: 'bg-[#a855f7]/10', dot: 'bg-[#a855f7]' },
};

export default function ChampionCard({
  champion,
  onSelectChampion,
  onAddToRoster,
  isFavorite,
  onToggleFavorite
}) {
  const clsStyle = CLASS_COLORS[champion.class] || CLASS_COLORS.Cosmic;
  const isSTier = champion.tier === 'S-Tier';
  const hasImmunities = champion.immunities && champion.immunities.length > 0;

  return (
    <div className="group bg-[#141417] border border-[#24242c] hover:border-gray-500 transition-all duration-200 flex flex-col justify-between rounded-sm overflow-hidden shadow-sm">
      
      {/* Top Image Container */}
      <div className="relative bg-[#19191e] p-1.5 sm:p-4 aspect-square flex items-center justify-center overflow-hidden">
        
        {/* Champion Portrait */}
        <img
          src={champion.image}
          alt={champion.name}
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `/images/classes/${champion.class.toLowerCase()}.svg`;
          }}
        />

        {/* Top-Left Badges */}
        <div className="absolute top-1 sm:top-2.5 left-1 sm:left-2.5 flex flex-col gap-0.5 sm:gap-1 z-10 pointer-events-none">
          {isSTier && (
            <span className="bg-red-600 text-white text-[7px] sm:text-[9px] font-black px-1 sm:px-2 py-0.2 sm:py-0.5 tracking-wider shadow">
              S-TIER
            </span>
          )}
          {hasImmunities && (
            <span className="bg-brand-yellow text-brand-dark text-[7px] sm:text-[9px] font-black px-1 sm:px-2 py-0.2 sm:py-0.5 tracking-wider shadow hidden xs:inline sm:inline">
              {champion.immunities.length} IMM
            </span>
          )}
        </div>

        {/* Top-Right Star Rating */}
        <div className="absolute top-1 sm:top-2.5 right-1 sm:right-2.5 flex items-center text-[8px] sm:text-xs bg-[#121215]/90 px-1 sm:px-2 py-0.2 sm:py-0.5 rounded border border-[#333] z-10">
          <i className="fa-solid fa-star text-yellow-400 text-[7px] sm:text-[10px]"></i>
          <span className="font-bold ml-0.5 sm:ml-1 text-white">{champion.rating || '4.9'}</span>
        </div>

        {/* Quick View Button on Mobile / Hover Overlay on Desktop */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1 sm:gap-2 z-20">
          <button
            onClick={() => onSelectChampion(champion)}
            className="bg-white hover:bg-brand-yellow text-brand-dark p-1.5 sm:p-2 shadow-md rounded-full w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center transition-colors"
            title="Quick View Details"
          >
            <i className="fa-regular fa-eye text-[10px] sm:text-sm"></i>
          </button>
          
          <button
            onClick={() => onAddToRoster && onAddToRoster(champion)}
            className="bg-white hover:bg-brand-yellow text-brand-dark p-1.5 sm:p-2 shadow-md rounded-full w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center transition-colors"
            title="Add to My Owned Roster"
          >
            <i className="fa-solid fa-plus text-[10px] sm:text-sm"></i>
          </button>
        </div>

      </div>

      {/* Bottom Information Card */}
      <div className="p-1.5 sm:p-3 text-center border-t border-[#1e1e26] bg-[#131316] flex flex-col justify-between flex-1">
        <div>
          {/* Class Indicator Dot & Class Name */}
          <div className="flex items-center justify-center space-x-1 sm:space-x-1.5 mb-0.5 sm:mb-1">
            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${clsStyle.dot}`}></span>
            <span className={`text-[7px] sm:text-[10px] font-bold tracking-wider uppercase ${clsStyle.text}`}>
              {champion.class}
            </span>
          </div>

          {/* Champion Name */}
          <h4
            onClick={() => onSelectChampion(champion)}
            className="font-bold text-[10px] sm:text-sm text-white hover:text-brand-yellow cursor-pointer transition-colors truncate"
            title={champion.name}
          >
            {champion.name}
          </h4>

          {/* Prestige */}
          <p className="text-gray-400 text-[8px] sm:text-xs mt-0.5 font-inter hidden xs:block sm:block truncate">
            Prestige: <span className="text-brand-yellow font-bold">{champion.prestige?.toLocaleString() || '14,500'}</span>
          </p>
        </div>

        {/* Add to Roster Action Button */}
        <button
          onClick={() => onAddToRoster && onAddToRoster(champion)}
          className="mt-1.5 sm:mt-2.5 w-full bg-[#1c1c24] hover:bg-brand-yellow text-gray-300 hover:text-brand-dark text-[8px] sm:text-xs font-bold py-1 sm:py-1.5 border border-[#30303c] transition-colors rounded-sm flex items-center justify-center gap-1"
        >
          <i className="fa-solid fa-plus text-[7px] sm:text-xs"></i>
          <span className="hidden xs:inline sm:inline">ADD TO ROSTER</span>
          <span className="xs:hidden sm:hidden">ADD</span>
        </button>
      </div>

    </div>
  );
}
