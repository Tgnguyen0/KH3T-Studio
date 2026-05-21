import React, { useState, useEffect } from "react";
import {
  FaPlus, FaEdit, FaTrash, FaUpload, FaDownload, FaImage, FaEye,
  FaSearch, FaFilter, FaSortAmountDown
} from "react-icons/fa";
import AdminChatBot from '../../components/AdminChatBot';
export default function Products({ initialFilter = 'ALL' }) {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [filterStock, setFilterStock] = useState("ALL");


  // === STATE MỚI CHO FILTER & SEARCH ===
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL"); // Lọc theo danh mục
  const [filterStatus, setFilterStatus] = useState("ALL");     // Lọc theo trạng thái
  const [sortOption, setSortOption] = useState("newest");      // Sắp xếp

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: 0,
    costPrice: 0,
    discountAmount: 0,
    quantity: 0,
    unit: "Cái",
    material: "",
    form: "",
    imageUrlFront: "",
    imageUrlBack: "",
    status: "",
    sizeDetails: []
  });

 const uploadImageToCloudinary = async (file) => {
   if (!file) return "";

   const data = new FormData();
   data.append("file", file);
   data.append("upload_preset", "products_upload");

   try {
     const response = await fetch(
       "https://api.cloudinary.com/v1_1/dfecuogtk/image/upload",
       {
         method: "POST",
         body: data,
       },
     );

     if (!response.ok) {
       throw new Error("Upload failed");
     }

     const result = await response.json();

     return result.secure_url;
   } catch (error) {
     console.error("Cloudinary Error:", error);
     return "";
   }
 };
  useEffect(() => {
    console.log("Check initialFilter:", initialFilter); 

    if (initialFilter === 'LOW_STOCK') {
      console.log("Đã set LOW");
      setFilterStock('LOW');
    } else {
      console.log("Đã set ALL");
      setFilterStock('ALL');
    }
  }, [initialFilter]);

  // --- EFFECT 2: Xử lý việc gọi API (chỉ chạy 1 lần khi vào trang) ---
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  
  const loadProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/products");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setProducts(data?.result || []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/categories");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCategories(data?.result || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ... (Các hàm openAddModal, openEditModal, saveProduct, deleteProduct... giữ nguyên)

  // ===============================
  // Add or Edit Product
  // ===============================

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(
      {
        name: "",
        description: "",      // Mới
        categoryId: "",       // Để map với category.id
        price: 0,
        costPrice: 0,         // Mới
        discountAmount: 0,    // Thay cho 'discount'
        quantity: 0,
        unit: "Cái",          // Mới
        material: "",         // Mới
        form: "",             // Mới
        imageUrlFront: "",    // Thay cho mảng images
        imageUrlBack: "",     // Thay cho mảng images
        sizeDetails: [{
          "id": 1,
          "nameSize": "S",
          "quantity": 0
        },
        {
          "id": 2,
          "nameSize": "M",
          "quantity": 0
        },
        {
          "id": 3,
          "nameSize": "L",
          "quantity": 0
        },
        {
          "id": 4,
          "nameSize": "XL",
          "quantity": 0
        }]
      }
    );
    setShowModal(true);

  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    // Tìm ID danh mục để bind vào thẻ <select>
    // Giả sử product.category là object { id, name... } trả về từ API lấy danh sách
    const catId = product.category?.id || product.categoryRequest?.id || "";

    // Map sizeDetails (API) -> Form State
    // API trả về: [{ quantity: 20, sizeName: "M" }, ...] (hoặc cấu trúc tương tự)
    // Form cần: [{ nameSize: "M", quantity: 20 }] để dễ hiển thị trên input
    const mappedSizes = product.sizeDetails
      ? product.sizeDetails.map(s => ({
        nameSize: s.sizeName || s.sizeRequest?.nameSize || "",
        quantity: s.quantity
      }))
      : [];

    setFormData({
      name: product.name,
      description: product.description || "",
      categoryId: catId,
      price: product.price,
      costPrice: product.costPrice || 0, // Nếu backend không trả về thì để 0
      unit: product.unit || "Cái",
      imageUrlFront: product.imageUrlFront || "",
      imageUrlBack: product.imageUrlBack || "",
      discountAmount: product.discountAmount || 0,
      material: product.material || "",
      form: product.form || "",
      status: product.status || "",
      quantity: product.quantity, // Tổng tồn kho

      // Lưu vào state dùng cho việc render input
      sizeDetails: mappedSizes
    });
    setShowModal(true);

  };

  const updateSizeDetail = (index, field, value) => {
    const newSizes = [...formData.sizeDetails];
    newSizes[index][field] = value;
    setFormData(prev => ({ ...prev, sizeDetails: newSizes }));
  };

  const saveProduct = async () => {
    // 1. Lấy Token
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Vui lòng đăng nhập lại!");
      return;
    }
    // 2. Chuẩn bị URL và Method
    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct
      ? `http://localhost:8080/products/${editingProduct.id}`
      : "http://localhost:8080/products";

    // 3. Xử lý Category Request
    // Tìm object category gốc từ list 'categories' dựa trên ID đang chọn trong form
    const selectedCategory = categories.find(c => c.id == formData.categoryId);

    // Tạo object categoryRequest theo đúng mẫu JSON yêu cầu
    const categoryRequestData = selectedCategory ? {
      name: selectedCategory.name,
      description: selectedCategory.description || "",
      imageUrl: selectedCategory.imageUrl || "",
      display_order: selectedCategory.display_order || 1,
      isActive: true
    } : null;

    // 4. Xử lý SizeDetailRequests
    // Map từ state đơn giản của form sang cấu trúc lồng nhau của API
    const sizeDetailRequestsData = formData.sizeDetails.map(item => ({
      quantity: Number(item.quantity),
      sizeRequest: {
        nameSize: item.nameSize // Lấy tên size từ input form
      }
    }));

    // 5. Tạo Payload cuối cùng
    const payload = {
      // Nếu là Sửa thì giữ nguyên ID, Thêm mới thì ID = 0 (hoặc backend tự sinh)
      id: editingProduct ? editingProduct.id : 0,

      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      unit: formData.unit,
      quantity: Number(formData.quantity), // Tổng số lượng (nếu cần gửi)

      imageUrlFront: formData.imageUrlFront,
      imageUrlBack: formData.imageUrlBack,

      discountAmount: Number(formData.discountAmount),
      material: formData.material,
      form: formData.form,

      // Object lồng nhau theo yêu cầu
      categoryRequest: categoryRequestData,
      sizeDetailRequests: sizeDetailRequestsData
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // <--- Thêm Token vào Header
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        loadProducts(); // Load lại danh sách sau khi lưu thành công
      } else {
        const errorData = await res.json();
        alert(`Lỗi: ${errorData.message || "Không thể lưu sản phẩm"}`);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Lỗi kết nối đến server");
    }

  };




  // ===============================
  // Delete Product
  // ===============================
  const deleteProduct = async (id) => {
    const token = localStorage.getItem("accessToken");
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    await fetch(`http://localhost:8080/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    loadProducts();
  };
  const handleImport = (e) => { /* ... */ };
  const handleExport = () => {
    const csv = [
      ["id", "name", "price", "quantity"],
      ...products.map((p) => [p.id, p.name, p.price, p.quantity])
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
  };

  const openDetailModal = (product) => {
    setDetailProduct(product);
    setShowDetailModal(true);
  };

  const getCategoryColor = (categoryName) => {
    switch (categoryName) {
      case "Bottom": return "bg-blue-100 text-blue-800";
      case "Accessories": return "bg-purple-100 text-purple-800";
      case "Top": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };


  // ===============================
  // LOGIC LỌC VÀ SẮP XẾP (MỚI)
  // ===============================
  const filteredProducts = products
    .filter((product) => {
      // 1. Lọc theo danh mục (Category)
      const matchesCategory =
        filterCategory === "ALL" ||
        product.category?.name === filterCategory;

      // 2. Lọc theo trạng thái (Status)
      const matchesStatus =
        filterStatus === "ALL" ||
        product.status === filterStatus;

      // 3. Tìm kiếm theo tên (Search)
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // 👇👇👇 4. THÊM PHẦN NÀY: LỌC TỒN KHO 👇👇👇
      let matchesStock = true;
      if (filterStock === 'LOW') {
        // Chỉ lấy sản phẩm có số lượng <= 10
        matchesStock = product.quantity <= 10;
      }

      return matchesCategory && matchesStatus && matchesSearch && matchesStock;
    })
    .sort((a, b) => {
      // 4. Sắp xếp
      switch (sortOption) {
        case "price-asc": // Giá tăng dần
          return a.price - b.price;
        case "price-desc": // Giá giảm dần
          return b.price - a.price;
        case "name-asc": // Tên A-Z
          return a.name.localeCompare(b.name);
        case "stock-desc": // Tồn kho nhiều nhất
          return b.quantity - a.quantity;
        case "newest": // Mới nhất (theo ID hoặc field created_at nếu có)
        default:
          return b.id - a.id;
      }
    });


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* === HEADER === */}
        <div className="bg-gradient-to-r from-white/80 via-white/70 to-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
            {/* TITLE */}
            <div>
              <h1 className="text-5 xl font-bold md:text-4xl  bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Quản lý sản phẩm
              </h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">
                Quản lý và theo dõi sản phẩm trong hệ thống cửa hàng
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Export */}
              <button
                onClick={handleExport}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <FaDownload className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Export</span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition"></span>
              </button>

              {/* Add new */}
              <button
                onClick={openAddModal}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium">Thêm mới</span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition"></span>
              </button>
            </div>
          </div>
        </div>

        {/* === TOOLBAR FILTER & SEARCH (MỚI) === */}
        <div className="bg-gradient-to-r from-white/80 via-white/70 to-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* SEARCH */}
            <div className="relative group col-span-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 shadow-sm
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all
        hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* CATEGORY FILTER */}
            <div className="relative group">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <select
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 shadow-sm
        focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer
        hover:shadow-md transition-all"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="ALL">Tất cả danh mục</option>
                <option value="Top">Áo (Top)</option>
                <option value="Bottom">Quần (Bottom)</option>
                <option value="Accessories"> Phụ kiện</option>
              </select>
            </div>

            {/* STATUS FILTER */}
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-400 group-focus-within:bg-blue-500 transition-colors"></div>

              <select
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 shadow-sm
        focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer
        hover:shadow-md transition-all"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">Trạng thái</option>
                <option value="ACTIVE">Đang bán</option>
                <option value="INACTIVE">Ngừng bán</option>
              </select>
            </div>

            {/* SORT */}
            <div className="relative group">
              <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />

              <select
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 shadow-sm
        focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer
        hover:shadow-md transition-all"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="stock-desc">Tồn kho cao nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* === PRODUCT TABLE === */}
        <div className="bg-gradient-to-r from-white/80 via-white/70 to-white/60 backdrop-blur-md shadow-xl rounded-2xl border border-white/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* HEADER */}
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  {[
                    "Sản phẩm",
                    "Danh mục",
                    "Giá",
                    "Tồn kho",
                    "Trạng thái",
                    "Thao tác",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-blue-50/40 transition-all duration-200"
                    >
                      {/* NAME */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {p.name}
                          </span>
                          <span className="text-xs text-gray-400 truncate max-w-[220px]">
                            {p.description || "Không có mô tả"}
                          </span>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getCategoryColor(p.category?.name)}`}
                        >
                          {p.category?.name || "N/A"}
                        </span>
                      </td>

                      {/* PRICE */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-green-600">
                            {p.price.toLocaleString()} đ
                          </span>
                          <span className="text-xs text-gray-400">
                            Giá bán lẻ
                          </span>
                        </div>
                      </td>

                      {/* STOCK */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold ${
                            p.quantity > 0
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {p.quantity > 0
                            ? `${p.quantity} sản phẩm`
                            : "Hết hàng"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        {p.status === "ACTIVE" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            Đang bán
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            Ngừng bán
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetailModal(p)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-all"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>

                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-indigo-100 text-indigo-600 transition-all"
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-red-100 text-red-600 transition-all"
                            title="Xóa"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FaSearch className="text-5xl text-gray-300 mb-3" />
                        <p className="text-sm">
                          Không tìm thấy sản phẩm nào phù hợp
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAIL MODAL */}
        {showDetailModal && detailProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative transform transition-all">
              {/* Header Modal */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-linear-to-r from-blue-50 to-indigo-50 z-10 rounded-t-3xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Chi tiết sản phẩm
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Thông tin đầy đủ về sản phẩm
                  </p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                  onClick={() => setShowDetailModal(false)}
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* CỘT TRÁI: HÌNH ẢNH */}
                  <div className="space-y-6">
                    <div>
                      <span className="block text-sm font-semibold text-gray-600 mb-3">
                        Ảnh mặt trước:
                      </span>
                      <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 h-80 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <img
                          src={
                            detailProduct.imageUrlFront ||
                            "https://via.placeholder.com/300"
                          }
                          alt="Front"
                          className="max-h-full max-w-full object-contain p-4"
                        />
                      </div>
                    </div>

                    {detailProduct.imageUrlBack && (
                      <div>
                        <span className="block text-sm font-semibold text-gray-600 mb-3">
                          Ảnh mặt sau:
                        </span>
                        <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 h-80 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <img
                            src={detailProduct.imageUrlBack}
                            alt="Back"
                            className="max-h-full max-w-full object-contain p-4"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CỘT PHẢI: THÔNG TIN */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {detailProduct.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="bg-linear-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                          {detailProduct.category?.name || "Chưa phân loại"}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                          ID: #{detailProduct.id}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 bg-linear-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                            Giá bán
                          </p>
                          <p className="text-2xl font-bold bg-linear-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                            {detailProduct.costPrice?.toLocaleString()} đ
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                            Giá gốc
                          </p>
                          <p className="text-lg font-medium text-gray-500 line-through">
                            {detailProduct.price?.toLocaleString()} đ
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                            Giảm giá
                          </p>
                          <p className="font-bold text-green-600 text-lg">
                            -{detailProduct.discountAmount?.toLocaleString()} %
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                            Đã bán
                          </p>
                          <p className="font-bold text-gray-800 text-lg">
                            {detailProduct.soldQuantity} {detailProduct.unit}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-linear-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                        Thông tin chi tiết
                      </h4>
                      <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <strong className="text-gray-900 min-w-[100px]">
                            Chất liệu:
                          </strong>
                          <span className="text-gray-600">
                            {detailProduct.material}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <strong className="text-gray-900 min-w-[100px]">
                            Kiểu dáng:
                          </strong>
                          <span className="text-gray-600">
                            {detailProduct.form || "N/A"}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <strong className="text-gray-900 min-w-[100px]">
                            Đánh giá:
                          </strong>
                          <span className="text-yellow-500 font-semibold">
                            {detailProduct.rating} ⭐
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <strong className="text-gray-900 min-w-[100px]">
                            Mô tả:
                          </strong>
                          <span className="text-gray-600 italic">
                            {detailProduct.description}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-linear-to-b from-green-500 to-emerald-500 rounded-full"></span>
                        Chi tiết Size & Tồn kho
                      </h4>
                      {detailProduct.sizeDetails &&
                      detailProduct.sizeDetails.length > 0 ? (
                        <div className="grid grid-cols-4 gap-3">
                          {detailProduct.sizeDetails.map((size) => (
                            <div
                              key={size.id}
                              className="border-2 border-gray-200 rounded-xl p-3 text-center bg-linear-to-br from-white to-gray-50 hover:shadow-md hover:border-blue-300 transition-all duration-200"
                            >
                              <div className="font-bold text-gray-900 text-lg">
                                {size.sizeName}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Kho:{" "}
                                <span className="font-semibold text-gray-700">
                                  {size.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-center py-4">
                          Không có thông tin size
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end rounded-b-3xl">
                <button
                  className="px-6 py-3 bg-linear-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                  onClick={() => setShowDetailModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ADD/EDIT PRODUCT */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col">
              {/* HEADER */}
              <div className="p-6 border-b border-gray-100 sticky top-0 bg-linear-to-r from-blue-50 to-indigo-50 z-10 rounded-t-3xl flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProduct
                      ? `Chỉnh sửa: ${editingProduct.id}`
                      : "Thêm sản phẩm mới"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingProduct
                      ? "Cập nhật thông tin sản phẩm"
                      : "Điền thông tin để tạo sản phẩm mới"}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              {/* BODY FORM */}
              <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                {/* 1. THÔNG TIN CƠ BẢN */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-linear-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                    Thông tin cơ bản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tên sản phẩm
                      </label>
                      <input
                        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        placeholder="VD: Áo thun nam..."
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Danh mục
                      </label>
                      <select
                        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
                        value={formData.categoryId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoryId: e.target.value,
                          })
                        }
                      >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mô tả
                      </label>
                      <textarea
                        rows={3}
                        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        placeholder="Mô tả chi tiết sản phẩm..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* 2. THUỘC TÍNH SẢN PHẨM */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></span>
                    Thuộc tính sản phẩm
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Chất liệu
                      </label>
                      <input
                        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        placeholder="VD: Cotton"
                        value={formData.material}
                        onChange={(e) =>
                          setFormData({ ...formData, material: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kiểu dáng (Form)
                      </label>
                      <input
                        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        placeholder="VD: Regular Fit"
                        value={formData.form}
                        onChange={(e) =>
                          setFormData({ ...formData, form: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Đơn vị tính
                      </label>
                      <input
                        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        placeholder="VD: Cái"
                        value={formData.unit}
                        onChange={(e) =>
                          setFormData({ ...formData, unit: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* 3. GIÁ VÀ KHO */}
                <div className="bg-linear-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-linear-to-b from-orange-500 to-amber-500 rounded-full"></span>
                    Thiết lập giá & kho
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div>
                      <label className="text-xs text-gray-600 font-bold uppercase mb-2 block">
                        Giá vốn (VNĐ)
                      </label>
                      <input
                        type="number"
                        className="w-full border-2 border-blue-300 p-3 rounded-xl font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-bold uppercase mb-2 block">
                        Giá bán (VNĐ)
                      </label>
                      <input
                        type="number"
                        className="w-full border-2 border-gray-300 p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                        value={formData.costPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            costPrice: Number(e.target.value),
                          })
                        }
                        disabled
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-bold uppercase mb-2 block">
                        Giảm giá (Số tiền)
                      </label>
                      <input
                        type="number"
                        className="w-full border-2 border-red-300 p-3 rounded-xl text-red-600 font-semibold focus:ring-2 focus:ring-red-500 outline-none transition-all duration-200"
                        value={formData.discountAmount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountAmount: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-bold uppercase mb-2 block">
                        Tổng tồn kho
                      </label>
                      <input
                        type="number"
                        className="w-full border-2 border-gray-300 p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                        value={formData.quantity}
                        readOnly
                        title="Tự động tính tổng từ các size bên dưới (nếu logic yêu cầu) hoặc nhập tay"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantity: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* 4. HÌNH ẢNH */}
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-linear-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                    Hình ảnh (URL)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mặt trước */}
                    <div>
                      <label className="text-sm text-gray-700 font-semibold mb-2 block">
                        URL Mặt trước
                      </label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full border-2 border-gray-200 p-3 rounded-xl"
                          onChange={async (e) => {
                            const file = e.target.files[0];

                            if (!file) return;

                            const imageUrl =
                              await uploadImageToCloudinary(file);

                            setFormData({
                              ...formData,
                              imageUrlFront: imageUrl,
                            });
                          }}
                        />
                        {formData.imageUrlFront && (
                          <div className="h-32 w-32 border-2 border-gray-300 rounded-xl bg-white p-2 shadow-md hover:shadow-lg transition-shadow duration-200">
                            <img
                              src={formData.imageUrlFront}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mặt sau */}
                    <div>
                      <label className="text-sm text-gray-700 font-semibold mb-2 block">
                        URL Mặt sau
                      </label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full border-2 border-gray-200 p-3 rounded-xl"
                          onChange={async (e) => {
                            const file = e.target.files[0];

                            if (!file) return;

                            const imageUrl =
                              await uploadImageToCloudinary(file);

                            setFormData({
                              ...formData,
                              imageUrlBack: imageUrl,
                            });
                          }}
                        />
                        {formData.imageUrlBack && (
                          <div className="h-32 w-32 border-2 border-gray-300 rounded-xl bg-white p-2 shadow-md hover:shadow-lg transition-shadow duration-200">
                            <img
                              src={formData.imageUrlBack}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. SIZE & BIẾN THỂ */}
                <div className="border-2 border-emerald-200 p-6 rounded-2xl bg-linear-to-br from-emerald-50 to-green-50 shadow-sm">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-1 h-6 bg-linear-to-b from-emerald-500 to-green-500 rounded-full"></span>
                      Chi tiết Size
                    </h3>
                  </div>

                  {formData.sizeDetails.length === 0 && (
                    <p className="text-sm text-gray-500 italic text-center py-4 bg-white rounded-xl">
                      Chưa có thông tin size nào.
                    </p>
                  )}

                  <div className="space-y-3">
                    {formData.sizeDetails.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex-1">
                          <input
                            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none px-3 py-2 text-sm font-medium"
                            placeholder="Tên Size (S, M, L...)"
                            value={item.nameSize}
                            onChange={(e) =>
                              updateSizeDetail(
                                index,
                                "nameSize",
                                e.target.value,
                              )
                            }
                            disabled
                          />
                        </div>
                        <div className="w-40 flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-600">
                            SL:
                          </span>
                          <input
                            type="number"
                            className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                            value={item.quantity}
                            onChange={(e) =>
                              updateSizeDetail(
                                index,
                                "quantity",
                                Number(e.target.value),
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FOOTER BUTTONS */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex justify-end gap-4">
                <button
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => setShowModal(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-0.5"
                  onClick={saveProduct}
                >
                  <FaEdit />{" "}
                  {editingProduct ? "Cập nhật sản phẩm" : "Lưu sản phẩm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <AdminChatBot />
    </div>
  );
}
