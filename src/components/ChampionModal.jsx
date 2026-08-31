import React from 'react';

const CLASS_COLORS = {
  Cosmic: { text: 'text-[#00d2ff]', border: 'border-[#00d2ff]', bg: 'bg-[#00d2ff]/10', icon: '/images/classes/cosmic.svg' },
  Tech: { text: 'text-[#0080ff]', border: 'border-[#0080ff]', bg: 'bg-[#0080ff]/10', icon: '/images/classes/tech.svg' },
  Mutant: { text: 'text-[#ffcc00]', border: 'border-[#ffcc00]', bg: 'bg-[#ffcc00]/10', icon: '/images/classes/mutant.svg' },
  Skill: { text: 'text-[#ff3344]', border: 'border-[#ff3344]', bg: 'bg-[#ff3344]/10', icon: '/images/classes/skill.svg' },
  Science: { text: 'text-[#00cc66]', border: 'border-[#00cc66]', bg: 'bg-[#00cc66]/10', icon: '/images/classes/science.svg' },
  Mystic: { text: 'text-[#a855f7]', border: 'border-[#a855f7]', bg: 'bg-[#a855f7]/10', icon: '/images/classes/mystic.svg' },
};

export default function ChampionModal({ champion, onClose, onAddToRoster }) {
  if (!champion) return null;

  const clsStyle = CLASS_COLORS[champion.class] || CLASS_COLORS.Cosmic;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="bg-[#141418] border border-[#33333d] max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg w-8 h-8 flex items-center justify-center bg-[#1e1e24] rounded-full"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#25252c]">
          
          {/* Portrait Image */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-[#1c1c22] border-2 border-[#33333d] p-2 flex-shrink-0 flex items-center justify-center relative">
            <img
              src={champion.image}
              alt={champion.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = clsStyle.icon;
              }}
            />
            {champion.tier === 'S-Tier' && (
              <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 shadow">
                S-TIER META
              </span>
            )}
          </div>

          {/* Champion Name & Class */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1">
              <img src={clsStyle.icon} alt={champion.class} className="w-4 h-4 object-contain" />
              <span className={`text-xs font-black uppercase tracking-wider ${clsStyle.text}`}>
                {champion.class} CLASS
              </span>
              <span className="bg-[#24242c] text-gray-300 text-[10px] font-bold px-2 py-0.5">
                {champion.rating || '5.0'} ★
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              {champion.name}
            </h3>

            <p className="text-xs text-gray-400 font-inter mb-4">
              Base Prestige: <strong className="text-brand-yellow">{champion.prestige?.toLocaleString() || '14,850'}</strong> | Available Rarities: <strong>7★ / 6★ / 5★</strong>
            </p>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <button
                onClick={() => {
                  onAddToRoster && onAddToRoster(champion);
                  onClose();
                }}
                className="bg-brand-yellow text-brand-dark font-extrabold px-5 py-2 text-xs tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-plus"></i>
                <span>ADD TO MY OWNED ROSTER</span>
              </button>
            </div>
          </div>
        </div>

        {/* Immunities Section */}
        <div className="py-6 border-b border-[#25252c]">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <i className="fa-solid fa-shield-virus text-green-400"></i>
            <span>COMPLETE IMMUNITY PROFILE ({champion.immunities?.length || 0})</span>
          </h4>

          {champion.immunities && champion.immunities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {champion.immunities.map((imm, idx) => (
                <span
                  key={idx}
                  className="bg-green-950/70 border border-green-500/50 text-green-300 text-xs px-3 py-1 font-bold font-inter"
                >
                  ✓ {imm}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 font-inter">
              No inherent passive immunities listed in dataset.
            </p>
          )}
        </div>

        {/* Categories Section */}
        {champion.categories && champion.categories.length > 0 && (
          <div className="py-5 border-b border-[#25252c]">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-yellow-400"></i>
              <span>DATASET CATEGORIES ({champion.categories.length})</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {champion.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="bg-[#241e12] border border-amber-500/50 text-amber-300 text-xs px-3 py-1 font-bold font-inter"
                >
                  📂 {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags Section */}
        <div className="pt-5">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <i className="fa-solid fa-tags text-cyan-400"></i>
            <span>SYNERGY, ALLIANCE WAR & TEAM BUILDER TAGS ({champion.tags?.length || 0})</span>
          </h4>

          {champion.tags && champion.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
              {champion.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#1e1e26] border border-[#333340] text-gray-200 text-xs px-3 py-1 font-inter hover:border-brand-yellow hover:text-brand-yellow transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 font-inter">
              Standard Champion Tags.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
