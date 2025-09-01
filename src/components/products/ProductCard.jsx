import React, { useState } from "react";
import { formatCurrency } from "../../utils/helpers";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(product.id);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: "out-of-stock", text: "Out of Stock" };
    if (stock < 10) return { status: "low-stock", text: "Low Stock" };
    return { status: "in-stock", text: "In Stock" };
  };

  const stockInfo = getStockStatus(product.stockQuantity || 0);

  return (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl && !imageError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="no-image">
            <span className="no-image-icon">🖼️</span>
            <span>No Image</span>
          </div>
        )}

        {!product.active && (
          <div className="inactive-overlay">
            <span>Inactive</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name" title={product.name}>
            {product.name}
          </h3>
          {product.category && (
            <span className="product-category">{product.category}</span>
          )}
        </div>

        {product.description && (
          <p className="product-description" title={product.description}>
            {product.description.length > 100
              ? product.description.substring(0, 100) + "..."
              : product.description}
          </p>
        )}

        <div className="product-details">
          <div className="price-stock-row">
            <span className="product-price">
              {formatCurrency(product.price || 0)}
            </span>
            <span className={`stock-status ${stockInfo.status}`}>
              {product.stockQuantity || 0} {stockInfo.text}
            </span>
          </div>
        </div>

        <div className="product-actions">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => onEdit(product)}
            disabled={loading}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
