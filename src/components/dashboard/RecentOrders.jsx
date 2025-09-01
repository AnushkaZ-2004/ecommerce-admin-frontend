// src/components/dashboard/RecentOrders.jsx
import React from "react";
import { formatCurrency, formatDateTime } from "../../utils/helpers";
import { ORDER_STATUS } from "../../utils/constants";

const RecentOrders = ({ orders }) => {
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
      case ORDER_STATUS.PENDING:
        return "gray";
      default:
        return "gray";
    }
  };

  // Mock data in case orders array is empty
  const mockOrders = [
    {
      id: 1,
      customerName: "John Doe",
      customerEmail: "john@example.com",
      totalAmount: 299.99,
      status: "DELIVERED",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      totalAmount: 149.5,
      status: "PROCESSING",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 3,
      customerName: "Bob Johnson",
      customerEmail: "bob@example.com",
      totalAmount: 89.99,
      status: "SHIPPED",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  const displayOrders = orders && orders.length > 0 ? orders : mockOrders;

  return (
    <div className="recent-orders">
      <div className="recent-orders-header">
        <h3>Recent Orders</h3>
        <span className="orders-count">
          {displayOrders.length}{" "}
          {displayOrders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      <div className="orders-list">
        {displayOrders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📋</div>
            <p>No recent orders</p>
            <small>
              Orders will appear here once customers start placing them
            </small>
          </div>
        ) : (
          displayOrders.slice(0, 5).map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-main-info">
                <div className="order-header">
                  <div className="order-id">Order #{order.id}</div>
                  <div className="order-date">
                    {formatDateTime(order.createdAt)}
                  </div>
                </div>
                <div className="order-customer">
                  <span className="customer-name">{order.customerName}</span>
                  <span className="customer-email">{order.customerEmail}</span>
                </div>
              </div>

              <div className="order-details">
                <div className="order-amount">
                  {formatCurrency(order.totalAmount)}
                </div>
                <div
                  className={`order-status status-${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {displayOrders.length > 5 && (
        <div className="orders-footer">
          <button className="view-all-orders">
            View All Orders ({displayOrders.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
