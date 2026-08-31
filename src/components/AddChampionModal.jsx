import React, { useState, useEffect } from 'react';

const CLASS_COLORS = {
  Cosmic: { text: 'text-[#00d2ff]', border: 'border-[#00d2ff]/40', bg: 'bg-[#00d2ff]/10', glow: 'shadow-[#00d2ff]/30' },
  Tech: { text: 'text-[#0080ff]', border: 'border-[#0080ff]/40', bg: 'bg-[#0080ff]/10', glow: 'shadow-[#0080ff]/30' },
  Mutant: { text: 'text-[#ffcc00]', border: 'border-[#ffcc00]/40', bg: 'bg-[#ffcc00]/10', glow: 'shadow-[#ffcc00]/30' },
  Skill: { text: 'text-[#ff3344]', border: 'border-[#ff3344]/40', bg: 'bg-[#ff3344]/10', glow: 'shadow-[#ff3344]/30' },
  Science: { text: 'text-[#00cc66]', border: 'border-[#00cc66]/40', bg: 'bg-[#00cc66]/10', glow: 'shadow-[#00cc66]/30' },
  Mystic: { text: 'text-[#a855f7]', border: 'border-[#a855f7]/40', bg: 'bg-[#a855f7]/10', glow: 'shadow-[#a855f7]/30' },
};

