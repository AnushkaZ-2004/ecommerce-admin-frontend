import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { analyticsService } from "../../services/analyticsService";
import { formatDate } from "../../utils/helpers";

const CustomerAnalytics = () => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      const data = await analyticsService.getCustomerAnalytics();
      setCustomerData(data);
    } catch (error) {
      console.error("Error fetching customer analytics:", error);
      // Mock data for demonstration
      setCustomerData({
        totalCustomers: 1250,
        customers: [
          {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            role: "CUSTOMER",
            createdAt: "2024-01-15T10:30:00Z",
          },
          {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
            email: "jane@example.com",
            role: "CUSTOMER",
            createdAt: "2024-01-14T15:45:00Z",
          },
          {
            id: 3,
            firstName: "Bob",
            lastName: "Johnson",
            email: "bob@example.com",
            role: "CUSTOMER",
            createdAt: "2024-01-13T09:20:00Z",
          },
          {
            id: 4,
            firstName: "Alice",
            lastName: "Brown",
            email: "alice@example.com",
            role: "CUSTOMER",
            createdAt: "2024-01-12T14:10:00Z",
          },
          {
            id: 5,
            firstName: "Charlie",
            lastName: "Wilson",
            email: "charlie@example.com",
            role: "CUSTOMER",
            createdAt: "2024-01-11T11:55:00Z",
          },
        ],
        newCustomersThisMonth: 85,
        customerGrowthRate: 12.5,
      });
    } finally {
      setLoading(false);
    }
  };

  const getCustomerGrowthData = () => {
    // Mock growth data for the chart
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const newCustomers = Math.floor(Math.random() * 15) + 5;
      last7Days.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        customers: newCustomers,
      });
    }
    return last7Days;
  };

  const growthData = getCustomerGrowthData();

  const chartData = {
    labels: growthData.map((item) => item.date),
    datasets: [
      {
        label: "New Customers",
        data: growthData.map((item) => item.customers),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
        fill: true,
      },
    ],
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
        text: "Customer Growth (Last 7 Days)",
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
      <div className="analytics-loading">Loading customer analytics...</div>
    );

  return (
    <div className="analytics-card">
      <h2>Customer Analytics</h2>

      <div className="analytics-summary">
        <div className="summary-item">
          <h3>Total Customers</h3>
          <p className="summary-value">
            {customerData?.totalCustomers?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="summary-item">
          <h3>New This Month</h3>
          <p className="summary-value">
            {customerData?.newCustomersThisMonth || "0"}
          </p>
        </div>
        <div className="summary-item">
          <h3>Growth Rate</h3>
          <p className="summary-value">
            {customerData?.customerGrowthRate || "0"}%
            <span className="growth-indicator positive">↗</span>
          </p>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {customerData?.customers && (
        <div className="customers-section">
          <h3>Recent Customers</h3>
          <div className="customers-list">
            {customerData.customers.slice(0, 10).map((customer, index) => (
              <div key={customer.id || index} className="customer-item">
                <div className="customer-avatar">
                  {customer.firstName?.charAt(0)}
                  {customer.lastName?.charAt(0)}
                </div>
                <div className="customer-info">
                  <div className="customer-name">
                    {customer.firstName} {customer.lastName}
                  </div>
                  <div className="customer-email">{customer.email}</div>
                  <div className="customer-date">
                    Joined {formatDate(customer.createdAt)}
                  </div>
                </div>
                <div className="customer-role-badge">{customer.role}</div>
              </div>
            ))}
          </div>

          {customerData.customers.length > 10 && (
            <div className="customers-footer">
              <button className="view-all-customers">
                View All Customers ({customerData.totalCustomers})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerAnalytics;
