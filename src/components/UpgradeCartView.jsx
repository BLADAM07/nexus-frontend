import React, { useState } from 'react';

export default function UpgradeCartView({
  user,
  upgradePlanData,
  loading = false,
  onToggleComplete,
  onOpenAuth,
  onExploreClick,
  onSelectChampion
}) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  if (!user) {
    return (
      <section className="py-20 bg-[#0d0d0f]">
        <div className="max-w-md mx-auto px-6 text-center bg-[#141416] border border-[#26262b] p-10">
          <i className="fa-solid fa-cart-flatbed-suitcase text-4xl text-brand-yellow mb-4"></i>
          <h3 className="text-2xl font-bold text-white mb-2">UPGRADE CART</h3>
          <p className="text-xs text-gray-400 font-inter mb-6">
            Log in to view your personalized rank-up cart and resource costs customized by our coach admin.
          </p>
          <button
            onClick={onOpenAuth}
            className="w-full bg-brand-yellow text-brand-dark font-extrabold py-3 text-xs tracking-wider hover:bg-yellow-300 transition-colors"
          >
            LOGIN TO VIEW UPGRADE CART
          </button>
        </div>
      </section>
    );
  }

  const items = upgradePlanData?.items || [];
  const summary = upgradePlanData?.summary || { total_items: 0, total_gold: 0, total_t6b: 0, total_t3a: 0, total_t5cc: 0 };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'VALIANT') {
      setDiscountPercent(30);
      setPromoMessage('✓ VALIANT BOOST: 30% Gold & Resource Discount Applied!');
    } else if (code === 'PARAGON') {
      setDiscountPercent(20);
      setPromoMessage('✓ PARAGON PASS: 20% Gold Discount Applied!');
    } else if (code === 'SUMMONER2026') {
      setDiscountPercent(15);
      setPromoMessage('✓ SUMMONER BONUS: 15% Catalyst Cost Reduction!');
    } else {
      setDiscountPercent(0);
      setPromoMessage('❌ Invalid Voucher Code. Try: VALIANT, PARAGON, or SUMMONER2026');
    }
  };

  const finalGold = Math.max(0, summary.total_gold * (1 - discountPercent / 100));

  return (
    <div className="bg-[#0f0f12] text-white font-aldrich">
      
      {/* Breadcrumb Section (UX Pilot 01 Style) */}
      <section id="breadcrumb-section" className="bg-[#141416] py-3 border-b border-[#222226]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs text-gray-400 font-inter">
            <span onClick={onExploreClick} className="hover:text-brand-yellow cursor-pointer">
              Home
            </span>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <span className="font-bold text-white">Upgrade Planner & Roster Cart</span>
          </nav>
        </div>
      </section>

      {/* Main Cart Section */}
      <section id="cart-section" className="py-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider">
                UPGRADE PLANNER CART
              </h1>
              <p className="text-xs text-gray-400 font-inter mt-1">
                Customized by Coach Admin for <strong className="text-white">{user.username}</strong>
              </p>
            </div>

            <div className="bg-[#18181c] border border-[#2b2b32] px-4 py-2 text-xs">
              <span className="text-gray-400">Queue Status: </span>
              <strong className="text-brand-yellow">{summary.pending_upgrades || 0} Pending Rankups</strong>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400">
              <i className="fa-solid fa-circle-notch fa-spin text-3xl text-brand-yellow mb-3"></i>
              <p className="text-xs">CALCULATING UPGRADE COSTS & RESOURCES...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-[#141416] border border-[#242428] p-12 text-center my-8">
              <i className="fa-solid fa-cart-arrow-down text-4xl text-gray-500 mb-3"></i>
              <h3 className="text-lg font-bold text-white mb-1">Your Upgrade Cart is Empty</h3>
              <p className="text-xs text-gray-400 font-inter mb-6">
                Add champions in "My Roster" and our Admin Coach will customize your rank-up path!
              </p>
              <button
                onClick={onExploreClick}
                className="bg-brand-yellow text-brand-dark px-6 py-3 text-xs font-bold"
              >
                DISCOVER CHAMPIONS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left Column: Cart Items List (UX Pilot 01 Style) */}
              <div id="cart-items" className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const isCompleted = item.is_completed;
                  return (
                    <div
                      key={item.plan_id || item.roster_id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center bg-[#141416] border p-5 transition-all ${
                        isCompleted
                          ? 'border-green-800/60 bg-[#121612] opacity-75'
                          : 'border-[#242428] hover:border-gray-500'
                      }`}
                    >
                      {/* Champion Image */}
                      <div className="w-20 h-20 bg-[#1a1a1e] border border-[#2e2e34] p-1 flex items-center justify-center mr-5 flex-shrink-0 relative mb-3 sm:mb-0">
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
                          <span className="absolute -top-1 -left-1 bg-yellow-400 text-black text-[8px] font-black px-1">
                            ★ AWAKENED
                          </span>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-brand-yellow">
                            {item.rarity}★
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">
                            {item.champion_class}
                          </span>
                          
                          {/* Priority or Analysing Badge */}
                          {!item.is_reviewed ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 flex items-center gap-1">
                              <i className="fa-solid fa-hourglass-half text-[8px] animate-pulse"></i>
                              <span>ANALYSING</span>
                            </span>
                          ) : (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 ${
                              item.priority === 1
                                ? 'bg-red-600 text-white'
                                : item.priority === 2
                                ? 'bg-yellow-500 text-black'
                                : 'bg-blue-600 text-white'
                            }`}>
                              P{item.priority}
                            </span>
                          )}
                        </div>

                        <h3
                          onClick={() => onSelectChampion && onSelectChampion(item)}
                          className="font-bold text-base text-white hover:text-brand-yellow cursor-pointer truncate mt-0.5"
                          title={item.champion_name}
                        >
                          {item.champion_name}
                        </h3>

                        {/* Admin Advice / Importance reason */}
                        <p className="text-gray-400 text-xs mt-1 font-inter">
                          Coach Rationale:{' '}
                          {!item.is_reviewed ? (
                            <span className="text-yellow-400/90 font-medium italic">
                              "Coach is currently analysing your roster for optimal rankup strategy."
                            </span>
                          ) : (
                            <span className="text-gray-200 font-medium">"{item.importance_note}"</span>
                          )}
                        </p>

                        {/* Rank Upgrade Transition */}
                        <div className="flex items-center space-x-4 mt-3">
                          <div className="flex items-center border border-[#333338] bg-[#1a1a1e]">
                            <span className="px-3 py-1 text-xs font-bold text-gray-300">
                              Current: R{item.current_rank}
                            </span>
                            <span className="px-2 py-1 text-xs text-brand-yellow font-bold border-l border-r border-[#333338]">
                              <i className="fa-solid fa-arrow-right"></i>
                            </span>
                            {!item.is_reviewed ? (
                              <span className="px-3 py-1 text-xs font-bold text-yellow-400 flex items-center gap-1.5 animate-pulse">
                                <i className="fa-solid fa-hourglass-start text-[10px]"></i>
                                <span>ANALYSING</span>
                              </span>
                            ) : (
                              <span className="px-3 py-1 text-xs font-bold text-green-400">
                                Target: R{item.future_rank}
                              </span>
                            )}
                          </div>

                          {!item.is_reviewed ? (
                            <button
                              disabled
                              title="Awaiting Coach Review in Admin Dashboard"
                              className="text-xs font-bold px-3 py-1 border bg-[#17171b] border-[#2a2a32] text-gray-500 cursor-not-allowed opacity-75"
                            >
                              AWAITING COACH
                            </button>
                          ) : (
                            <button
                              onClick={() => onToggleComplete && onToggleComplete(item.plan_id)}
                              className={`text-xs font-bold px-3 py-1 border transition-colors ${
                                isCompleted
                                  ? 'bg-green-600 text-white border-green-500'
                                  : 'bg-[#1b1b20] border-[#333] text-gray-300 hover:border-brand-yellow hover:text-brand-yellow'
                              }`}
                            >
                              {isCompleted ? '✓ COMPLETED' : 'MARK UPGRADED'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right: Catalyst & Resource Cost */}
                      <div className="text-left sm:text-right mt-3 sm:mt-0 flex-shrink-0">
                        {!item.is_reviewed ? (
                          <div className="bg-[#17171c] border border-[#2a2a34] px-3 py-2 text-right">
                            <span className="text-xs font-black text-yellow-400 font-aldrich block">
                              ⏳ ANALYSING...
                            </span>
                            <span className="text-[10px] text-gray-500 font-inter block mt-0.5">
                              Pending Coach Review
                            </span>
                          </div>
                        ) : (
                          <>
                            <p className="font-extrabold text-base text-brand-yellow font-aldrich">
                              {item.costs?.gold_str || '0 Gold'}
                            </p>
                            <p className="text-xs text-gray-400 font-inter mt-0.5">
                              T6B: <span className="text-white font-bold">{item.costs?.t6b}</span> | T3A: <span className="text-white font-bold">{item.costs?.t3a}</span>
                            </p>
                            <p className="text-[11px] text-gray-400 font-inter">
                              T5CC: <span className="text-white font-bold">{item.costs?.t5cc}</span>
                            </p>
                          </>
                        )}
                      </div>

                    </div>
                  );
                })}

                {/* Shipping & Quest Perks (UX Pilot 01 Style) */}
                <div id="shipping-info" className="bg-[#141416] border border-[#242428] p-5 mt-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <i className="fa-solid fa-bolt text-yellow-400 text-xl"></i>
                    <div>
                      <p className="font-bold text-xs tracking-wider">SEASON 50 CATALYST BOOST ACTIVE</p>
                      <p className="text-gray-400 text-xs font-inter">
                        Daily quests offer 2x Tier 6 Basic Catalyst fragments.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <i className="fa-solid fa-shield-halved text-cyan-400 text-xl"></i>
                    <div>
                      <p className="font-bold text-xs tracking-wider">BATTLEGROUNDS & WAR PREPAREDNESS</p>
                      <p className="text-gray-400 text-xs font-inter">
                        All customized rankups prioritize current season node counters.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Order / Resource Summary (UX Pilot 01 Style) */}
              <div id="cart-summary" className="lg:col-span-1">
                <div className="bg-[#141416] border border-[#242428] p-6 sticky top-28">
                  
                  <h3 className="font-extrabold text-base tracking-wider mb-6 pb-3 border-b border-[#222226] text-white">
                    RESOURCE & CATALYST SUMMARY
                  </h3>

                  <div className="space-y-3 mb-6 text-xs font-inter">
                    <div className="flex justify-between text-gray-300">
                      <span>Queue Items</span>
                      <span className="font-bold text-white">{summary.total_items} Champions</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-300">
                      <span>Tier 6 Basic (T6B)</span>
                      <span className="font-bold text-white">{summary.total_t6b} Catalysts</span>
                    </div>

                    <div className="flex justify-between text-gray-300">
                      <span>Tier 3 Alpha (T3A)</span>
                      <span className="font-bold text-white">{summary.total_t3a} Catalysts</span>
                    </div>

                    <div className="flex justify-between text-gray-300">
                      <span>Tier 5 Class (T5CC)</span>
                      <span className="font-bold text-white">{summary.total_t5cc} Catalysts</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="flex justify-between text-green-400 font-bold">
                        <span>Boost Discount</span>
                        <span>-{discountPercent}%</span>
                      </div>
                    )}

                    <div className="border-t border-[#2a2a30] pt-4 mt-4">
                      <div className="flex justify-between font-extrabold text-base text-brand-yellow font-aldrich">
                        <span>Total Gold Estimate</span>
                        <span>{finalGold.toLocaleString()} Gold</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo / Booster Code Voucher */}
                  <div id="promo-code" className="mb-6">
                    <div className="flex">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Voucher (VALIANT, PARAGON)..."
                        className="flex-1 bg-[#1b1b20] border border-[#333] px-3 py-2 text-xs text-white uppercase focus:border-brand-yellow focus:outline-none"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="bg-brand-yellow text-brand-dark px-4 py-2 text-xs font-extrabold"
                      >
                        APPLY
                      </button>
                    </div>
                    {promoMessage && (
                      <p className={`text-[11px] mt-1.5 font-inter ${
                        discountPercent > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {promoMessage}
                      </p>
                    )}
                  </div>

                  {/* CTA Buttons matching UX Pilot 01 */}
                  <button
                    onClick={() => alert(`Batch Rankup Simulation Initiated for ${summary.pending_upgrades} champions!`)}
                    className="w-full bg-brand-yellow text-brand-dark font-extrabold py-3.5 text-xs tracking-wider mb-3 hover:bg-yellow-300 transition-colors"
                  >
                    PROCEED TO BATCH RANKUP
                  </button>

                  <button
                    onClick={onExploreClick}
                    className="w-full border border-[#3a3a44] hover:border-white text-gray-200 font-bold py-3.5 text-xs tracking-wider transition-colors"
                  >
                    CONTINUE EXPLORING
                  </button>

                  {/* Payment / Resource Badges */}
                  <div id="payment-methods" className="mt-6 pt-5 border-t border-[#222226]">
                    <p className="text-[11px] text-gray-400 mb-2 font-inter">Accepted In-Game Currencies:</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-300 font-bold">
                      <span className="bg-[#1e1e24] px-2 py-1 border border-[#333]">🪙 Gold</span>
                      <span className="bg-[#1e1e24] px-2 py-1 border border-[#333]">💎 Units</span>
                      <span className="bg-[#1e1e24] px-2 py-1 border border-[#333]">🏆 Glory</span>
                      <span className="bg-[#1e1e24] px-2 py-1 border border-[#333]">⚔️ Loyalty</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </section>

    </div>
  );
}