export default function AddChampionModal({
  isOpen,
  champion = null,
  allChampions = [],
  onClose,
  onAdd
}) {
  if (!isOpen) return null;

  // Form State
  const [name, setName] = useState(champion?.name || '');
  const [champClass, setChampClass] = useState(champion?.class || 'Cosmic');
  const [rarity, setRarity] = useState(champion?.rarity || 7);
  const [rank, setRank] = useState(champion?.current_rank || 1);
  const [awakened, setAwakened] = useState(champion?.awakened || false);
  const [sigLevel, setSigLevel] = useState(champion?.signature_level || 0);
  const [notes, setNotes] = useState('');
  
  const [searchQuery, setSearchQuery] = useState(champion?.name || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync with initial champion prop
  useEffect(() => {
    if (champion) {
      setName(champion.name || '');
      setSearchQuery(champion.name || '');
      setChampClass(champion.class || 'Cosmic');
      setRarity(champion.rarity || 7);
      setRank(champion.current_rank || 1);
      setAwakened(!!champion.awakened);
      setSigLevel(champion.signature_level || 0);
    } else {
      setName('');
      setSearchQuery('');
      setChampClass('Cosmic');
      setRarity(7);
      setRank(1);
      setAwakened(false);
      setSigLevel(0);
    }
  }, [champion, isOpen]);

  // Autocomplete matching
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setName(val);
    if (val.trim().length >= 2) {
      const matches = allChampions
        .filter(c => c.name.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (c) => {
    setName(c.name);
    setSearchQuery(c.name);
    setChampClass(c.class);
    setSuggestions([]);
  };

  // Find image for live preview
  const matchedChamp = allChampions.find(c => c.name.toLowerCase() === name.toLowerCase()) || champion;
  const portraitUrl = matchedChamp?.image || `/images/classes/${champClass.toLowerCase()}.svg`;
  const clsStyle = CLASS_COLORS[champClass] || CLASS_COLORS.Cosmic;

  // Max Rank allowed based on rarity (7★ up to R6, 1★-6★ up to R5)
  const maxRankForRarity = rarity === 7 ? 6 : 5;
  const availableRanks = Array.from({ length: maxRankForRarity }, (_, i) => i + 1);

  // Ensure selected rank is within bounds
  useEffect(() => {
    if (rank > maxRankForRarity) {
      setRank(maxRankForRarity);
    }
  }, [rarity, maxRankForRarity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onAdd({
        champion_name: name.trim(),
        champion_class: champClass,
        rarity,
        current_rank: rank,
        awakened,
        signature_level: awakened ? parseInt(sigLevel) || 0 : 0,
        user_notes: notes.trim()
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md font-aldrich">
      <div className="bg-[#121215] border-2 border-[#2e2e38] max-w-2xl w-full p-6 sm:p-8 relative shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden">
        
        {/* Top Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#24242c] mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-brand-yellow/10 border border-brand-yellow/40 rounded-full flex items-center justify-center text-brand-yellow">
              <i className="fa-solid fa-shield-halved text-base"></i>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wider">
                ADD CHAMPION TO ROSTER
              </h3>
              <p className="text-[10px] text-gray-400 font-inter">
                Configure your owned champion rating, current rank, and awakening signature.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full bg-[#1c1c22] transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Main Content Grid: Left Controls + Right Live HUD Preview */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* LEFT 2 COLUMNS: Tactical Controls */}
            <div className="md:col-span-2 space-y-5">
              
              {/* 1. Champion Name / Autocomplete */}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex justify-between items-center">
                  <span>CHAMPION NAME:</span>
                  <span className={`text-[10px] uppercase font-bold ${clsStyle.text}`}>
                    ● {champClass}
                  </span>
                </label>
                
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Type name (e.g. Hercules, Doom, CGR)..."
                    className="w-full bg-[#1a1a20] border border-[#33333d] focus:border-brand-yellow px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                    autoFocus={!champion}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(''); setName(''); }}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white text-xs"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  )}
                </div>

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-[#181820] border border-brand-yellow/50 shadow-2xl z-30 max-h-48 overflow-y-auto">
                    {suggestions.map((s) => (
                      <div
                        key={s.name}
                        onClick={() => handleSelectSuggestion(s)}
                        className="px-3 py-2 text-xs text-gray-200 hover:bg-[#252532] hover:text-brand-yellow cursor-pointer flex items-center justify-between border-b border-[#24242c]"
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-6 h-6 object-contain"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <span className="font-bold">{s.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase">{s.class}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Rarity Rating (1★ - 7★) */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  RARITY (STAR TIER):
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7].map((star) => {
                    const isSelected = rarity === star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRarity(star)}
                        className={`py-2 text-center border font-bold text-xs sm:text-sm transition-all rounded-sm ${
                          isSelected
                            ? 'bg-brand-yellow text-brand-dark border-brand-yellow font-black shadow-[0_0_10px_rgba(225,255,0,0.4)] scale-105'
                            : 'bg-[#18181e] border-[#2c2c36] text-gray-400 hover:text-white hover:border-gray-500'
                        }`}
                      >
                        {star}★
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Current Rank */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    CURRENT OWNED RANK:
                  </label>
                  <span className="text-[10px] text-yellow-400 font-inter">
                    Set by you (Player)
                  </span>
                </div>
                <div className="flex gap-2">
                  {availableRanks.map((r) => {
                    const isSelected = rank === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRank(r)}
                        className={`flex-1 py-2 text-center border font-bold text-xs sm:text-sm transition-all rounded-sm ${
                          isSelected
                            ? 'bg-cyan-500 text-black border-cyan-400 font-black shadow-[0_0_10px_rgba(0,210,255,0.4)] scale-105'
                            : 'bg-[#18181e] border-[#2c2c36] text-gray-400 hover:text-white hover:border-gray-500'
                        }`}
                      >
                        R{r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Awakening Status & Signature Level */}
              <div className="bg-[#181820] border border-[#2c2c36] p-3.5 rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white uppercase">AWAKENING STATUS:</span>
                    <span className="text-[10px] text-gray-400 font-inter">
                      ({awakened ? 'Gold Stars' : 'Silver Stars'})
                    </span>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setAwakened(!awakened)}
                    className={`px-3 py-1 text-xs font-black uppercase tracking-wider border transition-all rounded-sm ${
                      awakened
                        ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_8px_rgba(255,200,0,0.5)]'
                        : 'bg-[#121216] border-[#3a3a44] text-gray-400 hover:text-white'
                    }`}
                  >
                    {awakened ? '★ AWAKENED' : 'UN-AWAKENED'}
                  </button>
                </div>

                {/* Signature Level (Visible when awakened) */}
                {awakened && (
                  <div className="pt-2 border-t border-[#262632] flex items-center space-x-3">
                    <label className="text-xs font-bold text-gray-300 whitespace-nowrap">
                      SIG LEVEL:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={rarity === 7 ? 200 : 200}
                      value={sigLevel}
                      onChange={(e) => setSigLevel(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="e.g. 20, 40, 200"
                      className="w-24 bg-[#121216] border border-[#3a3a46] px-2.5 py-1 text-xs text-white font-mono text-center focus:border-brand-yellow focus:outline-none"
                    />
                    
                    {/* Quick Sig Presets */}
                    <div className="flex gap-1.5 flex-1 justify-end">
                      {[20, 40, 100, 200].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSigLevel(s)}
                          className={`px-2 py-0.5 text-[10px] font-mono border ${
                            sigLevel === s
                              ? 'bg-yellow-500 text-black border-yellow-400 font-bold'
                              : 'bg-[#121216] border-[#333] text-gray-400 hover:text-white'
                          }`}
                        >
                          +{s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Live Card Preview HUD */}
            <div className="flex flex-col items-center justify-between bg-[#0e0e11] border border-[#262630] p-4 rounded-sm">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2">
                LIVE PREVIEW CARD
              </span>

              {/* Champion Card Preview */}
              <div className="w-full max-w-[170px] bg-[#16161c] border-2 border-[#333342] p-2.5 text-center relative shadow-lg">
                
                {/* Class & Tier Pill */}
                <div className="flex justify-between items-center text-[9px] font-bold mb-1.5 px-1">
                  <span className={clsStyle.text}>{champClass}</span>
                  <span className="text-gray-400">R{rank}</span>
                </div>

                {/* Champion Portrait */}
                <div className="w-24 h-24 mx-auto bg-[#1e1e26] border border-[#2e2e38] p-1 mb-2 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={portraitUrl}
                    alt={name || 'Champion'}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `/images/classes/${champClass.toLowerCase()}.svg`;
                    }}
                  />
                  {awakened && (
                    <span className="absolute -top-1 -left-1 bg-yellow-400 text-black text-[7px] font-black px-1">
                      ★ AWK
                    </span>
                  )}
                </div>

                {/* Stars Strip */}
                <div className="flex justify-center items-center gap-0.5 mb-1.5">
                  {Array.from({ length: rarity }, (_, i) => (
                    <i
                      key={i}
                      className={`fa-solid fa-star text-[10px] ${
                        awakened ? 'text-yellow-400' : 'text-gray-400'
                      }`}
                    ></i>
                  ))}
                </div>

                {/* Name */}
                <h4 className="font-bold text-xs text-white truncate max-w-[150px] mx-auto">
                  {name || 'Select Champion'}
                </h4>

                {/* Rank & Sig spec badge */}
                <div className="mt-2 text-[10px] font-mono bg-[#111116] border border-[#2c2c38] py-1 text-gray-300">
                  <span>R{rank}</span>
                  {awakened && sigLevel > 0 && (
                    <span className="text-yellow-400 ml-1.5">• S{sigLevel}</span>
                  )}
                </div>

              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full mt-4 bg-brand-yellow text-brand-dark font-black py-3 text-xs tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(225,255,0,0.3)]"
              >
                {loading ? (
                  <span>SAVING TO ROSTER...</span>
                ) : (
                  <>
                    <i className="fa-solid fa-plus text-sm"></i>
                    <span>CONFIRM & ADD TO ROSTER</span>
                  </>
                )}
              </button>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
