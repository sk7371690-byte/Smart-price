import api from './api';

export const getPriceHistory = async (productId, days = 30) => {
  const response = await api.get(`/products/${productId}/history`, {
    params: { days },
  });
  return response.data;
};

export const recordPriceSnapshot = async (productId, data) => {
  const response = await api.post(`/products/${productId}/history`, data);
  return response.data;
};
