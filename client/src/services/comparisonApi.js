import api from './api';

export const compareByQuery = async (query) => {
  const response = await api.get('/compare', { params: { q: query } });
  return response.data;
};

export const compareByProductId = async (productId) => {
  const response = await api.get(`/compare/product/${productId}`);
  return response.data;
};
