import React, { useState } from 'react';

export default function MyRosterView({
  user,
  roster = [],
  allChampions = [],
  loading = false,
  onOpenAddChampionModal,
  onAddChampion,
  onUpdateChampion,
  onDeleteChampion,
  onOpenAuth,
  onViewUpgradeCart
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterClass, setFilterClass] = useState('All');
  const [filterRarity, setFilterRarity] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    champion_name: '',
    champion_class: 'Cosmic',
    rarity: 7,
    awakened: false,
    current_rank: 1,
    signature_level: 0,
    user_notes: ''
  });

  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);

  if (!user) {
    return (
      <section className="py-20 bg-[#0d0d0f]">
        <div className="max-w-md mx-auto px-6 text-center bg-[#141416] border border-[#26262b] p-10">
          <i className="fa-solid fa-lock text-4xl text-brand-yellow mb-4"></i>
          <h3 className="text-2xl font-bold text-white mb-2">LOGIN REQUIRED</h3>
          <p className="text-xs text-gray-400 font-inter mb-6">
            Log in or register to build your personal owned champion roster and receive custom rank-up advice from our admin strategist!
          </p>
          <button
            onClick={onOpenAuth}
            className="w-full bg-brand-yellow text-brand-dark font-extrabold py-3 text-xs tracking-wider hover:bg-yellow-300 transition-colors"
          >
            LOGIN / REGISTER TO MY ROSTER
          </button>
        </div>
      </section>
    );
  }

  // Filtered Roster
  const filteredRoster = roster.filter(item => {
    if (filterClass !== 'All' && item.champion_class !== filterClass) return false;
    if (filterRarity !== 'All' && item.rarity !== parseInt(filterRarity)) return false;
    if (searchFilter && !item.champion_name.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  const handleNameChange = (val) => {
    setFormData(prev => ({ ...prev, champion_name: val }));
    if (val.length >= 2) {
      const matches = allChampions.filter(c => c.name.toLowerCase().includes(val.toLowerCase())).slice(0, 6);
      setAutocompleteSuggestions(matches);
    } else {
      setAutocompleteSuggestions([]);
    }
  };

  const selectSuggestedChampion = (champ) => {
    setFormData(prev => ({
      ...prev,
      champion_name: champ.name,
      champion_class: champ.class
    }));
    setAutocompleteSuggestions([]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.champion_name.trim()) return;
    await onAddChampion(formData);
    setFormData({
      champion_name: '',
      champion_class: 'Cosmic',
      rarity: 7,
      awakened: false,
      current_rank: 1,
      signature_level: 0,
      user_notes: ''
    });
    setShowAddModal(false);
  };

  return (
    <section className="py-8 sm:py-12 bg-[#0c0c0e] min-h-[70vh]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#222226] mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
                MY OWNED ROSTER
              </h2>
              <span className="bg-brand-yellow text-brand-dark text-xs font-black px-2.5 py-0.5">
                {roster.length} CHAMPIONS
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 font-inter">
              Logged in as <strong className="text-white">{user.username}</strong> ({user.email}). Manage your owned champions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onOpenAddChampionModal ? onOpenAddChampionModal() : setShowAddModal(true)}
              className="bg-brand-yellow text-brand-dark font-extrabold px-5 py-2.5 text-xs tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i>
              <span>ADD OWNED CHAMPION</span>
            </button>

            <button
              onClick={onViewUpgradeCart}
              className="bg-[#1c1c22] border border-brand-yellow text-brand-yellow font-bold px-5 py-2.5 text-xs tracking-wider hover:bg-brand-yellow hover:text-brand-dark transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-cart-flatbed-suitcase"></i>
              <span>VIEW UPGRADE PLANNER CART</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#141416] border border-[#242428] p-4 text-center">
            <div className="text-2xl font-black text-white">{roster.length}</div>
            <div className="text-[10px] text-gray-400 font-bold tracking-wider">TOTAL OWNED</div>
          </div>
          <div className="bg-[#141416] border border-[#242428] p-4 text-center">
            <div className="text-2xl font-black text-[#00d2ff]">
              {roster.filter(r => r.rarity === 7).length}
            </div>
            <div className="text-[10px] text-gray-400 font-bold tracking-wider">7-STAR CHAMPIONS</div>
          </div>
          <div className="bg-[#141416] border border-[#242428] p-4 text-center">
            <div className="text-2xl font-black text-yellow-400">
              {roster.filter(r => r.rarity === 6).length}
            </div>
            <div className="text-[10px] text-gray-400 font-bold tracking-wider">6-STAR CHAMPIONS</div>
          </div>
          <div className="bg-[#141416] border border-[#242428] p-4 text-center">
            <div className="text-2xl font-black text-brand-yellow">
              {roster.filter(r => r.awakened).length}
            </div>
            <div className="text-[10px] text-gray-400 font-bold tracking-wider">AWAKENED DUPES</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#141416] border border-[#242428] p-4 mb-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-gray-400 font-bold mr-2">CLASS:</span>
              {['All', 'Cosmic', 'Tech', 'Mutant', 'Skill', 'Science', 'Mystic'].map(cls => (
                <button
                  key={cls}
                  onClick={() => setFilterClass(cls)}
                  className={`px-2.5 py-1 text-xs border font-bold ${
                    filterClass === cls
                      ? 'bg-brand-yellow text-brand-dark border-brand-yellow'
                      : 'bg-[#1b1b20] text-gray-300 border-[#2f2f36]'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1 text-xs ml-0 sm:ml-4">
              <span className="text-gray-400 font-bold mr-2">RARITY:</span>
              {['All', '7', '6', '5'].map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRarity(r)}
                  className={`px-2.5 py-1 text-xs border font-bold ${
                    filterRarity === r
                      ? 'bg-brand-yellow text-brand-dark border-brand-yellow'
                      : 'bg-[#1b1b20] text-gray-300 border-[#2f2f36]'
                  }`}
                >
                  {r === 'All' ? 'All' : `${r}★`}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search owned champions..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#1b1b20] border border-[#2f2f36] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>
        </div>

        {/* Roster Table / List */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">
            <i className="fa-solid fa-circle-notch fa-spin text-3xl text-brand-yellow mb-3"></i>
            <p className="text-xs">LOADING YOUR ROSTER...</p>
          </div>
        ) : filteredRoster.length === 0 ? (
          <div className="py-16 text-center bg-[#141416] border border-[#242428] p-8">
            <i className="fa-solid fa-shield-cat text-4xl text-gray-500 mb-3"></i>
            <h4 className="text-base font-bold text-white mb-1">No Champions in this Filter</h4>
            <p className="text-xs text-gray-400 font-inter mb-4">Click below to add a new champion you own!</p>
            <button
              onClick={() => onOpenAddChampionModal ? onOpenAddChampionModal() : setShowAddModal(true)}
              className="bg-brand-yellow text-brand-dark px-4 py-2 text-xs font-bold"
            >
              ADD CHAMPION
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRoster.map(item => (
              <div key={item.id} className="bg-[#141416] border border-[#242428] p-4 flex flex-col justify-between hover:border-gray-500 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-16 h-16 bg-[#1a1a1e] border border-[#2e2e34] p-1 flex-shrink-0 relative">
                    <img
                      src={item.image}
                      alt={item.champion_name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `/images/classes/${item.champion_class.toLowerCase()}.svg`;
                      }}
                    />
                    {item.awakened && (
                      <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-[9px] font-black px-1 rounded-sm">
                        AWK
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold text-brand-yellow">
                        {item.rarity}★
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase">
                        {item.champion_class}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white truncate" title={item.champion_name}>
                      {item.champion_name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="bg-[#1f1f26] text-gray-300 text-[10px] font-bold px-2 py-0.5 border border-[#333]">
                        Rank {item.current_rank}
                      </span>
                      {item.future_rank && item.future_rank > item.current_rank && (
                        <span className="text-green-400 text-[10px] font-bold flex items-center gap-1">
                          <i className="fa-solid fa-arrow-right"></i> Target R{item.future_rank}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Guidance / Importance Note */}
                <div className="bg-[#19191d] border border-[#26262e] p-2.5 text-xs mb-3 font-inter">
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                    Coach Strategy Note:
                  </div>
                  <div className="text-gray-200 text-[11px] italic">
                    "{item.importance_note || 'Pending Admin Review'}"
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between border-t border-[#222226] pt-3">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onUpdateChampion(item.id, { current_rank: Math.max(1, item.current_rank - 1) })}
                      className="w-7 h-7 bg-[#1f1f24] hover:bg-[#2c2c34] text-gray-300 text-xs font-bold border border-[#34343e]"
                      title="Decrease Rank"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white px-2">R{item.current_rank}</span>
                    <button
                      onClick={() => onUpdateChampion(item.id, { current_rank: Math.min(5, item.current_rank + 1) })}
                      className="w-7 h-7 bg-[#1f1f24] hover:bg-[#2c2c34] text-gray-300 text-xs font-bold border border-[#34343e]"
                      title="Increase Rank"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateChampion(item.id, { awakened: !item.awakened })}
                      className={`text-[10px] font-bold px-2 py-1 border transition-colors ${
                        item.awakened
                          ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300'
                          : 'bg-[#1c1c20] border-[#333] text-gray-400 hover:text-white'
                      }`}
                    >
                      {item.awakened ? '★ AWAKENED' : 'UNAWAKENED'}
                    </button>

                    <button
                      onClick={() => onDeleteChampion(item.id)}
                      className="text-red-400 hover:text-red-300 text-xs p-1"
                      title="Remove from Roster"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* ADD CHAMPION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-[#141416] border border-[#333338] max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-base"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3 className="text-xl font-extrabold tracking-wider text-white mb-4">
              ADD OWNED CHAMPION
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Champion Name with live suggestion */}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  CHAMPION NAME:
                </label>
                <input
                  type="text"
                  required
                  value={formData.champion_name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Hercules, Doctor Doom, Onslaught..."
                  className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-sm text-white focus:border-brand-yellow focus:outline-none"
                />

                {/* Autocomplete Dropdown */}
                {autocompleteSuggestions.length > 0 && (
                  <div className="absolute z-20 top-full left-0 right-0 bg-[#18181c] border border-brand-yellow mt-1 max-h-48 overflow-y-auto">
                    {autocompleteSuggestions.map(s => (
                      <div
                        key={s.name}
                        onClick={() => selectSuggestedChampion(s)}
                        className="p-2 text-xs flex justify-between items-center hover:bg-brand-yellow hover:text-brand-dark cursor-pointer border-b border-[#26262a]"
                      >
                        <span className="font-bold">{s.name}</span>
                        <span className="text-[10px] uppercase font-bold opacity-80">{s.class}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Class Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  CHAMPION CLASS:
                </label>
                <select
                  value={formData.champion_class}
                  onChange={(e) => setFormData(prev => ({ ...prev, champion_class: e.target.value }))}
                  className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none"
                >
                  {['Cosmic', 'Tech', 'Mutant', 'Skill', 'Science', 'Mystic'].map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              {/* Rarity & Current Rank */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    STAR RARITY:
                  </label>
                  <select
                    value={formData.rarity}
                    onChange={(e) => setFormData(prev => ({ ...prev, rarity: parseInt(e.target.value) }))}
                    className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none"
                  >
                    <option value={7}>7-Star (7★)</option>
                    <option value={6}>6-Star (6★)</option>
                    <option value={5}>5-Star (5★)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    CURRENT RANK:
                  </label>
                  <select
                    value={formData.current_rank}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_rank: parseInt(e.target.value) }))}
                    className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none"
                  >
                    <option value={1}>Rank 1</option>
                    <option value={2}>Rank 2</option>
                    <option value={3}>Rank 3</option>
                    <option value={4}>Rank 4</option>
                    <option value={5}>Rank 5</option>
                  </select>
                </div>
              </div>

              {/* Awakened Checkbox */}
              <div className="flex items-center space-x-3 bg-[#19191d] p-3 border border-[#2b2b32]">
                <input
                  type="checkbox"
                  id="awakened-check"
                  checked={formData.awakened}
                  onChange={(e) => setFormData(prev => ({ ...prev, awakened: e.target.checked }))}
                  className="w-4 h-4 accent-brand-yellow cursor-pointer"
                />
                <label htmlFor="awakened-check" className="text-xs font-bold text-white cursor-pointer">
                  Awakened Signature Ability (Silver / Duplicated Star)
                </label>
              </div>

              {/* User Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  USER NOTES FOR ADMIN COACH:
                </label>
                <textarea
                  rows={2}
                  value={formData.user_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_notes: e.target.value }))}
                  placeholder="e.g. My top war attacker; need next rankup advice..."
                  className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none font-inter"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#222] text-xs font-bold text-gray-300 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-yellow text-brand-dark text-xs font-extrabold tracking-wider hover:bg-yellow-300"
                >
                  SAVE TO ROSTER
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
}
