// Use VITE_API_URL from .env if available (for production with split repo), otherwise default to /api for local Vite proxy
const API_BASE = import.meta.env.VITE_API_URL || 'https://nesux-backend.onrender.com/api';
export const getAuthToken = () => localStorage.getItem('mcoc_token');
export const setAuthToken = (token) => localStorage.setItem('mcoc_token', token);
export const removeAuthToken = () => localStorage.removeItem('mcoc_token');

export const getSavedUser = () => {
  const u = localStorage.getItem('mcoc_user');
  return u ? JSON.parse(u) : null;
};
export const setSavedUser = (user) => localStorage.setItem('mcoc_user', JSON.stringify(user));
export const removeSavedUser = () => localStorage.removeItem('mcoc_user');

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An unexpected error occurred' }));
    let errorMsg = errorData.detail || 'Request failed';
    if (typeof errorMsg !== 'string') {
        errorMsg = JSON.stringify(errorMsg);
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  login: async (username, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setAuthToken(data.token);
    setSavedUser(data.user);
    return data;
  },

  register: async (username, email, password) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role: 'user' }),
    });
    setAuthToken(data.token);
    setSavedUser(data.user);
    return data;
  },

  sendOtp: (username, email, password) => request('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  }),

  verifyOtpRegister: async (email, otp) => {
    const data = await request('/auth/verify-otp-register', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    setAuthToken(data.token);
    setSavedUser(data.user);
    return data;
  },

  resendOtp: (email) => request('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  sendResetOtp: (email) => request('/auth/send-reset-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  verifyResetPassword: (email, otp, new_password) => request('/auth/verify-reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, new_password }),
  }),

  changePassword: (old_password, new_password) => request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ old_password, new_password }),
  }),

  logout: () => {
    removeAuthToken();
    removeSavedUser();
  },

  getMe: () => request('/auth/me'),

  // Public Catalog & Solver
  getChampions: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.class && params.class !== 'All') query.append('class', params.class);
    if (params.immunity) query.append('immunity', params.immunity);
    if (params.tag) query.append('tag', params.tag);
    if (params.tier) query.append('tier', params.tier);
    const qs = query.toString();
    return request(`/champions${qs ? `?${qs}` : ''}`);
  },

  getImmunities: () => request('/immunities'),
  solveNode: (debuffs) => request('/node-solver', {
    method: 'POST',
    body: JSON.stringify({ debuffs }),
  }),
  getTierLists: () => request('/v1/tier-lists'),
  getGlossary: () => request('/v1/glossary'),
  getDuelTargets: () => request('/v1/duel-targets'),
  getTags: () => request('/v1/tags'),
  getStoryGuide: () => request('/v1/story-guide'),

  // User Roster Management
  getUserRoster: () => request('/roster'),
  addToRoster: (data) => request('/roster', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateRosterItem: (id, data) => request(`/roster/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteRosterItem: (id) => request(`/roster/${id}`, {
    method: 'DELETE',
  }),

  // User Upgrade Cart / Plan
  getUpgradePlan: () => request('/upgrade-plan'),
  toggleUpgradeComplete: (planId) => request(`/upgrade-plan/toggle-complete/${planId}`, {
    method: 'POST',
  }),

  // Admin Dashboard & Customizer
  getAdminUsers: () => request('/admin/users'),
  getAdminUserRoster: (userId) => request(`/admin/user-roster/${userId}`),
  saveAdminPlan: (planData) => request('/admin/upgrade-plan', {
    method: 'POST',
    body: JSON.stringify(planData),
  }),

  // Boss / Super Admin Role & User Controls
  changeUserRole: (userId, role) => request(`/admin/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  }),
  adminCreateUser: (userData) => request('/admin/users/create', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  adminResetPassword: (userId, newPassword) => request(`/admin/users/${userId}/password`, {
    method: 'PUT',
    body: JSON.stringify({ new_password: newPassword }),
  }),
  adminDeleteUser: (userId) => request(`/admin/users/${userId}`, {
    method: 'DELETE',
  }),
};

export default api;
