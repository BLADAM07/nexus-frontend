import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import QuestDetailModal from './QuestDetailModal';

export default function StoryGuideView({ allChampions = [], onSelectChampion, onAddToRoster }) {
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for Sub-Act Selection
  const [selectedSubActId, setSelectedSubActId] = useState('');
  
  // State for Modal
  const [activeModalQuest, setActiveModalQuest] = useState(null);
  const [modalInitialTab, setModalInitialTab] = useState('nodes'); // 'nodes', 'defenders', 'boss'

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setLoading(true);
        const data = await api.getStoryGuide();
        if (data && !data.error) {
          setGuideData([data]); 
        }
      } catch (err) {
        console.error("Failed to load story guide", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, []);

  // Process and group the flat quest list into Sub-Acts
  const subActs = useMemo(() => {
    if (!guideData || guideData.length === 0) return {};
    const flatQuests = guideData[0].quests || [];
    
    const grouped = {};
    flatQuests.forEach(q => {
      // Extract prefix like "8.1" from "8.1.1"
      const prefixMatch = q.id.match(/^(\d+\.\d+)/);
      const subActId = prefixMatch ? `Act ${prefixMatch[1]}` : 'Other';
      if (!grouped[subActId]) grouped[subActId] = [];
      grouped[subActId].push(q);
    });
    
    return grouped;
  }, [guideData]);

  // Set initial selected tab once data loads
  useEffect(() => {
    if (Object.keys(subActs).length > 0 && !selectedSubActId) {
      setSelectedSubActId(Object.keys(subActs)[0]);
    }
  }, [subActs, selectedSubActId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#0b0e14]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
      </div>
    );
  }

  if (!guideData || guideData.length === 0 || Object.keys(subActs).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#0b0e14] text-center px-4">
        <h2 className="text-xl font-bold text-white mb-2">Guide Not Found</h2>
        <p className="text-gray-400">The story guide data could not be loaded.</p>
      </div>
    );
  }

  const activeQuests = subActs[selectedSubActId] || [];
  
  // Find the overall final boss (last quest in the last sub act)
  const actKeys = Object.keys(subActs).sort();
  const lastActKey = actKeys[actKeys.length - 1];
  const lastQuestInLastAct = subActs[lastActKey][subActs[lastActKey].length - 1];
  const finalBossName = lastQuestInLastAct?.boss?.name || 'Unknown Boss';

  const handleOpenModal = (quest, tab) => {
    setActiveModalQuest(quest);
    setModalInitialTab(tab);
  };

  return (
    <div className="bg-[#0b0e14] min-h-screen text-white font-inter pb-20">
      
      {/* Top Page Header Bar */}
      <div className="w-full border-b border-[#202532] bg-[#0f1115]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-xl font-black tracking-widest uppercase">
            MCOC <span className="text-blue-500">ACT 8</span> GUIDE
          </div>
          <div className="border border-[#202532] rounded-full px-4 py-1.5 text-[10px] font-bold text-gray-400 tracking-wider">
            BEGINNER MODE • v1.0
          </div>
        </div>
      </div>

      {/* Top Container: Max Width Wrapper */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* --- HERO SECTION --- */}
        <div className="flex flex-col xl:flex-row gap-6 mb-8 md:mb-12">
          
          {/* Main Info Card */}
          <div className="bg-[#13171f] border border-[#202532] rounded-2xl p-6 md:p-10 flex-1 shadow-lg">
            <h4 className="text-blue-500 font-black text-xs md:text-sm tracking-widest uppercase mb-3">
              Visual Progression Guide
            </h4>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Act 8, explained without the <br className="hidden md:block"/> headache.
            </h1>
            <p className="text-[#8a95a5] text-sm md:text-base max-w-2xl mb-8 leading-relaxed">
              Pick a quest, see the path, understand the node, then choose a counter. Designed as the UI/UX layer for a future complete beginner guide.
            </p>
            
            {/* Stats Row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="bg-[#0b0e14] border border-[#202532] rounded-xl p-4 flex-1 min-w-[120px] max-w-[160px]">
                <div className="text-white text-2xl font-black mb-1">4</div>
                <div className="text-[#8a95a5] text-[10px] sm:text-xs font-bold uppercase tracking-wider">Acts / Chapters</div>
              </div>
              <div className="bg-[#0b0e14] border border-[#202532] rounded-xl p-4 flex-1 min-w-[120px] max-w-[160px]">
                <div className="text-white text-2xl font-black mb-1">24</div>
                <div className="text-[#8a95a5] text-[10px] sm:text-xs font-bold uppercase tracking-wider">Quests</div>
              </div>
              <div className="bg-[#0b0e14] border border-[#202532] rounded-xl p-4 flex-1 min-w-[120px] max-w-[160px]">
                <div className="text-white text-2xl font-black mb-1">6</div>
                <div className="text-[#8a95a5] text-[10px] sm:text-xs font-bold uppercase tracking-wider">Paths / Quest</div>
              </div>
            </div>
          </div>
          
          {/* Final Boss Callout Card */}
          <div className="bg-[#13171f] border border-[#202532] rounded-2xl p-6 md:p-8 xl:w-[450px] flex-shrink-0 flex flex-col justify-center shadow-lg group hover:border-red-900/50 transition-colors relative overflow-hidden cursor-pointer"
               onClick={() => handleOpenModal(lastQuestInLastAct, 'boss')}
          >
            {/* Dark background graphic element */}
            <div className="absolute top-4 inset-x-4 h-48 bg-gradient-to-b from-[#1a202c] to-[#0f1115] rounded-xl border border-[#202532] flex items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-white text-center tracking-widest drop-shadow-md">
                    {finalBossName.toUpperCase()}
                </span>
            </div>
            
            <div className="mt-56 relative z-10">
              <h4 className="text-red-500 font-black text-[10px] tracking-widest uppercase mb-1">
                {lastActKey.toUpperCase()} FINAL BOSS
              </h4>
              <h2 className="text-2xl font-extrabold text-white tracking-wide mb-2">
                {finalBossName} Encounter
              </h2>
              <p className="text-[#8a95a5] text-sm font-medium">
                Boss mechanics + counters + fight plan
              </p>
            </div>
          </div>
          
        </div>

        {/* --- NAVIGATION TABS --- */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {Object.keys(subActs).map(subId => (
            <button
              key={subId}
              onClick={() => setSelectedSubActId(subId)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wider transition-colors whitespace-nowrap border ${
                selectedSubActId === subId
                  ? 'bg-[#1e2a3b] text-blue-400 border-blue-500/30'
                  : 'bg-transparent text-[#8a95a5] border-[#202532] hover:text-white hover:bg-[#1a202c]'
              }`}
            >
              {subId}
            </button>
          ))}
        </div>

        {/* --- QUEST GRID --- */}
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-2xl font-black text-white tracking-wide">{selectedSubActId}</h2>
          <span className="text-[#8a95a5] text-xs font-bold tracking-wider uppercase">Quest overview</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeQuests.map((q) => {
            // Determine difficulty label from path defenders if not hardcoded
            let diffLabel = 'Medium';
            let diffColor = 'text-green-400 border-green-500/30 bg-green-500/10';
            
            if (q.path_defenders && q.path_defenders.length > 0) {
              const diffs = q.path_defenders.map(d => d.difficulty.toLowerCase());
              if (diffs.includes('hard') || diffs.includes('boss')) {
                  diffLabel = 'Boss';
                  diffColor = 'text-red-400 border-red-500/30 bg-red-500/10';
              } else if (diffs.includes('mid') || diffs.includes('medium')) {
                  diffLabel = 'Medium';
                  diffColor = 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
              } else {
                  diffLabel = 'Easy';
                  diffColor = 'text-green-400 border-green-500/30 bg-green-500/10';
              }
            }

            // Mock route since it's not in the json
            const mockRoute = ['Top', 'Mid', 'Bottom', 'Final'][parseInt(q.id.split('.').pop(), 10) % 4] || 'Mid';

            return (
              <div key={q.id} className="bg-[#13171f] border border-[#202532] rounded-xl p-5 md:p-6 shadow flex flex-col justify-between hover:border-gray-600 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#8a95a5] text-xs font-black tracking-widest">{q.id}</span>
                    <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full border ${diffColor}`}>
                      {diffLabel}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-extrabold text-white mb-2 tracking-wide truncate" title={q.boss?.name || 'Quest Boss'}>
                    {q.boss?.name || 'Quest Boss'}
                  </h3>
                  
                  <p className="text-[#8a95a5] text-xs font-medium mb-6">
                    Recommended route: <span className="text-gray-300 font-bold">{mockRoute}</span>
                  </p>
                </div>
                
                <div>
                  <h4 className="text-white text-xs font-bold tracking-wider mb-3">Guide modules</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button 
                      onClick={() => handleOpenModal(q, 'nodes')}
                      className="bg-[#1a202c] hover:bg-[#202836] border border-[#2d3748] text-gray-300 hover:text-white px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider transition-colors"
                    >
                      Path nodes
                    </button>
                    <button 
                      onClick={() => handleOpenModal(q, 'defenders')}
                      className="bg-[#1a202c] hover:bg-[#202836] border border-[#2d3748] text-gray-300 hover:text-white px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider transition-colors"
                    >
                      Defenders
                    </button>
                    <button 
                      onClick={() => handleOpenModal(q, 'boss')}
                      className="bg-[#1a202c] hover:bg-[#202836] border border-[#2d3748] text-gray-300 hover:text-white px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider transition-colors"
                    >
                      Counters
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* --- DETAIL MODAL --- */}
      {activeModalQuest && (
        <QuestDetailModal
          quest={activeModalQuest}
          actTitle={selectedSubActId}
          allChampions={allChampions}
          initialTab={modalInitialTab}
          onClose={() => setActiveModalQuest(null)}
          onSelectChampion={onSelectChampion}
          onAddToRoster={onAddToRoster}
        />
      )}

    </div>
  );
}
