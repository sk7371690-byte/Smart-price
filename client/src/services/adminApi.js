import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api/admin`;

// Helper to attach authorization header
function getAuthHeaders() {
  const token = localStorage.getItem('smartprice_token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
}

/**
 * Fetch platform overview KPIs, retailer adapter health & activities
 */
export async function getAdminAnalyticsApi() {
  const res = await axios.get(`${API_BASE}/analytics`, getAuthHeaders());
  return res.data;
}

/**
 * Trigger on-demand sync across all 4 retailer mock adapters
 */
export async function triggerSyncApi() {
  const res = await axios.post(`${API_BASE}/sync`, {}, getAuthHeaders());
  return res.data;
}

/**
 * Fetch all catalog products for admin management table
 */
export async function getAdminProductsApi() {
  const res = await axios.get(`${API_BASE}/products`, getAuthHeaders());
  return res.data;
}

/**
 * Toggle product active status
 * @param {string} productId 
 */
export async function toggleProductStatusApi(productId) {
  const res = await axios.patch(`${API_BASE}/products/${productId}/toggle`, {}, getAuthHeaders());
  return res.data;
}

/**
 * Fetch registered users directory
 */
export async function getAdminUsersApi() {
  const res = await axios.get(`${API_BASE}/users`, getAuthHeaders());
  return res.data;
}
