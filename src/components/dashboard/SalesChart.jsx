// src/components/dashboard/SalesChart.jsx
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { analyticsService } from "../../services/analyticsService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const data = await analyticsService.getSalesAnalytics();
      if (data.dailySales && data.dailySales.length > 0) {
        const labels = data.dailySales.map((item) => {
          const date = new Date(item[0]);
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        });
        const values = data.dailySales.map((item) => parseFloat(item[1]) || 0);

        setChartData({
          labels,
          datasets: [
            {
              label: "Daily Sales ($)",
              data: values,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.1,
              fill: true,
            },
          ],
        });
      } else {
        // Mock data for demonstration
        const mockLabels = [
          "Jan 1",
          "Jan 2",
          "Jan 3",
          "Jan 4",
          "Jan 5",
          "Jan 6",
          "Jan 7",
        ];
        const mockData = [1200, 1900, 3000, 5000, 2000, 3000, 4500];

        setChartData({
          labels: mockLabels,
          datasets: [
            {
              label: "Daily Sales ($)",
              data: mockData,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.1,
              fill: true,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
      // Fallback to mock data
      const mockLabels = [
        "Jan 1",
        "Jan 2",
        "Jan 3",
        "Jan 4",
        "Jan 5",
        "Jan 6",
        "Jan 7",
      ];
      const mockData = [1200, 1900, 3000, 5000, 2000, 3000, 4500];

      setChartData({
        labels: mockLabels,
        datasets: [
          {
            label: "Daily Sales ($)",
            data: mockData,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.1,
            fill: true,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sales Overview - Last 7 Days",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="chart-container">
        <h3>Sales Chart</h3>
        <div className="loading-chart">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Sales Chart</h3>
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="no-data">No sales data available</div>
      )}
    </div>
  );
};

export default SalesChart;
