import React, { useState } from "react";
import OrderStatusUpdate from "./OrderStatusUpdate";
import { formatCurrency, formatDateTime } from "../../utils/helpers";
import { ORDER_STATUS } from "../../utils/constants";

const OrderList = ({ orders, onViewOrder, onStatusUpdate }) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
        break;
      case "amount":
        comparison = (a.totalAmount || 0) - (b.totalAmount || 0);
        break;
      case "customer":
        comparison = (a.customerName || "").localeCompare(b.customerName || "");
        break;
      case "status":
        comparison = (a.status || "").localeCompare(b.status || "");
        break;
      default:
        return 0;
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });

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

  const getOrderStats = () => {
    const total = orders.length;
    const byStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return { total, byStatus };
  };

  const stats = getOrderStats();

  return (
    <div className="order-list">
      <div className="order-header">
        <div className="order-stats">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <div key={status} className="stat-item">
              <span className="stat-value">{count}</span>
              <span className={`stat-label status-${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="order-filters">
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="">All Status</option>
            {Object.values(ORDER_STATUS).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-filter"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="customer">Sort by Customer</option>
            <option value="status">Sort by Status</option>
          </select>

          <button
            className={`sort-order-btn ${sortOrder}`}
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>

        <div className="results-info">
          Showing {sortedOrders.length} of {orders.length} orders
        </div>
      </div>

      <div className="orders-table">
        <div className="table-header">
          <div>Order ID</div>
          <div>Customer</div>
          <div>Date</div>
          <div>Total</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {sortedOrders.length > 0 ? (
          sortedOrders.map((order) => (
            <div key={order.id} className="table-row">
              <div className="order-id">#{order.id}</div>
              <div className="customer-info">
                <div className="customer-name">{order.customerName}</div>
                <div className="customer-email">{order.customerEmail}</div>
              </div>
              <div className="order-date">
                {formatDateTime(order.createdAt)}
              </div>
              <div className="order-total">
                {formatCurrency(order.totalAmount)}
              </div>
              <div className="order-status-cell">
                <OrderStatusUpdate
                  currentStatus={order.status}
                  orderId={order.id}
                  onStatusUpdate={onStatusUpdate}
                />
              </div>
              <div className="order-actions">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => onViewOrder(order)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-orders">
            <div className="no-orders-icon">📋</div>
            <h3>No orders found</h3>
            <p>
              {statusFilter
                ? `No orders with status "${statusFilter}"`
                : "No orders have been placed yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
