import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Customers from "./Customers";
import Products from "./Products";
import Employees from "./Employees";
import ProductDashboard from "./ProductDashboard";
import AdminChatBot from "../../components/AdminChatBot";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [initialProductFilter, setInitialProductFilter] = useState("ALL");

  const handleNavigateToProducts = (filterType) => {
    setInitialProductFilter(filterType);
    setActiveTab("products");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "customers":
        return <Customers />;
      case "employees":
        return <Employees />;
      case "products":
        return <Products initialFilter={initialProductFilter} />;
      case "productDashboard":
        return <ProductDashboard onNavigate={handleNavigateToProducts} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-10">
          <div className="max-w-[1480px] mx-auto">{renderContent()}</div>
        </div>
      </div>
      <AdminChatBot />
    </div>
  );
}
