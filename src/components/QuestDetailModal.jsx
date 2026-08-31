import React, { useState } from 'react';
import { PlayCircle, ShieldAlert, Swords, Skull, Info, X } from 'lucide-react';
import ChampionCard from './ChampionCard';

export default function QuestDetailModal({ 
  quest, 
  actTitle, 
  allChampions, 
  onClose, 
  onSelectChampion, 
  onAddToRoster,
  initialTab = 'nodes' 
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'nodes', 'defenders', 'boss'

  if (!quest) return null;

  const getChampionObj = (nameStr) => {
    const searchName = nameStr.toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = allChampions.find(c => {
      const cName = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cName === searchName || cName.includes(searchName) || searchName.includes(cName);
    });
    return found || {
      name: nameStr,
      class: 'Cosmic',
      image: `/images/classes/cosmic.svg`,
      tier: 'Unknown'
    };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-[#0b0e14] border border-[#202532] rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#202532] bg-[#13171f]">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-brand-yellow font-bold text-xs uppercase tracking-wider">{actTitle}</span>
              <span className="text-gray-500 font-bold">\u2022</span>
              <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">Quest {quest.id}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-wide">
              {quest.boss?.name ? `${quest.boss.name} Encounter` : `Quest ${quest.id} Guide`}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {quest.video_url && (
              <a 
                href={quest.video_url} 
                target="_blank" 
                rel="noreferrer"
                className="hidden sm:flex items-center space-x-1 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-full border border-red-900/50 transition-colors"
              >
                <PlayCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Watch Guide</span>
              </a>
            )}
            <button 
              onClick={onClose}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center px-4 md:px-6 py-3 bg-[#0f1115] border-b border-[#202532] gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('nodes')}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-colors whitespace-nowrap ${
              activeTab === 'nodes' ? 'bg-[#202532] text-white border border-gray-600' : 'bg-transparent text-gray-500 hover:text-gray-300 border border-transparent'
            }`}
          >
            PATH NODES
          </button>
          <button 
            onClick={() => setActiveTab('defenders')}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-colors whitespace-nowrap ${
              activeTab === 'defenders' ? 'bg-[#202532] text-white border border-gray-600' : 'bg-transparent text-gray-500 hover:text-gray-300 border border-transparent'
            }`}
          >
            DEFENDERS
          </button>
          <button 
            onClick={() => setActiveTab('boss')}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-colors whitespace-nowrap ${
              activeTab === 'boss' ? 'bg-[#202532] text-white border border-gray-600' : 'bg-transparent text-gray-500 hover:text-gray-300 border border-transparent'
            }`}
          >
            BOSS COUNTERS
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0f1115]">
          
          {/* View: Path Nodes */}
          {activeTab === 'nodes' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white tracking-widest uppercase">Global & Path Nodes</h3>
              </div>
              {quest.path_nodes && quest.path_nodes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quest.path_nodes.map((node, nIdx) => (
                    <div key={nIdx} className="bg-[#13171f] border border-[#202532] p-4 rounded-lg">
                      <h4 className="text-blue-400 font-extrabold text-sm tracking-wider mb-2">{node.name}</h4>
                      <p className="text-[#8a95a5] text-xs font-inter leading-relaxed whitespace-pre-wrap">{node.effect}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No path nodes found for this quest.</p>
              )}
            </div>
          )}

          {/* View: Defenders */}
          {activeTab === 'defenders' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Swords className="w-5 h-5 text-brand-yellow" />
                <h3 className="text-lg font-bold text-white tracking-widest uppercase">Path Defenders</h3>
              </div>
              {quest.path_defenders && quest.path_defenders.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {quest.path_defenders.map((def, dIdx) => {
                    const champObj = getChampionObj(def.champion);
                    return (
                      <div key={dIdx} className="relative group">
                        <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 z-30 text-[9px] font-black px-2 py-0.5 rounded shadow-lg border border-[#333] ${
                          def.difficulty.toLowerCase() === 'easy' ? 'bg-green-600 text-white' : 
                          def.difficulty.toLowerCase() === 'mid' || def.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-500 text-black' : 
                          'bg-red-600 text-white'
                        }`}>
                          {def.difficulty.toUpperCase()}
                        </div>
                        <ChampionCard 
                          champion={champObj}
                          onSelectChampion={onSelectChampion}
                          onAddToRoster={onAddToRoster}
                          isFavorite={false}
                          onToggleFavorite={() => {}}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No path defenders found for this quest.</p>
              )}
            </div>
          )}

          {/* View: Boss Counters */}
          {activeTab === 'boss' && (
            <div className="space-y-6">
              {quest.boss && quest.boss.name ? (
                <div className="bg-[#13171f] border border-red-900/40 p-5 rounded-lg relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
                    <Skull className="w-64 h-64 text-red-500" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-6 border-b border-gray-800 pb-4">
                      <div className="bg-red-950/50 p-2 rounded border border-red-900/50">
                        <Skull className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-red-500 text-[10px] font-black tracking-widest uppercase mb-1">Boss Encounter</h4>
                        <h3 className="text-2xl font-extrabold text-white tracking-widest uppercase">{quest.boss.name}</h3>
                      </div>
                    </div>

                    {quest.boss.nodes && quest.boss.nodes.length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-white font-bold text-xs tracking-widest uppercase mb-3 opacity-80">Boss Nodes</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {quest.boss.nodes.map((node, nIdx) => (
                            <div key={nIdx} className="bg-[#0b0e14] border border-[#202532] p-3 rounded">
                              <h4 className="text-red-400 font-bold text-xs tracking-wider mb-1.5">{node.name}</h4>
                              <p className="text-[#8a95a5] text-xs font-inter leading-relaxed">{node.effect}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {quest.boss.phases && quest.boss.phases.length > 0 && (
                      <div>
                        <h5 className="text-white font-bold text-xs tracking-widest uppercase mb-3 opacity-80">Phase Mechanics</h5>
                        <div className="space-y-3">
                          {quest.boss.phases.map((phase, pIdx) => (
                            <div key={pIdx} className="bg-[#0b0e14] border border-[#202532] rounded overflow-hidden">
                              <div className="bg-[#1c2230] px-3 py-2 border-b border-[#202532]">
                                <h6 className="text-brand-yellow font-bold text-[10px] tracking-wider uppercase">{phase.name}</h6>
                              </div>
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-[#0f1115]">
                                    <th className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider w-1/3 border-b border-[#202532]">Mechanic</th>
                                    <th className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider border-b border-[#202532]">Action / Strategy</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {phase.steps.map((step, sIdx) => (
                                    <tr key={sIdx} className="border-b border-[#202532]/50 last:border-0 hover:bg-white/5 transition-colors">
                                      <td className="px-3 py-2.5 text-[11px] font-bold text-gray-300">{step.mechanic}</td>
                                      <td className="px-3 py-2.5 text-[11px] text-[#8a95a5] font-inter">{step.action}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No boss mechanics listed for this quest.</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
