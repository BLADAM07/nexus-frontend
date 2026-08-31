import React, { useState, useEffect } from 'react';
import { api } from '../api';
import ChampionCard from './ChampionCard';

const POPULAR_NODE_PRESETS = [
  { name: '☣️ Biohazard', debuffs: ['Bleed Immunity', 'Poison Immunity'], desc: 'Striking opponent causes Bleed; hitting into block causes Poison' },
  { name: '🔥 Caltrops / Flare', debuffs: ['Bleed Immunity', 'Incinerate Immunity'], desc: 'Dashing back inflicts Bleed; fight has constant Incinerate' },
  { name: '⚡ EMP Modification', debuffs: ['Shock Immunity'], desc: 'Whenever a buff expires or is nullified, defender takes Shock' },
  { name: '❄️ Cold Snap / Frostbite', debuffs: ['Coldsnap Immunity', 'Frostbite Immunity'], desc: 'Avoids evasion and deals cold damage' },
  { name: '🔄 Reverse Controls', debuffs: ['Reverse Control Immunity'], desc: 'Special attacks invert left/right dash controls' },
  { name: '⛔ Power Drain / Burn', debuffs: ['Power Drain Immunity', 'Power Burn Immunity'], desc: 'Constant power depletion from defender' },
  { name: '🛡️ Armor Break Hazard', debuffs: ['Armor Break Immunity'], desc: 'Immune to armor break and armor shatter' },
];

export default function NodeSolverView({ immunitiesList = [], onSelectChampion, onAddToRoster }) {
  const [selectedDebuffs, setSelectedDebuffs] = useState([]);
  const [matchingChamps, setMatchingChamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Solve whenever selected debuffs change
  useEffect(() => {
    if (selectedDebuffs.length === 0) {
      setMatchingChamps([]);
      return;
    }
    solve();
  }, [selectedDebuffs]);

  const solve = async () => {
    try {
      setLoading(true);
      const res = await api.solveNode(selectedDebuffs);
      setMatchingChamps(res.matching_champions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDebuff = (deb) => {
    setSelectedDebuffs(prev =>
      prev.includes(deb) ? prev.filter(d => d !== deb) : [...prev, deb]
    );
  };

  const applyPreset = (preset) => {
    setSelectedDebuffs(preset.debuffs);
  };

  const filteredChamps = searchFilter
    ? matchingChamps.filter(c => c.name.toLowerCase().includes(searchFilter.toLowerCase()))
    : matchingChamps;

  return (
    <section className="py-8 sm:py-12 bg-[#0c0c0e] min-h-[80vh]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-[#222226] mb-8">
          <div className="flex items-center space-x-2">
            <span className="bg-green-600 text-white text-[10px] font-black px-2 py-0.5 tracking-wider">
              OFFICIAL IMMUNITY MATRIX
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
              QUEST NODE COUNTER & IMMUNITY SOLVER
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1 font-inter">
            Select incoming quest debuffs and node hazards to instantly compute all 100% immune champions.
          </p>
        </div>

        {/* Node Presets */}
        <div className="bg-[#141416] border border-[#242428] p-5 mb-8">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
            POPULAR QUEST & WAR NODE PRESETS:
          </h4>
          <div className="flex flex-wrap gap-2">
            {POPULAR_NODE_PRESETS.map(p => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className="bg-[#1b1b20] hover:bg-[#282830] border border-[#333] hover:border-brand-yellow px-3 py-2 text-xs text-left transition-colors"
              >
                <div className="font-bold text-white text-xs">{p.name}</div>
                <div className="text-[10px] text-gray-400 font-inter truncate max-w-xs">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Debuff Selection Grid (43+ Immunities from Dataset) */}
        <div className="bg-[#141416] border border-[#242428] p-5 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              SELECT HAZARDS & DEBUFFS ({selectedDebuffs.length} SELECTED):
            </h4>
            {selectedDebuffs.length > 0 && (
              <button
                onClick={() => setSelectedDebuffs([])}
                className="text-xs text-red-400 hover:underline font-bold"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-2">
            {immunitiesList.map(imm => {
              const isSelected = selectedDebuffs.includes(imm.name);
              return (
                <button
                  key={imm.name}
                  onClick={() => toggleDebuff(imm.name)}
                  className={`p-2 text-left border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-green-950/60 border-green-400 text-green-200 ring-1 ring-green-400'
                      : 'bg-[#18181c] border-[#2c2c34] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <span className="truncate text-[11px] font-bold" title={imm.name}>
                    {imm.name.replace(' Immunity', '')}
                  </span>
                  <span className="text-[9px] bg-[#24242c] px-1 py-0.5 rounded text-gray-400 ml-1">
                    {imm.count || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#222226] mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>SOLVER MATCHES</span>
                <span className="bg-brand-yellow text-brand-dark text-xs font-black px-2 py-0.5">
                  {matchingChamps.length} COUNTERS FOUND
                </span>
              </h3>
              {selectedDebuffs.length > 0 && (
                <p className="text-xs text-green-400 font-inter mt-0.5">
                  Champions 100% immune to: <strong>{selectedDebuffs.join(' + ')}</strong>
                </p>
              )}
            </div>

            {matchingChamps.length > 0 && (
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter counters..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-[#18181c] border border-[#333] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400">
              <i className="fa-solid fa-circle-notch fa-spin text-3xl text-brand-yellow mb-3"></i>
              <p className="text-xs">SOLVING COMBINED IMMUNITIES...</p>
            </div>
          ) : selectedDebuffs.length === 0 ? (
            <div className="py-16 text-center bg-[#141416] border border-[#242428] p-8">
              <i className="fa-solid fa-hand-pointer text-4xl text-brand-yellow mb-3"></i>
              <h4 className="text-base font-bold text-white mb-1">Pick Debuffs or a Preset to Solve</h4>
              <p className="text-xs text-gray-400 font-inter">
                Select one or more hazards above (e.g. Bleed + Poison) to see immune champions.
              </p>
            </div>
          ) : filteredChamps.length === 0 ? (
            <div className="py-16 text-center bg-[#141416] border border-[#242428] p-8">
              <i className="fa-solid fa-triangle-exclamation text-4xl text-yellow-500 mb-3"></i>
              <h4 className="text-base font-bold text-white mb-1">No Direct Immunity Match</h4>
              <p className="text-xs text-gray-400 font-inter">
                No single champion possesses all chosen immunities simultaneously. Try reducing debuff constraints.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
              {filteredChamps.map(champ => (
                <ChampionCard
                  key={champ.id || champ.name}
                  champion={champ}
                  onSelectChampion={onSelectChampion}
                  onAddToRoster={onAddToRoster}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
