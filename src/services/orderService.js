// Update your src/services/orderService.js in the customer frontend

import api from "./api";
import { generateOrderId } from "../utils/helpers";

export const orderService = {
  createOrder: async (orderData) => {
    try {
      console.log("Creating order with data:", orderData); // Debug log
      const response = await api.post("/orders", orderData);
      console.log("Order creation response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Order creation failed:", error); // Debug log

      // Don't use mock data for production - this could be why orders aren't saving
      // Instead, throw the error so it can be handled properly
      throw new Error(
        "Order creation failed: " +
          (error.response?.data?.message || error.message)
      );

      // Remove this mock order creation that was bypassing the real API:
      /*
      const mockOrder = {
        id: Math.floor(Math.random() * 10000) + 1,
        orderId: generateOrderId(),
        ...orderData,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      return mockOrder;
      */
    }
  },

  getOrderHistory: async (customerId) => {
    try {
      const response = await api.get(`/orders/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch order history:", error);
      // Return empty array instead of mock data
      return [];
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch order:", error);
      throw error;
    }
  },
};
