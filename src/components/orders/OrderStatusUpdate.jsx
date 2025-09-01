import React, { useState } from "react";
import { ORDER_STATUS } from "../../utils/constants";

const OrderStatusUpdate = ({ currentStatus, orderId, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus !== currentStatus && onStatusUpdate) {
      setLoading(true);
      try {
        await onStatusUpdate(orderId, newStatus);
      } catch (error) {
        console.error("Failed to update order status:", error);
        // Reset select to previous value on error
        e.target.value = currentStatus;
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.DELIVERED:
        return "green";
      case ORDER_STATUS.SHIPPED:
        return "orange";
      case ORDER_STATUS.PROCESSING:
        return "blue";
      case ORDER_STATUS.CANCELLED:
        return "red";
      case ORDER_STATUS.REFUNDED:
        return "purple";
      default:
        return "gray";
    }
  };

  const getStatusOptions = (current) => {
    // Define logical status transitions
    const transitions = {
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED],
      [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.REFUNDED],
      [ORDER_STATUS.CANCELLED]: [], // Final state
      [ORDER_STATUS.REFUNDED]: [], // Final state
    };

    return [current, ...(transitions[current] || [])];
  };

  const availableStatuses = getStatusOptions(currentStatus);

  return (
    <div className="order-status-update">
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={loading}
        className={`status-select status-${getStatusColor(currentStatus)} ${
          loading ? "loading" : ""
        }`}
      >
        {availableStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      {loading && <span className="status-loading">Updating...</span>}
    </div>
  );
};

export default OrderStatusUpdate;
