import React from "react";
import { formatCurrency, formatDateTime } from "../../utils/helpers";
import OrderStatusUpdate from "./OrderStatusUpdate";

const OrderDetail = ({ order, onStatusUpdate, onClose }) => {
  const calculateItemsTotal = () => {
    if (!order.orderItems || order.orderItems.length === 0) {
      return order.totalAmount || 0;
    }
    return order.orderItems.reduce(
      (total, item) => total + (item.subtotal || 0),
      0
    );
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case "credit card":
        return "💳";
      case "debit card":
        return "💳";
      case "paypal":
        return "🅿️";
      case "cash":
        return "💵";
      default:
        return "💰";
    }
  };

  return (
    <div className="order-detail">
      <div className="order-detail-header">
        <div className="header-left">
          <h2>Order #{order.id}</h2>
          <span className="order-date">
            Placed on {formatDateTime(order.createdAt)}
          </span>
        </div>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="order-info-grid">
        <div className="order-section">
          <h3>Order Information</h3>
          <div className="info-list">
            <div className="info-item">
              <label>Order ID:</label>
              <span>#{order.id}</span>
            </div>
            <div className="info-item">
              <label>Order Date:</label>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
            {order.updatedAt && order.updatedAt !== order.createdAt && (
              <div className="info-item">
                <label>Last Updated:</label>
                <span>{formatDateTime(order.updatedAt)}</span>
              </div>
            )}
            <div className="info-item">
              <label>Status:</label>
              <OrderStatusUpdate
                currentStatus={order.status}
                orderId={order.id}
                onStatusUpdate={onStatusUpdate}
              />
            </div>
            <div className="info-item">
              <label>Total Amount:</label>
              <span className="total-amount">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="order-section">
          <h3>Customer Information</h3>
          <div className="info-list">
            <div className="info-item">
              <label>Name:</label>
              <span>{order.customerName}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{order.customerEmail}</span>
            </div>
            <div className="info-item">
              <label>Customer ID:</label>
              <span>#{order.customerId}</span>
            </div>
            {order.shippingAddress && (
              <div className="info-item">
                <label>Shipping Address:</label>
                <span>{order.shippingAddress}</span>
              </div>
            )}
            {order.paymentMethod && (
              <div className="info-item">
                <label>Payment Method:</label>
                <span>
                  {getPaymentMethodIcon(order.paymentMethod)}{" "}
                  {order.paymentMethod}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {order.orderItems && order.orderItems.length > 0 ? (
        <div className="order-items-section">
          <h3>Order Items ({order.orderItems.length})</h3>
          <div className="items-table">
            <div className="items-table-header">
              <div>Product</div>
              <div>Quantity</div>
              <div>Unit Price</div>
              <div>Subtotal</div>
            </div>
            {order.orderItems.map((item, index) => (
              <div key={item.id || index} className="items-table-row">
                <div className="item-product">
                  <div className="product-name">{item.productName}</div>
                  <div className="product-id">
                    Product ID: #{item.productId}
                  </div>
                </div>
                <div className="item-quantity">{item.quantity}</div>
                <div className="item-price">{formatCurrency(item.price)}</div>
                <div className="item-subtotal">
                  {formatCurrency(item.subtotal)}
                </div>
              </div>
            ))}

            <div className="items-table-footer">
              <div className="total-row">
                <span>Items Total:</span>
                <span className="total-value">
                  {formatCurrency(calculateItemsTotal())}
                </span>
              </div>
              {calculateItemsTotal() !== order.totalAmount && (
                <>
                  <div className="total-row">
                    <span>Shipping & Tax:</span>
                    <span className="total-value">
                      {formatCurrency(
                        order.totalAmount - calculateItemsTotal()
                      )}
                    </span>
                  </div>
                  <div className="total-row final-total">
                    <span>Order Total:</span>
                    <span className="total-value">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="order-items-section">
          <h3>Order Items</h3>
          <div className="no-items">
            <p>No item details available for this order</p>
            <div className="order-total-fallback">
              <span>Order Total: {formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="order-actions-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
