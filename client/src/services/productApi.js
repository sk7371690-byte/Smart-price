import api from './api';

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getProductOffers = async (id) => {
  const response = await api.get(`/products/${id}/offers`);
  return response.data;
};

export const getSearchSuggestions = async (q = '') => {
  const response = await api.get('/search', { params: { q } });
  return response.data;
};
