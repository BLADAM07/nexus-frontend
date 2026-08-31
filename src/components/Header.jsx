import React, { useState } from 'react';

export default function Header({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  upgradeCartCount = 0,
  rosterCount = 0,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'catalog', label: 'CHAMPIONS', icon: 'fa-solid fa-users-viewfinder', color: 'text-brand-yellow' },
    { id: 'node-solver', label: 'NODE SOLVER', icon: 'fa-solid fa-shield-virus', color: 'text-green-400' },
    { id: 'tier-lists', label: 'TIER LISTS', icon: 'fa-solid fa-trophy', color: 'text-yellow-400' },
    { id: 'duels', label: 'DUELS & PRESTIGE', icon: 'fa-solid fa-crosshairs', color: 'text-purple-400' },
    { id: 'glossary', label: 'GUIDES', icon: 'fa-solid fa-book-journal-whills', color: 'text-blue-400' },
    { id: 'story-guide', label: 'STORY QUESTS', icon: 'fa-solid fa-map-location-dot', color: 'text-red-400' },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header id="header" className="w-full bg-[#111114] sticky top-0 z-50 border-b border-[#222228] shadow-lg">
      
      {/* Top Announcement Bar */}
      <div id="top-bar" className="bg-[#09090b] text-gray-400 text-[10px] sm:text-[11px] py-1.5 border-b border-[#1c1c22]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center">
          
          {/* Right Slogan */}
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse"></span>
            <span className="text-gray-300 font-bold uppercase tracking-wider text-[9px] sm:text-[10px]">
              MAKE YOUR ACCOUNT PROGRESS EASY
            </span>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4">
          
          {/* 1. Left Official Brand Logo + Name */}
          <div
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-shrink-0"
            onClick={() => handleNavClick('catalog')}
          >
            {/* Emblem Image */}
            <img
              src="/images/logo/mcoc_nexus.png"
              alt="MCOC NEXUS Emblem"
              className="w-8 h-8 sm:w-11 sm:h-11 object-contain rounded-full hover:scale-105 transition-transform duration-200 drop-shadow-[0_0_10px_rgba(225,255,0,0.35)] flex-shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/logo.png";
              }}
            />
            {/* Brand Title & Tagline */}
            <div className="flex flex-col">
              <div className="text-lg sm:text-2xl font-extrabold tracking-wider text-white leading-none flex items-center">
                MCOC<span className="text-brand-yellow ml-1">NEXUS</span>
              </div>
              <span className="text-[7px] sm:text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-0.5 hidden xs:inline sm:inline">
                Apex Database & Suite
              </span>
            </div>
          </div>

          {/* 2. Center Nav Links (Desktop XL) */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs font-bold tracking-wider transition-all flex items-center gap-2 rounded ${
                    isActive
                      ? 'bg-[#1e1e26] text-brand-yellow border-b-2 border-brand-yellow'
                      : 'text-gray-300 hover:text-white hover:bg-[#1a1a20]'
                  }`}
                >
                  <i className={`${item.icon} ${item.color} text-xs`}></i>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. Right User Controls & Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
            
            {/* My Owned Roster Button */}
            <button
              onClick={() => handleNavClick('my-roster')}
              className={`px-2 sm:px-3 py-1.5 text-xs font-bold border transition-all flex items-center gap-1 sm:gap-1.5 rounded-sm ${
                activeTab === 'my-roster'
                  ? 'border-brand-yellow bg-brand-yellow text-brand-dark shadow-[0_0_10px_rgba(225,255,0,0.2)]'
                  : 'border-[#2e2e36] bg-[#16161a] text-gray-200 hover:border-gray-400'
              }`}
              title="My Owned Roster"
            >
              <i className="fa-solid fa-clipboard-user text-xs"></i>
              <span className="hidden md:inline">ROSTER</span>
              {user && (
                <span className="bg-[#0e0e10] text-brand-yellow text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-black border border-[#333]">
                  {rosterCount}
                </span>
              )}
            </button>

            {/* Admin Console (If Admin / Boss) */}
            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin-panel')}
                className={`px-2 sm:px-3 py-1.5 text-xs font-bold border transition-all flex items-center gap-1 sm:gap-1.5 rounded-sm ${
                  activeTab === 'admin-panel'
                    ? 'bg-amber-400 text-black border-amber-400 font-extrabold shadow-[0_0_12px_rgba(251,191,36,0.4)]'
                    : 'bg-[#1f1910] border-amber-500/50 text-amber-300 hover:bg-amber-500/20'
                }`}
                title="Admin Console"
              >
                <i className="fa-solid fa-crown text-amber-400 text-xs"></i>
                <span className="hidden md:inline">ADMIN</span>
              </button>
            )}

            {/* Upgrade Planner Cart */}
            <button
              onClick={() => handleNavClick('upgrade-cart')}
              className={`relative p-1.5 sm:p-2 rounded transition-colors ${
                activeTab === 'upgrade-cart'
                  ? 'text-brand-yellow bg-[#1e1e24]'
                  : 'text-gray-300 hover:text-white hover:bg-[#1a1a20]'
              }`}
              title="Upgrade Cart & Catalysts"
            >
              <i className="fa-solid fa-cart-flatbed-suitcase text-sm sm:text-lg"></i>
              {upgradeCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] sm:text-[9px] font-black w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center border-2 border-[#111114]">
                  {upgradeCartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Toggle */}
            {user ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2 border-l border-[#2e2e36] pl-1.5 sm:pl-3">
                <div className="text-right hidden lg:block">
                  <div className="text-xs font-bold text-white flex items-center gap-1 justify-end">
                    {user.username === 'BL_ADAM_07' && <i className="fa-solid fa-crown text-amber-400 text-[11px]"></i>}
                    {user.role === 'admin' && user.username !== 'BL_ADAM_07' && <i className="fa-solid fa-star text-yellow-400 text-[10px]"></i>}
                    <span className="truncate max-w-[100px]">{user.username}</span>
                  </div>
                  <div className={`text-[8px] uppercase tracking-wider font-black ${
                    user.username === 'BL_ADAM_07'
                      ? 'text-amber-400'
                      : user.role === 'admin'
                      ? 'text-yellow-400'
                      : 'text-cyan-400'
                  }`}>
                    {user.username === 'BL_ADAM_07' ? '👑 BOSS' : user.role === 'admin' ? '⭐ ADMIN' : '🛡️ SUMMONER'}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="bg-[#1c1c22] hover:bg-red-900/60 text-gray-300 hover:text-red-300 text-xs p-1.5 sm:p-2 border border-[#333] transition-colors rounded-sm"
                  title="Logout"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-brand-yellow text-brand-dark px-2.5 sm:px-3 py-1.5 text-xs font-extrabold tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-1 rounded-sm"
              >
                <i className="fa-solid fa-user text-xs"></i>
                <span className="hidden sm:inline">SIGN IN</span>
              </button>
            )}

            {/* Mobile / Tablet Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden text-gray-300 hover:text-white text-sm p-1.5 bg-[#1a1a20] border border-[#2e2e36] rounded-sm w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-colors ml-0.5"
              title="Toggle Menu"
            >
              <i className={mobileMenuOpen ? "fa-solid fa-xmark text-brand-yellow" : "fa-solid fa-bars"}></i>
            </button>

          </div>

        </div>
      </div>

      {/* Mobile / Tablet Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#141418] border-b border-[#2a2a32] px-3 sm:px-6 py-3 space-y-1 shadow-2xl">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 text-xs font-bold tracking-wider flex items-center gap-3 rounded-sm transition-colors ${
                  isActive
                    ? 'bg-[#22222a] text-brand-yellow border-l-2 border-brand-yellow font-black'
                    : 'text-gray-300 hover:bg-[#1a1a20]'
                }`}
              >
                <i className={`${item.icon} ${item.color} w-4 text-center text-xs`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

    </header>
  );
}
