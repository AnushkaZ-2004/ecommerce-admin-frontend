import React, { useState, useEffect } from "react";
import DashboardCards from "../components/dashboard/DashboardCards";
import SalesChart from "../components/dashboard/SalesChart";
import RecentOrders from "../components/dashboard/RecentOrders";
import Loading from "../components/common/Loading";
import { analyticsService } from "../services/analyticsService";
import { orderService } from "../services/orderService";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, ordersData] = await Promise.all([
          analyticsService.getDashboardData(),
          orderService.getAllOrders(),
        ]);

        setDashboardData(dashData);
        setRecentOrders(ordersData.slice(0, 10));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your store.</p>
      </div>

      <DashboardCards data={dashboardData} />

      <div className="dashboard-grid">
        <div className="dashboard-item">
          <SalesChart />
        </div>

        <div className="dashboard-item">
          <RecentOrders orders={recentOrders} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
