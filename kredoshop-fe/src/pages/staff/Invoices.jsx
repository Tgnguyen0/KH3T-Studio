import React, { useState, useEffect } from "react";
import { FaEye, FaSync, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Fetch invoices
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/invoices");
      if (!res.ok) {
        alert("Cannot load invoices");
        return;
      }
      const data = await res.json();
      setInvoices(Array.isArray(data) ? data : data?.result || []);
    } catch (error) {
      console.error("Error loading invoices:", error);
      alert("Error loading invoices");
    } finally {
      setLoading(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter((invoice) => {
      const matchSearch =
        invoice.id?.toString().includes(searchTerm) ||
        (invoice.invoiceCode &&
          invoice.invoiceCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (invoice.order?.orderCode &&
          invoice.order.orderCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchStatus =
        statusFilter === "all" || invoice.paymentStatus === statusFilter;

      const matchPaymentMethod =
        paymentMethodFilter === "all" ||
        invoice.paymentMethod === paymentMethodFilter;

      return matchSearch && matchStatus && matchPaymentMethod;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.createdAt || b.createDate) -
            new Date(a.createdAt || a.createDate)
          );
        case "date-asc":
          return (
            new Date(a.createdAt || a.createDate) -
            new Date(b.createdAt || b.createDate)
          );
        case "amount-desc":
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        case "amount-asc":
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        default:
          return 0;
      }
    });

  // View invoice details
  //   const handleViewDetails = (invoice) => {
  //     setSelectedInvoice(invoice);
  //     setShowDetailModal(true);
  //   };

  // Get payment status badge color
  // Get payment status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border border-green-300";
      case "UNPAID":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  // Get payment method display
  const getPaymentMethodDisplay = (method) => {
    const methods = {
      CASH: "💵 Cash",
      CREDIT_CARD: "💳 Credit Card",
      DEBIT_CARD: "💳 Debit Card",
      BANK_TRANSFER: "🏦 Bank Transfer",
      MOMO: "📱 MoMo",
      ZALOPAY: "📱 ZaloPay",
      VNPAY: "💳 VNPay",
    };
    return methods[method] || method;
  };

  // Get sort icon
  const getSortIcon = (type) => {
    if (sortBy === `${type}-desc`) return <FaSortDown />;
    if (sortBy === `${type}-asc`) return <FaSortUp />;
    return <FaSort />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Invoice Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and track customer invoices
              </p>
            </div>
            {/* Refresh Button */}
            <button
              onClick={loadInvoices}
              className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2 shadow-sm"
              title="Refresh invoices"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Invoices
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ID, Invoice Code, Order Code..."
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-base"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-base font-medium"
              >
                <option value="all">All Status</option>
                <option value="PAID">🟢 Paid</option>
                <option value="UNPAID">🟡 Unpaid</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-base font-medium"
              >
                <option value="all">All Methods</option>
                <option value="CASH">💵 Cash</option>
                <option value="BANK_TRANSFER">🏦 Bank Transfer</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-base font-medium"
              >
                <option value="date-desc">📅 Newest First</option>
                <option value="date-asc">📅 Oldest First</option>
                <option value="amount-desc">💰 Highest Amount</option>
                <option value="amount-asc">💰 Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
          </div>
        )}

        {/* Invoices Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-xl font-medium">
                  No invoices found
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-5 text-left text-base font-bold tracking-wide">
                        INVOICE ID
                      </th>
                      <th className="px-11 py-5 text-left text-base font-bold tracking-wide">
                        INVOICE CODE
                      </th>
                      <th className="px-6 py-5 text-left text-base font-bold tracking-wide">
                        ORDER CODE
                      </th>
                      <th className="px-6 py-5 text-left text-base font-bold tracking-wide">
                        <div className="flex items-center gap-2">
                          CREATE DATE {getSortIcon("date")}
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-base font-bold tracking-wide">
                        PAYMENT METHOD
                      </th>
                      <th className="px-6 py-5 text-left text-base font-bold tracking-wide">
                        PAYMENT STATUS
                      </th>
                      <th className="px-3 py-5 text-left text-base font-bold tracking-wide">
                        <div className="flex items-center gap-2">
                          TOTAL AMOUNT {getSortIcon("amount")}
                        </div>
                      </th>
                      {/* <th className="px-6 py-5 text-center text-base font-bold tracking-wide">
                        VIEW
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-5 text-base font-bold text-gray-900">
                          #{invoice.id}
                        </td>
                        <td className="px-6 py-5 text-base font-semibold text-gray-700">
                          {invoice.invoiceCode || "N/A"}
                        </td>
                        <td className="px-6 py-5 text-base font-semibold text-blue-600">
                          {invoice.order?.orderCode || "N/A"}
                        </td>
                        <td className="px-6 py-5 text-base text-gray-700">
                          {formatDate(invoice.createdAt || invoice.createDate)}
                        </td>
                        <td className="px-6 py-5 text-base font-semibold text-gray-900">
                          {getPaymentMethodDisplay(invoice.paymentMethod)}
                        </td>
                        <td className="px-6 py-5 text-base">
                          <span
                            className={`px-4 py-2 rounded-lg text-sm font-bold inline-block ${getStatusColor(
                              invoice.paymentStatus
                            )}`}
                          >
                            {invoice.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-base font-bold text-red-600">
                          {formatPrice(invoice.totalAmount || 0)}
                        </td>
                        {/* <td className="px-6 py-5">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleViewDetails(invoice)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-all shadow-sm text-sm"
                            >
                              <FaEye size={16} />
                              <span>View</span>
                            </button>
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary */}
            {!loading && filteredInvoices.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200">
                <p className="text-base text-gray-700 font-semibold">
                  Showing {filteredInvoices.length} invoice
                  {filteredInvoices.length !== 1 ? "s" : ""}
                  {statusFilter !== "all" && ` (${statusFilter})`}
                  {paymentMethodFilter !== "all" &&
                    ` - ${getPaymentMethodDisplay(paymentMethodFilter)}`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-700 px-8 py-6 flex justify-between items-center rounded-t-xl z-10">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Invoice Details
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  Complete invoice information
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-white hover:text-gray-300 text-4xl font-bold transition-colors leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* 1. Invoice Information */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  🧾 Invoice Information
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Invoice ID
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      #{selectedInvoice.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Invoice Code
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedInvoice.invoiceCode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Order Code
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {selectedInvoice.order?.orderCode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Create Date
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatDate(
                        selectedInvoice.createdAt || selectedInvoice.createDate
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Payment Method
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {getPaymentMethodDisplay(selectedInvoice.paymentMethod)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Payment Status
                    </p>
                    <span
                      className={`text-sm font-bold px-4 py-2 rounded-lg inline-block ${getStatusColor(
                        selectedInvoice.paymentStatus
                      )}`}
                    >
                      {selectedInvoice.paymentStatus}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Total Amount
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {formatPrice(selectedInvoice.totalAmount || 0)}
                    </p>
                  </div>
                  {selectedInvoice.paidAt && (
                    <div className="col-span-3">
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        Paid At
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {formatDate(selectedInvoice.paidAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Customer Information */}
              {selectedInvoice.customerName && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    👤 Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        Name
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedInvoice.customerName}
                      </p>
                    </div>
                    {selectedInvoice.customerPhone && (
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Phone
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          📞 {selectedInvoice.customerPhone}
                        </p>
                      </div>
                    )}
                    {selectedInvoice.customerEmail && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Email
                        </p>
                        <p className="text-base text-gray-900">
                          ✉️ {selectedInvoice.customerEmail}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Transaction Information */}
              {selectedInvoice.transactionId && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    💳 Transaction Details
                  </h3>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Transaction ID
                    </p>
                    <p className="text-base font-mono font-bold text-gray-900 bg-white p-3 rounded-lg border border-purple-300">
                      {selectedInvoice.transactionId}
                    </p>
                  </div>
                </div>
              )}

              {/* 4. Notes */}
              {selectedInvoice.notes && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    📝 Notes
                  </h3>
                  <p className="text-base text-gray-900 bg-white p-4 rounded-lg border border-yellow-300">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-100 px-8 py-5 border-t-2 border-gray-300 flex justify-end rounded-b-xl">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-8 py-3 text-gray-700 hover:text-gray-900 font-bold border-2 border-gray-400 rounded-lg hover:bg-gray-200 transition-all text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
