// src/components/dashboard/DashboardCards.jsx
import React from "react";
import { formatCurrency } from "../../utils/helpers";

const DashboardCards = ({ data }) => {
  if (!data) return null;

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(data.totalRevenue || 0),
      icon: "💰",
      color: "green",
    },
    {
      title: "Total Orders",
      value: data.totalOrders?.toLocaleString() || "0",
      icon: "📦",
      color: "blue",
    },
    {
      title: "Total Customers",
      value: data.totalCustomers?.toLocaleString() || "0",
      icon: "👥",
      color: "purple",
    },
    {
      title: "Total Products",
      value: data.totalProducts?.toLocaleString() || "0",
      icon: "🛍️",
      color: "orange",
    },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card, index) => (
        <div key={index} className={`dashboard-card ${card.color}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-content">
            <h3>{card.value}</h3>
            <p>{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
