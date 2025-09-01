import api from "./api";

export const analyticsService = {
  getDashboardData: async () => {
    const response = await api.get("/analytics/dashboard");
    return response.data;
  },

  getSalesAnalytics: async () => {
    const response = await api.get("/analytics/sales");
    return response.data;
  },

  getProductAnalytics: async () => {
    const response = await api.get("/analytics/products");
    return response.data;
  },

  getCustomerAnalytics: async () => {
    const response = await api.get("/analytics/customers");
    return response.data;
  },
};
