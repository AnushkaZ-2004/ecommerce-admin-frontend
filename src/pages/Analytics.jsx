import React from "react";
import SalesAnalytics from "../components/analytics/SalesAnalytics";
import ProductAnalytics from "../components/analytics/ProductAnalytics";
import CustomerAnalytics from "../components/analytics/CustomerAnalytics";

const Analytics = () => {
  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Get insights into your business performance</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-section">
          <SalesAnalytics />
        </div>

        <div className="analytics-section">
          <ProductAnalytics />
        </div>

        <div className="analytics-section">
          <CustomerAnalytics />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
