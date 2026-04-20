import React, { useEffect, useState } from "react";
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,LineChart,Line,} from "recharts";

// Product Report Page with time filter, export CSV, and product selector for sales line chart
export default function ProductReport() {
  const [bestSeller, setBestSeller] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [salesHistory, setSalesHistory] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // load default 30-day data
    const now = new Date();
    const prior = new Date();
    prior.setDate(now.getDate() - 30);
    setStartDate(prior.toISOString().slice(0, 10));
    setEndDate(now.toISOString().slice(0, 10));
    loadBestSeller(prior.toISOString().slice(0, 10), now.toISOString().slice(0, 10));
    loadInventory();
  }, []);

  const buildQuery = (base, params) => {
    const query = new URLSearchParams(params);
    return `${base}?${query.toString()}`;
  };

  const loadBestSeller = async (start = "", end = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = buildQuery("http://localhost:8080/reports/products/best-seller", {
        limit: 10,
        start,
        end,
      });
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      // support both data.result or direct array
      setBestSeller(data.result || data || []);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadInventory = async () => {
    try {
      const res = await fetch("http://localhost:8080/reports/products/inventory");
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      setInventory(data.result || data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadSalesHistory = async (id, start = startDate, end = endDate) => {
    if (!id) return setSalesHistory([]);
    try {
      const url = buildQuery(`http://localhost:8080/reports/products/${id}/sales`, { days: 30, start, end });
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      setSalesHistory(data.result || data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFilter = () => {
    // reload best seller with date range
    loadBestSeller(startDate, endDate);
    // if a product is selected, reload its history
    if (selectedProduct) loadSalesHistory(selectedProduct.productId, startDate, endDate);
  };

  const handleSelectProduct = (productId) => {
    const p = bestSeller.find((b) => b.productId === Number(productId));
    setSelectedProduct(p || null);
    if (p) loadSalesHistory(p.productId, startDate, endDate);
  };

  const pieData = [
    { name: "Hết hàng", value: inventory.filter((i) => i.stock === 0).length },
    { name: "Tồn thấp", value: inventory.filter((i) => i.stock < 10 && i.stock > 0).length },
    { name: "Tồn ổn", value: inventory.filter((i) => i.stock >= 10 && i.stock <= 50).length },
    { name: "Tồn nhiều", value: inventory.filter((i) => i.stock > 50).length },
  ];

  const exportCSV = (rows, filename = "report.csv") => {
    if (!rows || rows.length === 0) {
      alert("Không có dữ liệu để xuất");
      return;
    }
    // get headers from first object
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(",")]
      .concat(
        rows.map((r) => headers.map((h) => {
          const cell = r[h] === null || r[h] === undefined ? "" : String(r[h]).replace(/"/g, '""');
          return `"${cell}"`;
        }).join(","))
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">📊 Thống Kê Sản Phẩm</h1>

      {/* Time Filters + Export */}
      <div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded shadow">
        <div>
          <label className="text-sm text-gray-600">Từ ngày</label>
          <input
            type="date"
            className="border px-2 py-1 rounded w-40"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Đến ngày</label>
          <input
            type="date"
            className="border px-2 py-1 rounded w-40"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Chọn sản phẩm</label>
          <select className="border px-2 py-1 rounded w-64" onChange={(e) => handleSelectProduct(e.target.value)} value={selectedProduct?.productId || ""}>
            <option value="">-- Chọn (xem luồng doanh thu) --</option>
            {bestSeller.map((b) => (
              <option key={b.productId} value={b.productId}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleFilter}
          >
            Lọc
          </button>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => exportCSV(bestSeller, `bestseller_${startDate || 'all'}_${endDate || 'all'}.csv`)}
          >
            Xuất Excel (CSV)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded shadow p-4">
          <p className="text-gray-500">Tổng số sản phẩm</p>
          <h2 className="text-3xl font-bold">{inventory.length}</h2>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-gray-500">Top bán chạy</p>
          <h2 className="text-3xl font-bold">{bestSeller.length}</h2>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-gray-500">Tồn kho thấp</p>
          <h2 className="text-3xl font-bold">{pieData[1].value}</h2>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-gray-500">Hết hàng</p>
          <h2 className="text-3xl font-bold">{pieData[0].value}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Best Seller Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Top sản phẩm bán chạy</h2>
          {loading ? (
            <div className="text-gray-600">Đang tải...</div>
          ) : error ? (
            <div className="text-red-600">Lỗi: {error}</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bestSeller}>
                <XAxis dataKey="name" hide={false} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sold" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Inventory Pie */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Phân bố tồn kho</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" data={pieData} label>
                {pieData.map((_, i) => (
                  <Cell key={i} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales history chart */}
      {selectedProduct && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-3">Biểu đồ doanh số: {selectedProduct.name}</h2>
          {salesHistory && salesHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesHistory}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="quantity" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-500">Không có dữ liệu doanh số cho khoảng thời gian đã chọn.</div>
          )}
        </div>
      )}
    </div>
  );
}
