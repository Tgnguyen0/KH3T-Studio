// StaffDashboard.jsx — Layout shell matching KREDO Admin aesthetic.
import React, { useState } from 'react';
import StaffSidebar from './Sidebar';

export default function StaffDashboard({ children, defaultTab = 'orders' }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab]     = useState(defaultTab);

  return (
    <div className="flex min-h-screen bg-secondary selection:bg-red-500 selection:text-white">
      <StaffSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}