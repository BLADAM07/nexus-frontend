import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function AdminDashboard({ adminUser, onSelectUserToView }) {
  const [activeAdminTab, setActiveAdminTab] = useState('rankup-customizer'); // 'rankup-customizer' | 'access-control'
  
  // Data States
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [saveStatus, setSaveStatus] = useState({});

  // Modals & Action States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ username: '', email: '', password: '', role: 'admin' });
  const [resetPassModalUser, setResetPassModalUser] = useState(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const isBoss = adminUser?.username === 'BL_ADAM_07';

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await api.getAdminUsers();
      setUsers(data);
      if (data.length > 0 && !selectedUserId) {
        handleSelectUser(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSelectUser = async (userId) => {
    setSelectedUserId(userId);
    try {
      setLoadingRoster(true);
      const res = await api.getAdminUserRoster(userId);
      setSelectedUserData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRoster(false);
    }
  };

  const handleFieldChange = (rosterId, field, val) => {
    if (!selectedUserData) return;
    setSelectedUserData(prev => ({
      ...prev,
      roster: prev.roster.map(item => {
        if (item.id === rosterId) {
          return { ...item, [field]: val };
        }
        return item;
      })
    }));
  };

  const handleSaveChampionPlan = async (item) => {
    try {
      setSaveStatus(prev => ({ ...prev, [item.id]: 'saving' }));
      await api.saveAdminPlan({
        user_id: selectedUserId,
        roster_id: item.id,
        future_rank: parseInt(item.future_rank || item.current_rank + 1),
        priority: parseInt(item.priority || 2),
        importance_note: item.importance_note || 'Recommended Rankup',
        admin_feedback: item.admin_feedback || ''
      });
      setSaveStatus(prev => ({ ...prev, [item.id]: 'saved' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [item.id]: null }));
      }, 2500);
    } catch (err) {
      console.error(err);
      setSaveStatus(prev => ({ ...prev, [item.id]: 'error' }));
    }
  };

  const handleSaveAll = async () => {
    if (!selectedUserData?.roster) return;
    for (const item of selectedUserData.roster) {
      await handleSaveChampionPlan(item);
    }
  };

  // Boss Access Control Handlers
  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = newRole === 'admin'
      ? `Promote '${targetUser.username}' to Admin Coach? They will be able to customize player rankups.`
      : `Revoke Admin access for '${targetUser.username}' and demote to regular Summoner?`;
      
    if (!confirm(confirmMsg)) return;

    try {
      await api.changeUserRole(targetUser.id, newRole);
      setActionMessage(`✓ Successfully changed ${targetUser.username}'s role to ${newRole.toUpperCase()}`);
      await fetchUsers();
      setTimeout(() => setActionMessage(''), 3500);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.adminCreateUser(createForm);
      setActionMessage(`✓ Created new ${createForm.role.toUpperCase()} account '${createForm.username}'`);
      setCreateForm({ username: '', email: '', password: '', role: 'admin' });
      setShowCreateModal(false);
      await fetchUsers();
      setTimeout(() => setActionMessage(''), 3500);
    } catch (err) {
      alert(`Error creating account: ${err.message}`);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetPassModalUser || !newPasswordVal.trim()) return;
    try {
      await api.adminResetPassword(resetPassModalUser.id, newPasswordVal.trim());
      setActionMessage(`✓ Reset password successfully for '${resetPassModalUser.username}'`);
      setResetPassModalUser(null);
      setNewPasswordVal('');
      setTimeout(() => setActionMessage(''), 3500);
    } catch (err) {
      alert(`Error resetting password: ${err.message}`);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (!confirm(`⚠️ DANGER: Delete user '${targetUser.username}' and all their roster data permanently?`)) return;
    try {
      await api.adminDeleteUser(targetUser.id);
      setActionMessage(`✓ Deleted account '${targetUser.username}'`);
      await fetchUsers();
      setTimeout(() => setActionMessage(''), 3500);
    } catch (err) {
      alert(`Error deleting user: ${err.message}`);
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-[#0a0a0c] min-h-[80vh]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header with Boss Badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#222226] mb-6">
          <div>
            <div className="flex items-center space-x-2.5">
              {isBoss ? (
                <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-[10px] font-black px-2.5 py-0.5 tracking-wider shadow flex items-center gap-1">
                  <i className="fa-solid fa-crown"></i>
                  <span>MAIN BOSS / SUPREME OWNER</span>
                </span>
              ) : (
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 tracking-wider">
                  ADMIN COACH
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
                ADMIN CONTROL CENTER
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1 font-inter">
              {isBoss ? (
                <>
                  Logged in as <strong className="text-amber-400">👑 BL_ADAM_07 (Main Boss)</strong>. Full authority over system, staff promotions, accounts, and rankups.
                </>
              ) : (
                <>
                  Logged in as <strong className="text-brand-yellow">⭐ {adminUser?.username} (Admin Coach)</strong>. Authorized to review players and customize rankup strategies.
                </>
              )}
            </p>
          </div>

          {/* Sub-Tab Navigation */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveAdminTab('rankup-customizer')}
              className={`px-4 py-2 text-xs font-bold border transition-colors flex items-center gap-2 ${
                activeAdminTab === 'rankup-customizer'
                  ? 'bg-brand-yellow text-brand-dark border-brand-yellow font-extrabold'
                  : 'bg-[#18181c] border-[#2c2c34] text-gray-300 hover:border-gray-500'
              }`}
            >
              <i className="fa-solid fa-sliders"></i>
              <span>RANKUP CUSTOMIZER</span>
            </button>

            {isBoss && (
              <button
                onClick={() => setActiveAdminTab('access-control')}
                className={`px-4 py-2 text-xs font-bold border transition-colors flex items-center gap-2 ${
                  activeAdminTab === 'access-control'
                    ? 'bg-amber-400 text-black border-amber-400 font-extrabold shadow-lg shadow-amber-500/20'
                    : 'bg-[#1c1812] border-amber-500/50 text-amber-300 hover:bg-amber-400/10'
                }`}
              >
                <i className="fa-solid fa-crown text-xs"></i>
                <span>STAFF & ADMIN MANAGEMENT (BOSS ONLY)</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Action Alert */}
        {actionMessage && (
          <div className="bg-green-950/90 border border-green-500 text-green-200 text-xs p-3 mb-6 font-inter flex items-center space-x-2">
            <i className="fa-solid fa-circle-check text-green-400"></i>
            <span>{actionMessage}</span>
          </div>
        )}

        {/* ================= VIEW 1: RANKUP CUSTOMIZER ================= */}
        {activeAdminTab === 'rankup-customizer' && (
          <div>
            <div className="flex justify-end mb-4">
              {selectedUserData?.roster && (
                <button
                  onClick={handleSaveAll}
                  className="bg-brand-yellow text-brand-dark font-extrabold px-5 py-2 text-xs tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <span>SAVE & PUBLISH ALL RANKUPS FOR USER</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Left Column: Registered Users Directory */}
              <div className="lg:col-span-1 bg-[#141416] border border-[#242428] p-4 h-fit">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>USERS DIRECTORY</span>
                  <span className="text-brand-yellow">{users.length}</span>
                </h3>

                {loadingUsers ? (
                  <div className="py-8 text-center text-xs text-gray-400">Loading users...</div>
                ) : (
                  <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                    {users.map(u => {
                      const isBossAccount = u.is_boss || u.username === 'BL_ADAM_07';
                      return (
                        <div
                          key={u.id}
                          onClick={() => handleSelectUser(u.id)}
                          className={`p-3 border cursor-pointer transition-all ${
                            selectedUserId === u.id
                              ? 'bg-[#1e1e24] border-brand-yellow ring-1 ring-brand-yellow/40'
                              : 'bg-[#17171a] border-[#25252a] hover:border-gray-500'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm text-white flex items-center gap-1.5">
                              {isBossAccount && <i className="fa-solid fa-crown text-amber-400 text-xs"></i>}
                              <span>{u.username}</span>
                            </span>
                            {isBossAccount ? (
                              <span className="text-[9px] font-black px-2 py-0.5 rounded bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-[0_0_8px_rgba(255,191,0,0.5)] flex items-center gap-1">
                                <i className="fa-solid fa-crown text-[8px]"></i>
                                <span>BOSS</span>
                              </span>
                            ) : (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                u.role === 'admin'
                                  ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40'
                                  : 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
                              }`}>
                                {u.role.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 font-inter truncate">{u.email}</div>
                          <div className="flex justify-between items-center text-[10px] text-gray-400 mt-2 pt-2 border-t border-[#25252a]">
                            <span>Roster: <strong className="text-white">{u.roster_count || 0}</strong></span>
                            <span>Reviewed: <strong className="text-brand-yellow">{u.reviewed_count || 0}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: User Roster & Rankup Customizer */}
              <div className="lg:col-span-3">
                {loadingRoster ? (
                  <div className="py-20 text-center text-gray-400 bg-[#141416] border border-[#242428]">
                    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-brand-yellow mb-3"></i>
                    <p className="text-xs">LOADING USER'S ROSTER...</p>
                  </div>
                ) : !selectedUserData ? (
                  <div className="py-20 text-center text-gray-400 bg-[#141416] border border-[#242428]">
                    Select a user from the directory to review and customize their rankup plan.
                  </div>
                ) : (
                  <div>
                    {/* Active User Header */}
                    <div className="bg-[#141416] border border-[#242428] p-4 mb-6 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <span>Customizing Plan for:</span>
                          {selectedUserData.user.username === 'BL_ADAM_07' ? (
                            <span className="text-amber-400 font-extrabold flex items-center gap-1">
                              <i className="fa-solid fa-crown text-xs"></i>
                              <span>BL_ADAM_07 (MAIN BOSS)</span>
                            </span>
                          ) : (
                            <span className="text-brand-yellow">{selectedUserData.user.username}</span>
                          )}
                        </h3>
                        <p className="text-xs text-gray-400 font-inter">
                          {selectedUserData.roster.length} Champions in Roster — Adjust Target Future Rank, Importance & Priority
                        </p>
                      </div>
                      <div className="text-xs text-gray-300 bg-[#1e1e24] px-3 py-1.5 border border-[#333]">
                        Target Rankups will sync directly to user's <strong>Upgrade Cart</strong>
                      </div>
                    </div>

                    {/* Champion Rows */}
                    {selectedUserData.roster.length === 0 ? (
                      <div className="py-12 text-center text-gray-400 bg-[#141416] border border-[#242428]">
                        This user hasn't added any champions to their owned roster yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedUserData.roster.map(item => (
                          <div
                            key={item.id}
                            className="bg-[#141416] border border-[#242428] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-gray-600 transition-colors"
                          >
                            {/* Champion Info */}
                            <div className="flex items-center space-x-4 min-w-[220px]">
                              <div className="w-14 h-14 bg-[#1a1a1e] border border-[#2e2e34] p-1 flex-shrink-0 relative">
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
                                  <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-[8px] font-black px-1">
                                    AWK
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase">
                                  {item.rarity}★ {item.champion_class}
                                </div>
                                <div className="text-sm font-bold text-white truncate max-w-[160px]" title={item.champion_name}>
                                  {item.champion_name}
                                </div>
                                <div className="text-[11px] text-gray-300 mt-0.5">
                                  Current: <strong className="text-brand-yellow">Rank {item.current_rank}</strong>
                                </div>
                                {item.user_notes && (
                                  <div className="text-[10px] text-gray-400 italic mt-0.5 truncate max-w-[160px]" title={item.user_notes}>
                                    Note: {item.user_notes}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Admin Controls */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                              
                                {/* Target Rank */}
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-400 mb-1">
                                    TARGET RANK:
                                  </label>
                                  <select
                                    value={item.future_rank}
                                    onChange={(e) => handleFieldChange(item.id, 'future_rank', parseInt(e.target.value))}
                                    className="w-full bg-[#1b1b20] border border-[#2f2f36] text-xs text-white px-2 py-1.5 focus:border-brand-yellow focus:outline-none"
                                  >
                                    {(item.rarity === 7 ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5]).map(r => (
                                      <option key={r} value={r}>Rank {r} (R{r})</option>
                                    ))}
                                  </select>
                                </div>

                              {/* Priority */}
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-1">
                                  PRIORITY:
                                </label>
                                <select
                                  value={item.priority}
                                  onChange={(e) => handleFieldChange(item.id, 'priority', parseInt(e.target.value))}
                                  className="w-full bg-[#1b1b20] border border-[#2f2f36] text-xs text-white px-2 py-1.5 focus:border-brand-yellow focus:outline-none"
                                >
                                  <option value={1}>🔥 Priority 1 (Must / Urgent)</option>
                                  <option value={2}>⭐ Priority 2 (Helpful / Strong)</option>
                                  <option value={3}>🛡️ Priority 3 (Situational / Luxury)</option>
                                </select>
                              </div>

                              {/* Importance Note */}
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-1">
                                  IMPORTANCE REASON:
                                </label>
                                <input
                                  type="text"
                                  value={item.importance_note || ''}
                                  onChange={(e) => handleFieldChange(item.id, 'importance_note', e.target.value)}
                                  placeholder="e.g. must best for all, needed if node wanted"
                                  className="w-full bg-[#1b1b20] border border-[#2f2f36] text-xs text-white px-2 py-1.5 focus:border-brand-yellow focus:outline-none font-inter"
                                />
                              </div>

                            </div>

                            {/* Save Button for single item */}
                            <div className="flex-shrink-0 self-end md:self-center">
                              <button
                                onClick={() => handleSaveChampionPlan(item)}
                                disabled={saveStatus[item.id] === 'saving'}
                                className={`px-3 py-2 text-xs font-bold transition-colors ${
                                  saveStatus[item.id] === 'saved'
                                    ? 'bg-green-600 text-white'
                                    : saveStatus[item.id] === 'saving'
                                    ? 'bg-gray-600 text-white'
                                    : 'bg-[#1e1e24] border border-[#383842] text-gray-200 hover:border-brand-yellow hover:text-brand-yellow'
                                }`}
                              >
                                {saveStatus[item.id] === 'saved' ? (
                                  <span>✓ Saved</span>
                                ) : saveStatus[item.id] === 'saving' ? (
                                  <span>Saving...</span>
                                ) : (
                                  <span>Save Plan</span>
                                )}
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ================= VIEW 2: ACCESS CONTROL & STAFF (BOSS CONSOLE) ================= */}
        {activeAdminTab === 'access-control' && isBoss && (
          <div className="bg-[#141416] border border-amber-500/40 p-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#222226] mb-6 gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-amber-400"></i>
                  <span>STAFF & ADMIN ROLE ACCESS MANAGER</span>
                </h3>
                <p className="text-xs text-gray-400 font-inter mt-1">
                  As the Supreme Owner (<strong>BL_ADAM_07</strong>), you can grant Admin Coach status to followers, revoke admin permissions anytime, reset passwords, or delete accounts.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-amber-400 hover:bg-yellow-300 text-black font-extrabold px-5 py-2.5 text-xs tracking-wider transition-colors flex items-center gap-2 shadow-lg"
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>CREATE ADMIN / USER</span>
              </button>
            </div>

            {/* Users & Roles Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#1a1a20] text-gray-400 font-bold border-b border-[#2b2b34]">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">USERNAME</th>
                    <th className="p-3">EMAIL</th>
                    <th className="p-3">CURRENT ROLE</th>
                    <th className="p-3">OWNED ROSTER</th>
                    <th className="p-3 text-right">BOSS ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202026] text-gray-300 font-inter">
                  {users.map(u => {
                    const isUserBoss = u.username === 'BL_ADAM_07';
                    return (
                      <tr key={u.id} className="hover:bg-[#18181e] transition-colors">
                        <td className="p-3 font-bold text-gray-500">#{u.id}</td>
                        <td className="p-3 font-bold text-white flex items-center gap-1.5">
                          {isUserBoss && <i className="fa-solid fa-crown text-amber-400 text-xs"></i>}
                          <span>{u.username}</span>
                        </td>
                        <td className="p-3 text-gray-400">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded ${
                            isUserBoss
                              ? 'bg-amber-400 text-black'
                              : u.role === 'admin'
                              ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40'
                              : 'bg-blue-950/60 text-blue-300 border border-blue-500/30'
                          }`}>
                            {isUserBoss ? '👑 BOSS (OWNER)' : u.role === 'admin' ? '⭐ ADMIN COACH' : '🛡️ SUMMONER'}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-white">{u.roster_count} Champions</td>
                        <td className="p-3 text-right space-x-2">
                          
                          {/* Role Toggle Button (Boss is protected) */}
                          {!isUserBoss && (
                            <button
                              onClick={() => handleToggleRole(u)}
                              className={`px-3 py-1 text-[11px] font-bold border transition-colors ${
                                u.role === 'admin'
                                  ? 'bg-red-950/50 hover:bg-red-800 border-red-500 text-red-200'
                                  : 'bg-yellow-950/50 hover:bg-yellow-600 border-yellow-500 text-yellow-200'
                              }`}
                              title={u.role === 'admin' ? 'Demote to regular Summoner' : 'Promote to Admin Coach'}
                            >
                              {u.role === 'admin' ? '🔻 Revoke Admin' : '👑 Make Admin'}
                            </button>
                          )}

                          {/* Reset Password Button */}
                          <button
                            onClick={() => {
                              setResetPassModalUser(u);
                              setNewPasswordVal('');
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold bg-[#22222a] hover:bg-[#2e2e38] border border-[#3a3a46] text-gray-200"
                            title="Reset User Password"
                          >
                            <i className="fa-solid fa-key mr-1"></i>
                            <span>Password</span>
                          </button>

                          {/* Delete User Button (Boss is protected) */}
                          {!isUserBoss && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="px-2.5 py-1 text-[11px] font-bold bg-red-950 hover:bg-red-700 text-red-300 hover:text-white border border-red-800"
                              title="Delete Account"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}

                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      {/* CREATE USER / ADMIN MODAL (BOSS ONLY) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="bg-[#141416] border border-amber-500/60 max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-base"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3 className="text-xl font-extrabold text-white mb-1 flex items-center gap-2">
              <i className="fa-solid fa-user-shield text-amber-400"></i>
              <span>CREATE STAFF / USER ACCOUNT</span>
            </h3>
            <p className="text-xs text-gray-400 font-inter mb-4">
              Add a new administrator or summoner user directly from the Boss Console.
            </p>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">USERNAME:</label>
                <input
                  type="text"
                  required
                  value={createForm.username}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="e.g. coach_adam"
                  className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">EMAIL ADDRESS:</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="coach@mcocnexus.com"
                  className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">ACCOUNT ROLE:</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="admin">👑 Admin Coach (Follower Admin)</option>
                  <option value="user">🛡️ Summoner User (Standard Player)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">INITIAL PASSWORD:</label>
                <input
                  type="password"
                  required
                  value={createForm.password}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#222] text-xs font-bold text-gray-300 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-400 hover:bg-yellow-300 text-black text-xs font-black tracking-wider"
                >
                  CREATE ACCOUNT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL (BOSS ONLY) */}
      {resetPassModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="bg-[#141416] border border-[#333338] max-w-sm w-full p-6 relative">
            <button
              onClick={() => setResetPassModalUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-base"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3 className="text-lg font-extrabold text-white mb-1">
              RESET PASSWORD
            </h3>
            <p className="text-xs text-gray-400 font-inter mb-4">
              Set a new password for <strong className="text-white">{resetPassModalUser.username}</strong>
            </p>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">NEW PASSWORD:</label>
                <input
                  type="password"
                  required
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetPassModalUser(null)}
                  className="px-4 py-2 bg-[#222] text-xs font-bold text-gray-300 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-yellow text-brand-dark text-xs font-black"
                >
                  SAVE PASSWORD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
