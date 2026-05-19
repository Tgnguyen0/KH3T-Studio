import React from "react";
import StaffSidebar from "./Sidebar";

export default function StaffDashboard({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 ml-64">
      <StaffSidebar />
      <div className="p-6">{children}</div>
    </div>
  );
}
