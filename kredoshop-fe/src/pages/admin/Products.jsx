import React, { useState, useEffect } from "react";
import { Package, Plus, Eye, Edit2, Trash2, Download, RefreshCw, Search, Filter } from "lucide-react";
import AdminChatBot from '../../components/AdminChatBot';

export default function Products({ initialFilter = 'ALL' }) {
  const [products, setProducts]           = useState([]);
  const [categories, setCategories]       = useState([]);
  const [showModal, setShowModal]         = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [filterStock, setFilterStock]     = useState("ALL");
  const [searchTerm, setSearchTerm]       = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus]   = useState("ALL");
  const [sortOption, setSortOption]       = useState("newest");

  const [formData, setFormData] = useState({
    name: "", description: "", categoryId: "", price: 0, costPrice: 0, discountAmount: 0,
    quantity: 0, unit: "Cái", material: "", form: "", imageUrlFront: "", imageUrlBack: "", status: "",
    sizeDetails: [],
  });

  useEffect(() => { setFilterStock(initialFilter === 'LOW_STOCK' ? 'LOW' : 'ALL'); }, [initialFilter]);
  useEffect(() => { loadProducts(); loadCategories(); }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/products");
      const data = await res.json();
      setProducts(data?.result || []);
    } catch (err) { console.log(err); }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/categories");
      const data = await res.json();
      setCategories(data?.result || []);
    } catch (err) { console.log(err); }
  };

  const uploadImageToCloudinary = async (file) => {
    if (!file) return "";
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "products_upload");
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dfecuogtk/image/upload", { method: "POST", body: data });
      if (!response.ok) throw new Error("Upload failed");
      const result = await response.json();
      return result.secure_url;
    } catch (error) { return ""; }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", categoryId: "", price: 0, costPrice: 0, discountAmount: 0, quantity: 0, unit: "Cái", material: "", form: "", imageUrlFront: "", imageUrlBack: "", status: "", sizeDetails: [{ id: 1, nameSize: "S", quantity: 0 }, { id: 2, nameSize: "M", quantity: 0 }, { id: 3, nameSize: "L", quantity: 0 }, { id: 4, nameSize: "XL", quantity: 0 }] });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    const catId = product.category?.id || product.categoryRequest?.id || "";
    const mappedSizes = product.sizeDetails ? product.sizeDetails.map(s => ({ nameSize: s.sizeName || s.sizeRequest?.nameSize || "", quantity: s.quantity })) : [];
    setFormData({ name: product.name, description: product.description || "", categoryId: catId, price: product.price, costPrice: product.costPrice || 0, unit: product.unit || "Cái", imageUrlFront: product.imageUrlFront || "", imageUrlBack: product.imageUrlBack || "", discountAmount: product.discountAmount || 0, material: product.material || "", form: product.form || "", status: product.status || "", quantity: product.quantity, sizeDetails: mappedSizes });
    setShowModal(true);
  };

  const updateSizeDetail = (index, field, value) => {
    const newSizes = [...formData.sizeDetails];
    newSizes[index][field] = value;
    setFormData(prev => ({ ...prev, sizeDetails: newSizes }));
  };

  const saveProduct = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) { alert("Vui lòng đăng nhập lại!"); return; }
    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? `http://localhost:8080/products/${editingProduct.id}` : "http://localhost:8080/products";
    const selectedCategory = categories.find(c => c.id == formData.categoryId);
    const payload = { id: editingProduct ? editingProduct.id : 0, name: formData.name, description: formData.description, price: Number(formData.price), unit: formData.unit, quantity: Number(formData.quantity), imageUrlFront: formData.imageUrlFront, imageUrlBack: formData.imageUrlBack, discountAmount: Number(formData.discountAmount), material: formData.material, form: formData.form, categoryRequest: selectedCategory ? { name: selectedCategory.name, description: selectedCategory.description || "", imageUrl: selectedCategory.imageUrl || "", display_order: selectedCategory.display_order || 1, isActive: true } : null, sizeDetailRequests: formData.sizeDetails.map(item => ({ quantity: Number(item.quantity), sizeRequest: { nameSize: item.nameSize } })) };
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) { setShowModal(false); loadProducts(); }
      else { const errorData = await res.json(); alert(`Lỗi: ${errorData.message || "Không thể lưu sản phẩm"}`); }
    } catch (error) { alert("Lỗi kết nối"); }
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("accessToken");
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    await fetch(`http://localhost:8080/products/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
    loadProducts();
  };

  const handleExport = () => {
    const csv = [["id", "name", "price", "quantity"], ...products.map(p => [p.id, p.name, p.price, p.quantity])].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "products.csv"; a.click();
  };

  const filteredProducts = products.filter(p => {
    const matchCat = filterCategory === "ALL" || p.category?.name === filterCategory;
    const matchStatus = filterStatus === "ALL" || p.status === filterStatus;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStock = filterStock !== 'LOW' || p.quantity <= 10;
    return matchCat && matchStatus && matchSearch && matchStock;
  }).sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "stock-desc") return b.quantity - a.quantity;
    return b.id - a.id;
  });

  const formatCurrency = v => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
  const inputCls = "w-full bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none border border-primary/5";
  const labelCls = "text-[9px] font-black tracking-widest text-primary/40 uppercase mb-1.5 block";

  return (
    <div className="min-h-screen bg-secondary selection:bg-red-500 selection:text-white pb-16">

      {/* ── Header ── */}
      <div className="bg-[#111111] text-white border-b border-white/10 mb-12">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-red-500 text-[9px] font-black tracking-[0.4em] uppercase">QUẢN LÝ HỆ THỐNG — KREDO STUDIO</span>
            <h1 className="text-3xl lg:text-4xl font-display font-black text-white mt-2 uppercase tracking-tight">Sản phẩm</h1>
            <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-2">Quản lý & theo dõi sản phẩm trong hệ thống</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black tracking-widest uppercase transition-colors">
              <Plus size={14} /> Thêm mới
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black tracking-widest uppercase transition-colors border border-white/10">
              <Download size={14} /> Xuất CSV
            </button>
            <button onClick={loadProducts} className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black tracking-widest uppercase transition-colors border border-white/10">
              <RefreshCw size={14} /> Làm mới
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 space-y-12">

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Tổng sản phẩm", value: products.length, tag: "Toàn bộ" },
            { label: "Đang bán", value: products.filter(p => p.status === "ACTIVE").length, tag: "Active", tagCls: "text-emerald-700 bg-emerald-50 border-emerald-100" },
            { label: "Tồn kho thấp", value: products.filter(p => p.quantity <= 10).length, tag: "≤10", tagCls: "text-red-700 bg-red-50 border-red-100" },
          ].map(({ label, value, tag, tagCls }) => (
            <div key={label} className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-secondary p-3 text-red-500"><Package className="w-5 h-5" /></div>
                <span className={`px-2.5 py-1 border text-[8px] font-black tracking-widest uppercase ${tagCls || "border-primary/15 text-primary/40"}`}>{tag}</span>
              </div>
              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{label}</p>
              <p className="text-xl font-display font-black text-primary mt-1">{value.toLocaleString()}</p>
              <span className="text-[9px] text-red-500 font-semibold tracking-wider block mt-2 uppercase">Kredo Studio</span>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
            <Search className="w-4 h-4 text-red-500" />
            <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">Bộ lọc sản phẩm</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col space-y-1.5">
              <label className={labelCls}>Tìm kiếm</label>
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Tên sản phẩm..." className={inputCls} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className={labelCls}>Danh mục</label>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className={inputCls}>
                <option value="ALL">Tất cả</option>
                <option value="Top">Áo (Top)</option>
                <option value="Bottom">Quần (Bottom)</option>
                <option value="Accessories">Phụ kiện</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className={labelCls}>Trạng thái</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={inputCls}>
                <option value="ALL">Tất cả</option>
                <option value="ACTIVE">Đang bán</option>
                <option value="INACTIVE">Ngừng bán</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className={labelCls}>Sắp xếp</label>
              <select value={sortOption} onChange={e => setSortOption(e.target.value)} className={inputCls}>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="stock-desc">Tồn kho cao nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-primary/5">
            <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">📦 Danh sách sản phẩm</h2>
            <span className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">{filteredProducts.length} sản phẩm</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary/10">
                  {["Sản phẩm", "Danh mục", "Giá bán", "Tồn kho", "Trạng thái", "Hành động"].map(h => (
                    <th key={h} className="py-4 px-4 text-[9px] font-black text-primary/40 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {filteredProducts.length > 0 ? filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-secondary border border-primary/5 overflow-hidden flex-shrink-0">
                          {p.imageUrlFront ? <img src={p.imageUrlFront} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-primary/20 text-[8px] font-black">{p.name?.charAt(0)}</div>}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-tight">{p.name}</p>
                          <p className="text-[9px] font-bold text-primary/30 mt-0.5 truncate max-w-[180px]">{p.description || "Không có mô tả"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 border border-primary/10 bg-secondary text-[8px] font-black tracking-widest uppercase text-primary/60">{p.category?.name || "N/A"}</span>
                    </td>
                    <td className="py-4 px-4 font-display font-black text-xs text-primary">{formatCurrency(p.price)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 border text-[8px] font-black tracking-widest uppercase ${p.quantity > 10 ? "border-primary/10 bg-secondary text-primary/60" : p.quantity > 0 ? "text-amber-700 bg-amber-50 border-amber-100" : "text-red-700 bg-red-50 border-red-100"}`}>
                        {p.quantity > 0 ? `${p.quantity} cái` : "Hết hàng"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 border text-[8px] font-black tracking-widest uppercase ${p.status === "ACTIVE" ? "text-emerald-700 bg-emerald-50 border-emerald-100" : "text-red-700 bg-red-50 border-red-100"}`}>
                        {p.status === "ACTIVE" ? "Đang bán" : "Ngừng bán"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setDetailProduct(p); setShowDetailModal(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-secondary hover:bg-[#111111] hover:text-white text-primary text-[9px] font-black tracking-widest uppercase transition-all border border-primary/5">
                          <Eye size={12} />
                        </button>
                        <button onClick={() => openEditModal(p)} className="flex items-center gap-1.5 px-3 py-2 bg-secondary hover:bg-[#111111] hover:text-white text-primary text-[9px] font-black tracking-widest uppercase transition-all border border-primary/5">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => deleteProduct(p.id)} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-[9px] font-black tracking-widest uppercase transition-all border border-red-100">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="py-16 text-center text-[10px] font-black tracking-widest uppercase text-primary/30">Không tìm thấy sản phẩm nào</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {showDetailModal && detailProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl">
            <div className="bg-[#111111] px-8 py-6 flex justify-between items-center flex-shrink-0">
              <div>
                <span className="text-red-500 text-[9px] font-black tracking-[0.4em] uppercase">Chi tiết sản phẩm</span>
                <h2 className="text-2xl font-display font-black text-white mt-1 uppercase">{detailProduct.name}</h2>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xl">×</button>
            </div>
            <div className="overflow-y-auto flex-1 p-8 bg-secondary space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white border border-primary/5 aspect-[3/4] overflow-hidden">
                    <img src={detailProduct.imageUrlFront || "https://via.placeholder.com/300"} alt="Front" className="w-full h-full object-cover" />
                  </div>
                  {detailProduct.imageUrlBack && (
                    <div className="bg-white border border-primary/5 aspect-[3/4] overflow-hidden">
                      <img src={detailProduct.imageUrlBack} alt="Back" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  <div className="bg-white border border-primary/5 p-6">
                    <div className="grid grid-cols-2 gap-5">
                      {[
                        { label: "Giá bán", value: formatCurrency(detailProduct.price) },
                        { label: "Giá gốc", value: formatCurrency(detailProduct.costPrice) },
                        { label: "Giảm giá", value: `${detailProduct.discountAmount?.toLocaleString()} đ` },
                        { label: "Đã bán", value: `${detailProduct.soldQuantity} ${detailProduct.unit}` },
                        { label: "Chất liệu", value: detailProduct.material },
                        { label: "Kiểu dáng", value: detailProduct.form || "N/A" },
                        { label: "Đánh giá", value: `${detailProduct.rating} ⭐` },
                        { label: "Danh mục", value: detailProduct.category?.name || "Chưa phân loại" },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className={labelCls}>{label}</p>
                          <p className="text-sm font-bold text-primary">{value}</p>
                        </div>
                      ))}
                    </div>
                    {detailProduct.description && (
                      <div className="mt-5 pt-5 border-t border-primary/5">
                        <p className={labelCls}>Mô tả</p>
                        <p className="text-xs font-bold text-primary/60 leading-relaxed">{detailProduct.description}</p>
                      </div>
                    )}
                  </div>
                  {detailProduct.sizeDetails?.length > 0 && (
                    <div className="bg-white border border-primary/5 p-6">
                      <p className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase mb-5 pb-3 border-b border-primary/5">Size & Tồn kho</p>
                      <div className="grid grid-cols-4 gap-3">
                        {detailProduct.sizeDetails.map(size => (
                          <div key={size.id} className="border border-primary/8 p-3 text-center bg-secondary">
                            <div className="font-display font-black text-sm text-primary">{size.sizeName}</div>
                            <div className="text-[9px] font-bold text-primary/40 mt-1 uppercase tracking-wider">{size.quantity} cái</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white border-t border-primary/5 px-8 py-5 flex justify-end">
              <button onClick={() => setShowDetailModal(false)} className="px-6 py-3 bg-[#111111] text-white text-[10px] font-black tracking-widest uppercase hover:bg-red-500 transition-colors">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl">
            <div className="bg-[#111111] px-8 py-6 flex justify-between items-center flex-shrink-0">
              <div>
                <span className="text-red-500 text-[9px] font-black tracking-[0.4em] uppercase">{editingProduct ? "Chỉnh sửa" : "Tạo mới"}</span>
                <h2 className="text-2xl font-display font-black text-white mt-1 uppercase">{editingProduct ? `Sản phẩm #${editingProduct.id}` : "Thêm sản phẩm"}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xl">×</button>
            </div>
            <div className="overflow-y-auto flex-1 p-8 bg-secondary space-y-6">

              {/* Basic info */}
              <div className="bg-white border border-primary/5 p-6 space-y-5">
                <h3 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase pb-3 border-b border-primary/5">Thông tin cơ bản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Tên sản phẩm</label>
                    <input className={inputCls} placeholder="VD: Áo thun nam..." value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Danh mục</label>
                    <select className={inputCls} value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Mô tả</label>
                    <textarea rows={3} className={`${inputCls} resize-none`} placeholder="Mô tả chi tiết..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div className="bg-white border border-primary/5 p-6 space-y-5">
                <h3 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase pb-3 border-b border-primary/5">Thuộc tính</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { label: "Chất liệu", key: "material", placeholder: "VD: Cotton" },
                    { label: "Kiểu dáng", key: "form", placeholder: "VD: Regular Fit" },
                    { label: "Đơn vị", key: "unit", placeholder: "VD: Cái" },
                  ].map(item => (
                    <div key={item.key}>
                      <label className={labelCls}>{item.label}</label>
                      <input className={inputCls} placeholder={item.placeholder} value={formData[item.key]} onChange={e => setFormData({ ...formData, [item.key]: e.target.value })} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white border border-primary/5 p-6 space-y-5">
                <h3 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase pb-3 border-b border-primary/5">Giá & Kho</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {[
                    { label: "Giá vốn (VNĐ)", key: "price" },
                    { label: "Giá bán (VNĐ)", key: "costPrice", disabled: true },
                    { label: "Giảm giá", key: "discountAmount" },
                    { label: "Tổng tồn kho", key: "quantity", readOnly: true },
                  ].map(item => (
                    <div key={item.key}>
                      <label className={labelCls}>{item.label}</label>
                      <input type="number" className={`${inputCls} ${item.disabled ? "opacity-50" : ""}`} value={formData[item.key]} readOnly={item.readOnly} disabled={item.disabled} onChange={e => !item.readOnly && !item.disabled && setFormData({ ...formData, [item.key]: Number(e.target.value) })} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="bg-white border border-primary/5 p-6 space-y-5">
                <h3 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase pb-3 border-b border-primary/5">Hình ảnh</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[{ label: "Mặt trước", key: "imageUrlFront" }, { label: "Mặt sau", key: "imageUrlBack" }].map(img => (
                    <div key={img.key} className="space-y-3">
                      <label className={labelCls}>{img.label}</label>
                      <input type="file" accept="image/*" className={inputCls} onChange={async e => { const file = e.target.files[0]; if (!file) return; const url = await uploadImageToCloudinary(file); setFormData({ ...formData, [img.key]: url }); }} />
                      {formData[img.key] && <div className="w-24 h-28 border border-primary/10 overflow-hidden"><img src={formData[img.key]} alt="Preview" className="w-full h-full object-cover" /></div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="bg-white border border-primary/5 p-6 space-y-5">
                <h3 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase pb-3 border-b border-primary/5">Chi tiết Size</h3>
                <div className="space-y-3">
                  {formData.sizeDetails.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-secondary border border-primary/5">
                      <input className="flex-1 bg-white p-2.5 text-xs font-black text-primary border border-primary/10 opacity-60" value={item.nameSize} disabled />
                      <div className="flex items-center gap-2">
                        <span className={labelCls + " mb-0"}>SL:</span>
                        <input type="number" className="w-24 bg-white p-2.5 text-xs font-bold text-primary border border-primary/10 focus:ring-1 focus:ring-red-500 focus:outline-none" value={item.quantity} onChange={e => updateSizeDetail(index, "quantity", Number(e.target.value))} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white border-t border-primary/5 px-8 py-5 flex justify-end gap-3 flex-shrink-0">
              <button onClick={() => setShowModal(false)} className="px-6 py-3 border border-primary/10 text-primary/60 hover:text-primary text-[10px] font-black tracking-widest uppercase transition-colors">Hủy</button>
              <button onClick={saveProduct} className="flex items-center gap-2 px-6 py-3 bg-[#111111] hover:bg-red-500 text-white text-[10px] font-black tracking-widest uppercase transition-colors">
                <Edit2 size={12} /> {editingProduct ? "Cập nhật" : "Lưu sản phẩm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminChatBot />
    </div>
  );
}