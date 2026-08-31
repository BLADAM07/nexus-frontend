import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import HeroSection from './components/HeroSection';
import ChampionGrid from './components/ChampionGrid';
import MyRosterView from './components/MyRosterView';
import AdminDashboard from './components/AdminDashboard';
import UpgradeCartView from './components/UpgradeCartView';
import NodeSolverView from './components/NodeSolverView';
import TierListView from './components/TierListView';
import DuelPrestigeView from './components/DuelPrestigeView';
import GlossaryView from './components/GlossaryView';
import StoryGuideView from './components/StoryGuideView';
import ChampionModal from './components/ChampionModal';
import AuthModal from './components/AuthModal';
import TermsModal from './components/TermsModal';
import AddChampionModal from './components/AddChampionModal';
import Footer from './components/Footer';
import { api, getSavedUser } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'node-solver' | 'upgrade-cart' | 'my-roster' | 'admin-panel' | 'tier-lists' | 'duels' | 'glossary'
  
  // Auth State
  const [user, setUser] = useState(getSavedUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAddChampModal, setShowAddChampModal] = useState(false);
  const [addModalChampion, setAddModalChampion] = useState(null);

  // Data State
  const [champions, setChampions] = useState([]);
  const [immunities, setImmunities] = useState([]);
  const [tierData, setTierData] = useState({});
  const [duelTargets, setDuelTargets] = useState([]);
  const [glossaryList, setGlossaryList] = useState([]);
  const [loadingChamps, setLoadingChamps] = useState(true);

  // User State
  const [userRoster, setUserRoster] = useState([]);
  const [upgradePlanData, setUpgradePlanData] = useState({ items: [], summary: {} });
  const [loadingUserRoster, setLoadingUserRoster] = useState(false);
  const [loadingUpgradeCart, setLoadingUpgradeCart] = useState(false);

  // Filters
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [tagsData, setTagsData] = useState({ all_tags: [], all_categories: [], tags_by_category: {} });

  // Favorites & Selection
  const [favorites, setFavorites] = useState(() => {
    const f = localStorage.getItem('mcoc_favorites');
    return f ? JSON.parse(f) : [];
  });
  const [selectedChampion, setSelectedChampion] = useState(null);

  // Initial Data Load
  useEffect(() => {
    loadPublicData();
  }, []);

  // Sync user data whenever user or tab changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setUserRoster([]);
      setUpgradePlanData({ items: [], summary: {} });
    }
  }, [user]);

  const loadPublicData = async () => {
    try {
      setLoadingChamps(true);
      const [champs, imms, tiers, duels, gloss, tagsRes] = await Promise.all([
        api.getChampions(),
        api.getImmunities(),
        api.getTierLists(),
        api.getDuelTargets(),
        api.getGlossary(),
        api.getTags()
      ]);
      setChampions(champs);
      setImmunities(imms);
      setTierData(tiers);
      setDuelTargets(duels);
      setGlossaryList(gloss);
      setTagsData(tagsRes || { all_tags: [], all_categories: [], tags_by_category: {} });
    } catch (err) {
      console.error("Failed to load public MCOC dataset:", err);
    } finally {
      setLoadingChamps(false);
    }
  };

  const loadUserData = async () => {
    try {
      setLoadingUserRoster(true);
      setLoadingUpgradeCart(true);
      const [roster, plan] = await Promise.all([
        api.getUserRoster(),
        api.getUpgradePlan()
      ]);
      setUserRoster(roster);
      setUpgradePlanData(plan);
    } catch (err) {
      console.error("Failed to load user roster data:", err);
    } finally {
      setLoadingUserRoster(false);
      setLoadingUpgradeCart(false);
    }
  };

  // Auth Actions
  const handleLogin = async (username, password) => {
    const res = await api.login(username, password);
    setUser(res.user);
  };

  const handleRegister = async (username, email, password, role) => {
    const res = await api.register(username, email, password, role);
    setUser(res.user);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    if (activeTab === 'admin-panel') {
      setActiveTab('catalog');
    }
  };

  // User Roster Actions
  const handleOpenAddChampionModal = (champ = null) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setAddModalChampion(champ);
    setShowAddChampModal(true);
  };

  const handleConfirmAddChampion = async (champData) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      await api.addToRoster({
        champion_name: champData.champion_name,
        champion_class: champData.champion_class,
        rarity: champData.rarity || 7,
        awakened: !!champData.awakened,
        signature_level: champData.signature_level || 0,
        current_rank: champData.current_rank || 1,
        user_notes: champData.user_notes || ''
      });
      await loadUserData();
      setShowAddChampModal(false);
      setAddModalChampion(null);
    } catch (err) {
      alert(`Error adding to roster: ${err.message}`);
    }
  };

  const handleUpdateRosterItem = async (rosterId, updateData) => {
    try {
      await api.updateRosterItem(rosterId, updateData);
      await loadUserData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRosterItem = async (rosterId) => {
    if (!confirm('Are you sure you want to remove this champion from your roster?')) return;
    try {
      await api.deleteRosterItem(rosterId);
      await loadUserData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUpgradeComplete = async (planId) => {
    try {
      await api.toggleUpgradeComplete(planId);
      await loadUserData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFavorite = (champName) => {
    setFavorites(prev => {
      const next = prev.includes(champName) ? prev.filter(n => n !== champName) : [...prev, champName];
      localStorage.setItem('mcoc_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Filtered Catalog Champions
  const filteredChampions = champions.filter(champ => {
    if (selectedClass !== 'All' && champ.class.toLowerCase() !== selectedClass.toLowerCase()) return false;
    if (selectedCategory && !champ.categories?.includes(selectedCategory)) return false;
    if (selectedTag && !champ.tags?.includes(selectedTag)) return false;
    if (selectedTier && champ.tier !== selectedTier) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = champ.name.toLowerCase().includes(q);
      const matchClass = champ.class.toLowerCase().includes(q);
      const matchImmunity = champ.immunities?.some(i => i.toLowerCase().includes(q));
      const matchTag = champ.tags?.some(t => t.toLowerCase().includes(q));
      const matchCategory = champ.categories?.some(c => c.toLowerCase().includes(q));
      if (!matchName && !matchClass && !matchImmunity && !matchTag && !matchCategory) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex flex-col font-aldrich overflow-x-hidden">
      
      {/* 1. Header (Sticky Top Bar & Main Navigation) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        upgradeCartCount={upgradePlanData.summary?.pending_upgrades || 0}
        rosterCount={userRoster.length}
        favoritesCount={favorites.length}
      />

      {/* 2. Sub-Nav / Category Nav (Visible in Catalog) */}
      {activeTab === 'catalog' && (
        <CategoryNav
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTier={selectedTier}
          setSelectedTier={setSelectedTier}
          tagsData={tagsData}
        />
      )}

      {/* 3. Main Dynamic Content Area */}
      <main className="flex-1">
        
        {/* VIEW: CHAMPIONS CATALOG & STOREFRONT (UX Pilot 02) */}
        {activeTab === 'catalog' && (
          <div>
            <HeroSection
              onExploreClick={() => {
                const el = document.getElementById('recommendations-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onSolveNodeClick={() => setActiveTab('node-solver')}
              stats={{
                championsCount: champions.length,
                immunitiesCount: immunities.length
              }}
            />

            <ChampionGrid
              champions={filteredChampions}
              loading={loadingChamps}
              onSelectChampion={(champ) => setSelectedChampion(champ)}
              onAddToRoster={handleOpenAddChampionModal}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              title="EXPLORE ALL CHAMPIONS"
              subtitle="Filter by Class, S-Tier Meta, Immunities & Synergy Tags"
            />
          </div>
        )}

        {/* VIEW: MY OWNED ROSTER (User Multi-Account View) */}
        {activeTab === 'my-roster' && (
          <MyRosterView
            user={user}
            roster={userRoster}
            allChampions={champions}
            loading={loadingUserRoster}
            onOpenAddChampionModal={() => handleOpenAddChampionModal(null)}
            onAddChampion={handleConfirmAddChampion}
            onUpdateChampion={handleUpdateRosterItem}
            onDeleteChampion={handleDeleteRosterItem}
            onOpenAuth={() => setShowAuthModal(true)}
            onViewUpgradeCart={() => setActiveTab('upgrade-cart')}
          />
        )}

        {/* VIEW: UPGRADE PLANNER CART (UX Pilot 01 Cart & Resource Summary) */}
        {activeTab === 'upgrade-cart' && (
          <div>
            <UpgradeCartView
              user={user}
              upgradePlanData={upgradePlanData}
              loading={loadingUpgradeCart}
              onToggleComplete={handleToggleUpgradeComplete}
              onOpenAuth={() => setShowAuthModal(true)}
              onExploreClick={() => setActiveTab('catalog')}
              onSelectChampion={(champ) => setSelectedChampion(champ)}
            />

            {/* Recommendations Grid at bottom of Cart matching UX Pilot 01 */}
            <div className="border-t border-[#222226] bg-[#0c0c0e]">
              <ChampionGrid
                champions={champions.filter(c => c.tier === 'S-Tier').slice(0, 4)}
                title="FREQUENTLY RANKED TOGETHER / S-TIER SYNERGIES"
                subtitle="Top companions recommended for current Act 8 & Battlegrounds meta"
                onSelectChampion={(c) => setSelectedChampion(c)}
                onAddToRoster={handleOpenAddChampionModal}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          </div>
        )}

        {/* VIEW: ADMIN COMMAND CENTER (Coach Rankup Builder) */}
        {activeTab === 'admin-panel' && (
          <AdminDashboard
            adminUser={user}
            onSelectUserToView={(u) => console.log('Viewing user', u)}
          />
        )}

        {/* VIEW: NODE SOLVER */}
        {activeTab === 'node-solver' && (
          <NodeSolverView
            immunitiesList={immunities}
            onSelectChampion={(champ) => setSelectedChampion(champ)}
            onAddToRoster={handleOpenAddChampionModal}
          />
        )}

        {/* VIEW: TIER LISTS */}
        {activeTab === 'tier-lists' && (
          <TierListView
            tierData={tierData}
            onSelectChampion={(champ) => setSelectedChampion(champ)}
            onAddToRoster={handleOpenAddChampionModal}
          />
        )}

        {/* VIEW: DUEL TARGETS & PRESTIGE */}
        {activeTab === 'duels' && (
          <DuelPrestigeView
            duelTargets={duelTargets}
            onSelectChampion={(champ) => setSelectedChampion(champ)}
          />
        )}

        {/* VIEW: BEGINNER GUIDE & GLOSSARY */}
        {activeTab === 'glossary' && (
          <GlossaryView glossaryList={glossaryList} />
        )}

        {/* VIEW: STORY MODE GUIDE */}
        {activeTab === 'story-guide' && (
          <StoryGuideView 
            allChampions={champions}
            onSelectChampion={(champ) => setSelectedChampion(champ)}
            onAddToRoster={handleOpenAddChampionModal}
          />
        )}

      </main>

      {/* 4. Footer */}
      <Footer
        onSelectClass={(cls) => {
          setSelectedClass(cls);
          setActiveTab('catalog');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTerms={() => setShowTermsModal(true)}
      />

      {/* 5. Champion Details Modal */}
      {selectedChampion && (
        <ChampionModal
          champion={selectedChampion}
          onClose={() => setSelectedChampion(null)}
          onAddToRoster={handleOpenAddChampionModal}
        />
      )}

      {/* 6. Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      {/* 7. Terms of Service Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      {/* 8. Tactical Add Champion Modal */}
      <AddChampionModal
        isOpen={showAddChampModal}
        champion={addModalChampion}
        allChampions={champions}
        onClose={() => {
          setShowAddChampModal(false);
          setAddModalChampion(null);
        }}
        onAdd={handleConfirmAddChampion}
      />

    </div>
  );
}
