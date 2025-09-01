import React, { useState, useEffect } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { analyticsService } from "../../services/analyticsService";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const ProductAnalytics = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("categories");

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const data = await analyticsService.getProductAnalytics();
      setProductData(data);
    } catch (error) {
      console.error("Error fetching product analytics:", error);
      // Mock data for demonstration
      setProductData({
        totalProducts: 150,
        categoryDistribution: [
          ["Electronics", 45],
          ["Clothing", 35],
          ["Books", 25],
          ["Home & Garden", 20],
          ["Sports", 15],
          ["Toys", 10],
        ],
        lowStockProducts: [
          {
            id: 1,
            name: "iPhone 13",
            stockQuantity: 3,
            category: "Electronics",
          },
          { id: 2, name: "Nike Air Max", stockQuantity: 5, category: "Sports" },
          {
            id: 3,
            name: "Coffee Maker",
            stockQuantity: 2,
            category: "Home & Garden",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryChartData = () => {
    if (!productData?.categoryDistribution) return null;

    return {
      labels: productData.categoryDistribution.map((item) => item[0]),
      datasets: [
        {
          data: productData.categoryDistribution.map((item) => item[1]),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#FF6384",
            "#C9CBCF",
          ],
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    };
  };

  const getStockChartData = () => {
    if (!productData?.lowStockProducts) return null;

    return {
      labels: productData.lowStockProducts.map((item) => item.name),
      datasets: [
        {
          label: "Stock Quantity",
          data: productData.lowStockProducts.map((item) => item.stockQuantity),
          backgroundColor: productData.lowStockProducts.map((item) =>
            item.stockQuantity < 5 ? "#dc3545" : "#ffc107"
          ),
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text:
          viewMode === "categories" ? "Product Categories" : "Low Stock Alert",
      },
    },
  };

  const stockChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Low Stock Products",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading)
    return (
      <div className="analytics-loading">Loading product analytics...</div>
    );

  const categoryChartData = getCategoryChartData();
  const stockChartData = getStockChartData();

  return (
    <div className="analytics-card">
      <div className="analytics-header">
        <h2>Product Analytics</h2>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${
              viewMode === "categories" ? "active" : ""
            }`}
            onClick={() => setViewMode("categories")}
          >
            Categories
          </button>
          <button
            className={`toggle-btn ${viewMode === "stock" ? "active" : ""}`}
            onClick={() => setViewMode("stock")}
          >
            Stock Levels
          </button>
        </div>
      </div>

      <div className="analytics-summary">
        <div className="summary-item">
          <h3>Total Products</h3>
          <p className="summary-value">
            {productData?.totalProducts?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="summary-item">
          <h3>Categories</h3>
          <p className="summary-value">
            {productData?.categoryDistribution?.length || "0"}
          </p>
        </div>
        <div className="summary-item">
          <h3>Low Stock Items</h3>
          <p className="summary-value danger">
            {productData?.lowStockProducts?.length || "0"}
          </p>
        </div>
      </div>

      <div className="chart-container">
        {viewMode === "categories" && categoryChartData ? (
          <div className="chart-wrapper">
            <Doughnut data={categoryChartData} options={chartOptions} />
          </div>
        ) : viewMode === "stock" && stockChartData ? (
          <div className="chart-wrapper">
            <Bar data={stockChartData} options={stockChartOptions} />
          </div>
        ) : (
          <div className="no-data">No product data available</div>
        )}
      </div>

      {viewMode === "categories" && productData?.categoryDistribution && (
        <div className="category-breakdown">
          <h3>Category Breakdown</h3>
          <div className="category-list">
            {productData.categoryDistribution.map((item, index) => {
              const percentage = (
                (item[1] / productData.totalProducts) *
                100
              ).toFixed(1);
              return (
                <div key={index} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{item[0]}</span>
                    <span className="category-percentage">{percentage}%</span>
                  </div>
                  <div className="category-details">
                    <span className="category-count">{item[1]} products</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "stock" && productData?.lowStockProducts?.length > 0 && (
        <div className="low-stock-section">
          <h3>Low Stock Alert</h3>
          <div className="low-stock-list">
            {productData.lowStockProducts.map((product, index) => (
              <div key={index} className="low-stock-item">
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-category">{product.category}</span>
                </div>
                <div className="stock-info">
                  <span
                    className={`stock-quantity ${
                      product.stockQuantity < 5 ? "critical" : "low"
                    }`}
                  >
                    {product.stockQuantity} left
                  </span>
                  <span className="stock-status">
                    {product.stockQuantity < 5 ? "Critical" : "Low Stock"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAnalytics;
