import React, { useState } from 'react';

export default function DuelPrestigeView({ duelTargets = [], onSelectChampion }) {
  const [activeSubTab, setActiveSubTab] = useState('duels');
  const [duelSearch, setDuelSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredDuels = duelSearch
    ? duelTargets.filter(d => d.champion.toLowerCase().includes(duelSearch.toLowerCase()) || d.player.toLowerCase().includes(duelSearch.toLowerCase()))
    : duelTargets;

  return (
    <section className="py-8 sm:py-12 bg-[#0c0c0e] min-h-[80vh]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#222226] mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 tracking-wider">
                COMMUNITY HUB
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
                DUEL TARGETS & PRESTIGE LEADERS
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1 font-inter">
              Practice fights against meta defenders (Serpent, Onslaught, Bullseye) and track top prestige champions.
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setActiveSubTab('duels')}
              className={`px-4 py-2 text-xs font-bold border transition-colors ${
                activeSubTab === 'duels'
                  ? 'bg-brand-yellow text-brand-dark border-brand-yellow'
                  : 'bg-[#18181c] border-[#2c2c34] text-gray-300'
              }`}
            >
              <i className="fa-solid fa-crosshairs mr-1.5"></i>
              DUEL TARGETS
            </button>
            <button
              onClick={() => setActiveSubTab('prestige')}
              className={`px-4 py-2 text-xs font-bold border transition-colors ${
                activeSubTab === 'prestige'
                  ? 'bg-brand-yellow text-brand-dark border-brand-yellow'
                  : 'bg-[#18181c] border-[#2c2c34] text-gray-300'
              }`}
            >
              <i className="fa-solid fa-chart-line mr-1.5"></i>
              PRESTIGE RANKINGS
            </button>
          </div>
        </div>

        {activeSubTab === 'duels' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                DEFENDER PRACTICE TARGETS ({filteredDuels.length})
              </h3>
              <div className="w-64">
                <input
                  type="text"
                  placeholder="Search champion or player..."
                  value={duelSearch}
                  onChange={(e) => setDuelSearch(e.target.value)}
                  className="w-full bg-[#18181c] border border-[#333] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDuels.map(d => (
                <div key={d.champion} className="bg-[#141416] border border-[#242428] p-4 flex items-center justify-between hover:border-gray-500 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-[#1a1a1e] border border-[#2e2e34] p-1 flex-shrink-0">
                      <img
                        src={d.image}
                        alt={d.champion}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `/images/classes/${d.class.toLowerCase()}.svg`;
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-brand-yellow uppercase">{d.class} • {d.stars}★</div>
                      <div className="text-sm font-bold text-white">{d.champion}</div>
                      <div className="text-xs text-gray-400 font-inter mt-0.5">
                        Target: <strong className="text-gray-200">{d.player}</strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleCopy(d.player)}
                      className="px-3 py-1.5 bg-[#1f1f26] hover:bg-brand-yellow hover:text-brand-dark text-gray-300 text-xs font-bold border border-[#343440] transition-colors"
                      title="Copy Player Name to Clipboard"
                    >
                      {copiedCode === d.player ? '✓ COPIED' : 'COPY NAME'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#141416] border border-[#242428] p-6">
            <h3 className="text-base font-bold text-white mb-4">
              TOP 7-STAR PRESTIGE CHAMPIONS (RANK 3 LEVEL 45)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#1b1b20] text-gray-400 font-bold border-b border-[#2d2d34]">
                  <tr>
                    <th className="p-3">RANK</th>
                    <th className="p-3">CHAMPION</th>
                    <th className="p-3">CLASS</th>
                    <th className="p-3">SIG 20 PRESTIGE</th>
                    <th className="p-3">SIG 200 (6★ EQUIV)</th>
                    <th className="p-3">AQ / AW SCALING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202026] text-gray-300 font-inter">
                  {[
                    { rank: 1, name: 'Serpent', class: 'Cosmic', p7: '15,890', p6: '14,950', scale: 'Tier 1' },
                    { rank: 2, name: 'Onslaught', class: 'Mutant', p7: '15,820', p6: '14,910', scale: 'Tier 1' },
                    { rank: 3, name: 'Kushala', class: 'Mystic', p7: '15,760', p6: '14,880', scale: 'Tier 1' },
                    { rank: 4, name: 'Bullseye', class: 'Skill', p7: '15,710', p6: '14,840', scale: 'Tier 1' },
                    { rank: 5, name: 'Photon', class: 'Science', p7: '15,680', p6: '14,800', scale: 'Tier 1' },
                    { rank: 6, name: 'Shuri', class: 'Tech', p7: '15,640', p6: '14,750', scale: 'Tier 1' },
                    { rank: 7, name: 'Hercules', class: 'Cosmic', p7: '15,590', p6: '14,700', scale: 'Tier 1' },
                    { rank: 8, name: 'Doctor Doom', class: 'Mystic', p7: '15,550', p6: '14,680', scale: 'Tier 1' }
                  ].map(row => (
                    <tr key={row.name} className="hover:bg-[#18181e]">
                      <td className="p-3 font-bold text-brand-yellow font-aldrich">#{row.rank}</td>
                      <td className="p-3 font-bold text-white">{row.name}</td>
                      <td className="p-3 uppercase font-bold text-[10px]">{row.class}</td>
                      <td className="p-3 font-bold text-white font-aldrich">{row.p7}</td>
                      <td className="p-3 font-aldrich">{row.p6}</td>
                      <td className="p-3 text-green-400 font-bold">{row.scale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
