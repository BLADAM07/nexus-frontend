import React, { useState } from 'react';
import ChampionCard from './ChampionCard';

export default function ChampionGrid({
  champions = [],
  loading = false,
  onSelectChampion,
  onAddToRoster,
  favorites = [],
  onToggleFavorite,
  title = "EXPLORE ALL CHAMPIONS",
  subtitle = "Filter by Class, S-Tier Meta, Immunities & Synergy Tags"
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const totalPages = Math.ceil(champions.length / itemsPerPage);
  const displayedChamps = champions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section id="recommendations-section" className="py-8 sm:py-12 bg-[#0c0c0e]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header bar matching UX Pilot 02 */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 sm:mb-8 gap-3 border-b border-[#222228] pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-wider text-white">
              {title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 font-inter">
              Showing {displayedChamps.length} of {champions.length} Champions — {subtitle}
            </p>
          </div>

          {/* Quick Pagination info */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-2.5 sm:px-3 py-1.5 bg-[#17171c] border border-[#2b2b34] text-xs disabled:opacity-30 hover:border-brand-yellow text-white rounded-sm"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <span className="text-xs text-gray-300 font-bold px-2">
                Page {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-2.5 sm:px-3 py-1.5 bg-[#17171c] border border-[#2b2b34] text-xs disabled:opacity-30 hover:border-brand-yellow text-white rounded-sm"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="py-20 text-center text-gray-400 flex flex-col items-center justify-center">
            <i className="fa-solid fa-circle-notch fa-spin text-3xl text-brand-yellow mb-3"></i>
            <span className="text-xs tracking-wider font-bold">LOADING CHAMPION DATASET...</span>
          </div>
        ) : champions.length === 0 ? (
          <div className="py-20 text-center bg-[#131316] border border-[#222228] p-8">
            <i className="fa-solid fa-filter-circle-xmark text-4xl text-gray-500 mb-3"></i>
            <h4 className="text-base font-bold text-white mb-1">No Champions Found</h4>
            <p className="text-xs text-gray-400 font-inter">Try adjusting your search query, class, or tag filter.</p>
          </div>
        ) : (
          /* Product grid matching UX Pilot: 2 cols on mobile, 3 on tablet, 4 on desktop, 6 on xl */
          <div id="product-grid" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {displayedChamps.map((champ) => (
              <ChampionCard
                key={champ.id || champ.name}
                champion={champ}
                onSelectChampion={onSelectChampion}
                onAddToRoster={onAddToRoster}
                isFavorite={favorites.includes(champ.name)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}

        {/* Bottom Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 sm:px-4 py-2 bg-[#17171c] border border-[#2b2b34] text-xs font-bold disabled:opacity-30 hover:border-brand-yellow text-white rounded-sm"
            >
              PREV
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 text-xs font-bold border transition-colors rounded-sm ${
                      currentPage === pageNum
                        ? 'bg-brand-yellow text-brand-dark border-brand-yellow font-black'
                        : 'bg-[#17171c] border-[#2b2b34] text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 sm:px-4 py-2 bg-[#17171c] border border-[#2b2b34] text-xs font-bold disabled:opacity-30 hover:border-brand-yellow text-white rounded-sm"
            >
              NEXT
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
