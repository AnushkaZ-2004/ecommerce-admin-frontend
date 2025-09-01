import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { analyticsService } from "../../services/analyticsService";
import { formatCurrency } from "../../utils/helpers";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SalesAnalytics = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");
  const [timeRange, setTimeRange] = useState("7days");

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const data = await analyticsService.getSalesAnalytics();
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales analytics:", error);
      // Mock data for demonstration
      setSalesData({
        totalRevenue: 125000,
        totalOrders: 1250,
        dailySales: [
          ["2024-01-01", "2500"],
          ["2024-01-02", "3200"],
          ["2024-01-03", "2800"],
          ["2024-01-04", "4100"],
          ["2024-01-05", "3600"],
          ["2024-01-06", "2900"],
          ["2024-01-07", "3800"],
        ],
        orderStatusDistribution: [
          ["DELIVERED", 450],
          ["SHIPPED", 200],
          ["PROCESSING", 100],
          ["PENDING", 75],
          ["CANCELLED", 25],
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!salesData?.dailySales) return null;

    const labels = salesData.dailySales.map((item) => {
      const date = new Date(item[0]);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });
    const values = salesData.dailySales.map((item) => parseFloat(item[1]) || 0);

    return {
      labels,
      datasets: [
        {
          label: "Daily Sales ($)",
          data: values,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          fill: chartType === "line",
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sales Revenue Trend",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  const calculateGrowth = () => {
    if (!salesData?.dailySales || salesData.dailySales.length < 2) return 0;

    const recent = parseFloat(
      salesData.dailySales[salesData.dailySales.length - 1][1]
    );
    const previous = parseFloat(
      salesData.dailySales[salesData.dailySales.length - 2][1]
    );

    if (previous === 0) return 0;
    return (((recent - previous) / previous) * 100).toFixed(1);
  };

  const getAverageOrderValue = () => {
    if (!salesData?.totalRevenue || !salesData?.totalOrders) return 0;
    return salesData.totalRevenue / salesData.totalOrders;
  };

  if (loading)
    return <div className="analytics-loading">Loading sales analytics...</div>;

  const chartData = getChartData();
  const growth = calculateGrowth();
  const avgOrderValue = getAverageOrderValue();

  return (
    <div className="analytics-card">
      <div className="analytics-header">
        <h2>Sales Analytics</h2>
        <div className="analytics-controls">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="chart-type-select"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 3 Months</option>
          </select>
        </div>
      </div>

      <div className="analytics-summary">
        <div className="summary-item">
          <h3>Total Revenue</h3>
          <p className="summary-value">
            {formatCurrency(salesData?.totalRevenue || 0)}
          </p>
          <span
            className={`growth-indicator ${
              growth >= 0 ? "positive" : "negative"
            }`}
          >
            {growth >= 0 ? "↗" : "↘"} {Math.abs(growth)}% vs yesterday
          </span>
        </div>
        <div className="summary-item">
          <h3>Total Orders</h3>
          <p className="summary-value">
            {salesData?.totalOrders?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="summary-item">
          <h3>Average Order Value</h3>
          <p className="summary-value">{formatCurrency(avgOrderValue)}</p>
        </div>
      </div>

      <div className="chart-container">
        {chartData ? (
          <div className="chart-wrapper">
            {chartType === "bar" ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        ) : (
          <div className="no-data">No sales data available</div>
        )}
      </div>

      {salesData?.orderStatusDistribution && (
        <div className="status-distribution">
          <h3>Order Status Distribution</h3>
          <div className="status-grid">
            {salesData.orderStatusDistribution.map((item, index) => (
              <div key={index} className="status-item">
                <div className="status-info">
                  <span className="status-name">{item[0]}</span>
                  <span className="status-count">{item[1]} orders</span>
                </div>
                <div className="status-bar">
                  <div
                    className="status-fill"
                    style={{
                      width: `${(item[1] / salesData.totalOrders) * 100}%`,
                      backgroundColor: getStatusColor(item[0]),
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    DELIVERED: "#28a745",
    SHIPPED: "#fd7e14",
    PROCESSING: "#007bff",
    PENDING: "#6c757d",
    CANCELLED: "#dc3545",
    REFUNDED: "#6f42c1",
  };
  return colors[status] || "#6c757d";
};

export default SalesAnalytics;
