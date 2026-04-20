import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Customers from './Customers';
import Products from './Products';
import Employees from './Employees';
import ProductDashboard from './ProductDashboard';
import AdminChatBot from '../../components/AdminChatBot';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

 const [initialProductFilter, setInitialProductFilter] = useState('ALL'); 

  // Hàm này nhận 'ALL' hoặc 'LOW_STOCK' từ ProductDashboard
  const handleNavigateToProducts = (filterType) => {
    setInitialProductFilter(filterType); 
    setActiveTab('products'); // Chuyển tab
  };
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <Customers />;
      case 'employees':
        return <Employees/>;
      case 'products':
        return <Products initialFilter={initialProductFilter}  />;
      case 'productDashboard':
        return <ProductDashboard onNavigate={handleNavigateToProducts}/>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
      <AdminChatBot/>
    </div>
  );
}