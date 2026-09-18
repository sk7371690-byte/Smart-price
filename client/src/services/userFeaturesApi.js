import api from './api';

// Wishlist Endpoints
export const getWishlistApi = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const addToWishlistApi = async (productId) => {
  const response = await api.post(`/wishlist/${productId}`);
  return response.data;
};

export const removeFromWishlistApi = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

// Price Alerts Endpoints
export const getAlertsApi = async () => {
  const response = await api.get('/alerts');
  return response.data;
};

export const createAlertApi = async (data) => {
  const response = await api.post('/alerts', data);
  return response.data;
};

export const deleteAlertApi = async (id) => {
  const response = await api.delete(`/alerts/${id}`);
  return response.data;
};

// Notifications Endpoints
export const getNotificationsApi = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markNotificationReadApi = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};
