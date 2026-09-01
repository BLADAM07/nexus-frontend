import React, { useState } from 'react';
import { Shield, Zap, Crosshair } from 'lucide-react';

export default function GlossaryView({ glossaryList = [] }) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? glossaryList.filter(g => g.term.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase()))
    : glossaryList;

  return (
    <section className="py-8 sm:py-12 bg-[#0c0c0e] min-h-[80vh]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#222226] gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 tracking-wider rounded-sm">
                STRATEGY & MECHANICS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
                BEGINNER GUIDE & NODE GLOSSARY
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-inter">
              Master combat mechanics, node cancelers, and champion viability tips from the dataset guide.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search glossary terms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#18181c] border border-[#333] px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-yellow rounded shadow-inner"
            />
          </div>
        </div>

        {/* Core Game Mechanics Spotlight */}
        <div className="my-8">
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-wider text-white mb-6 border-l-4 border-brand-yellow pl-3">
            CORE COMBAT MECHANICS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Parry Card */}
            <div className="bg-gradient-to-br from-[#141418] to-[#0c0c0e] border border-[#2a2a30] p-6 rounded-lg shadow-xl relative overflow-hidden group hover:border-brand-yellow transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand-yellow opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity"></div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-[#1a1a20] p-2.5 rounded border border-[#333] group-hover:border-brand-yellow transition-colors duration-300">
                  <Shield className="w-5 h-5 text-brand-yellow" />
                </div>
                <h4 className="text-white font-extrabold tracking-widest text-lg uppercase drop-shadow-md">Parry</h4>
              </div>
              <p className="text-gray-400 text-sm font-inter leading-relaxed">
                Blocking an attack at the exact moment it connects. A successful parry reduces incoming damage significantly and inflicts a Stun debuff on the opponent, opening them up for a combo.
              </p>
            </div>

            {/* Dexterity Card */}
            <div className="bg-gradient-to-br from-[#141418] to-[#0c0c0e] border border-[#2a2a30] p-6 rounded-lg shadow-xl relative overflow-hidden group hover:border-blue-500 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity"></div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-[#1a1a20] p-2.5 rounded border border-[#333] group-hover:border-blue-500 transition-colors duration-300">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <h4 className="text-white font-extrabold tracking-widest text-lg uppercase drop-shadow-md">Dexterity</h4>
              </div>
              <p className="text-gray-400 text-sm font-inter leading-relaxed">
                Swiping back at the right time to dodge an incoming attack entirely. This grants a Precision buff, increasing the critical rating of your next attack. Crucial for avoiding special attacks.
              </p>
            </div>

            {/* Intercept Card */}
            <div className="bg-gradient-to-br from-[#141418] to-[#0c0c0e] border border-[#2a2a30] p-6 rounded-lg shadow-xl relative overflow-hidden group hover:border-red-500 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity"></div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-[#1a1a20] p-2.5 rounded border border-[#333] group-hover:border-red-500 transition-colors duration-300">
                  <Crosshair className="w-5 h-5 text-red-500" />
                </div>
                <h4 className="text-white font-extrabold tracking-widest text-lg uppercase drop-shadow-md">Intercept</h4>
              </div>
              <p className="text-gray-400 text-sm font-inter leading-relaxed">
                Attacking the opponent just as they dash towards you, hitting them before their attack lands. This bypasses their block and is essential against aggressive or unblockable opponents.
              </p>
            </div>

          </div>
        </div>

        {/* Glossary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => (
            <div key={idx} className="bg-[#141416] border border-[#242428] p-5 hover:border-gray-500 transition-colors">
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>
                <h4 className="font-extrabold text-sm text-white tracking-wide">
                  {item.term}
                </h4>
              </div>
              <p className="text-xs text-gray-300 font-inter leading-relaxed mb-3">
                {item.description}
              </p>
              {item.tips && (
                <div className="bg-[#1a1a20] border border-[#2c2c36] p-3 text-[11px] font-inter text-gray-300">
                  <span className="text-brand-yellow font-bold uppercase text-[10px] block mb-1">
                    Playstyle & Handling Tip:
                  </span>
                  {item.tips}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
