import api from "./api";

export const orderService = {
  getAllOrders: async () => {
    const response = await api.get("/orders");
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};
