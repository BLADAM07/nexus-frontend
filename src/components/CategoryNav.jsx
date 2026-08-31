import React from 'react';

const CLASSES = [
  { name: 'All', color: 'border-gray-500 text-gray-200' },
  { name: 'Cosmic', icon: '/images/classes/cosmic.svg', color: 'border-[#00d2ff] text-[#00d2ff] hover:bg-[#00d2ff]/10' },
  { name: 'Tech', icon: '/images/classes/tech.svg', color: 'border-[#0080ff] text-[#0080ff] hover:bg-[#0080ff]/10' },
  { name: 'Mutant', icon: '/images/classes/mutant.svg', color: 'border-[#ffcc00] text-[#ffcc00] hover:bg-[#ffcc00]/10' },
  { name: 'Skill', icon: '/images/classes/skill.svg', color: 'border-[#ff3344] text-[#ff3344] hover:bg-[#ff3344]/10' },
  { name: 'Science', icon: '/images/classes/science.svg', color: 'border-[#00cc66] text-[#00cc66] hover:bg-[#00cc66]/10' },
  { name: 'Mystic', icon: '/images/classes/mystic.svg', color: 'border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7]/10' },
];

export default function CategoryNav({
  selectedClass,
  setSelectedClass,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
  searchQuery,
  setSearchQuery,
  selectedTier,
  setSelectedTier,
  tagsData = { all_tags: [], all_categories: [], tags_by_category: {} }
}) {
  const allCategories = tagsData.all_categories || [];
  const tagsByCategory = tagsData.tags_by_category || {};
  const allTags = tagsData.all_tags || [];

  // When a category is chosen, filter tags to only that category
  const availableTags = selectedCategory && tagsByCategory[selectedCategory]
    ? tagsByCategory[selectedCategory]
    : allTags;

  return (
    <div id="category-nav" className="border-b border-[#222228] bg-[#121215]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
        
        {/* Class Filter Badges & Filters */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs font-bold">
          
          {/* Class Badges */}
          {CLASSES.map((cls) => (
            <button
              key={cls.name}
              onClick={() => setSelectedClass(cls.name)}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 border transition-all rounded-sm ${
                selectedClass === cls.name
                  ? 'bg-[#1f1f26] border-brand-yellow text-brand-yellow ring-1 ring-brand-yellow/50'
                  : 'bg-[#17171c] border-[#2b2b34] text-gray-300 hover:border-gray-400'
              }`}
            >
              {cls.icon && <img src={cls.icon} alt={cls.name} className="w-3.5 h-3.5 object-contain" />}
              <span className="text-[11px] sm:text-xs">{cls.name.toUpperCase()}</span>
            </button>
          ))}
          
          {/* S-Tier Filter */}
          <button
            onClick={() => setSelectedTier(selectedTier === 'S-Tier' ? '' : 'S-Tier')}
            className={`px-2.5 sm:px-3 py-1.5 border text-[11px] sm:text-xs font-bold transition-all rounded-sm ${
              selectedTier === 'S-Tier'
                ? 'bg-red-950 border-red-500 text-red-300 ring-1 ring-red-500'
                : 'bg-[#17171c] border-[#2b2b34] text-gray-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-fire-flame-curved mr-1 text-red-500"></i>
            <span>S-TIER</span>
          </button>

          {/* 1. Category Filter Dropdown (8 Dataset Categories) */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedTag(''); // reset tag when category changes
              }}
              className="bg-[#17171c] border border-[#2b2b34] text-gray-300 hover:text-white text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 focus:outline-none focus:border-brand-yellow rounded-sm cursor-pointer"
            >
              <option value="" className="bg-[#17171c]">📂 All Categories ({allCategories.length})</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#17171c]">
                  {cat} ({tagsByCategory[cat]?.length || 0})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Champion Tag Filter Dropdown (109 Dataset Tags) */}
          <div className="relative">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-[#17171c] border border-[#2b2b34] text-gray-300 hover:text-white text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 focus:outline-none focus:border-brand-yellow rounded-sm max-w-[200px] truncate cursor-pointer"
            >
              <option value="" className="bg-[#17171c]">🏷️ All Tags ({availableTags.length})</option>
              
              {/* Grouped if all categories selected, or direct list if single category */}
              {selectedCategory ? (
                availableTags.map((tag) => (
                  <option key={tag} value={tag} className="bg-[#17171c]">
                    {tag}
                  </option>
                ))
              ) : (
                Object.entries(tagsByCategory).map(([catName, tagList]) => (
                  <optgroup key={catName} label={`--- ${catName.toUpperCase()} ---`} className="bg-[#141418] text-brand-yellow font-bold">
                    {tagList.map((tag) => (
                      <option key={tag} value={tag} className="bg-[#17171c] text-gray-200 font-normal">
                        {tag}
                      </option>
                    ))}
                  </optgroup>
                ))
              )}
            </select>
          </div>

          {/* Reset Filters Button (if any active) */}
          {(selectedClass !== 'All' || selectedCategory || selectedTag || selectedTier || searchQuery) && (
            <button
              onClick={() => {
                setSelectedClass('All');
                setSelectedCategory('');
                setSelectedTag('');
                setSelectedTier('');
                setSearchQuery('');
              }}
              className="text-[10px] text-red-400 hover:text-red-300 underline font-inter px-1 py-1"
              title="Clear all filters"
            >
              Clear Filters
            </button>
          )}

        </div>

        {/* Search Bar matching UX Pilot 02 */}
        <div id="search-container" className="relative w-full lg:w-80 flex-shrink-0">
          <input
            type="text"
            placeholder="Search 328+ Champions, Tags, Nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#17171c] border border-[#2b2b34] text-xs text-white pl-3 pr-10 py-2 focus:border-brand-yellow focus:outline-none placeholder-gray-500 rounded-sm font-inter"
          />
          <button
            type="button"
            className="absolute right-0 top-0 bottom-0 bg-brand-yellow text-brand-dark px-3 flex items-center justify-center hover:bg-yellow-300 transition-colors rounded-r-sm"
          >
            <i className="fa-solid fa-magnifying-glass text-xs"></i>
          </button>
        </div>

      </div>
    </div>
  );
}
