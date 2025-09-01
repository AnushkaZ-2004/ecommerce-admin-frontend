import React, { useState, useEffect } from "react";
import OrderList from "../components/orders/OrderList";
import OrderDetail from "../components/orders/OrderDetail";
import Modal from "../components/common/Modal";
import Loading from "../components/common/Loading";
import { orderService } from "../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Orders</h1>
        <p>Manage customer orders and track their status</p>
      </div>

      <OrderList
        orders={orders}
        onViewOrder={setSelectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />

      {selectedOrder && (
        <Modal onClose={() => setSelectedOrder(null)}>
          <OrderDetail
            order={selectedOrder}
            onStatusUpdate={handleStatusUpdate}
            onClose={() => setSelectedOrder(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Orders;
