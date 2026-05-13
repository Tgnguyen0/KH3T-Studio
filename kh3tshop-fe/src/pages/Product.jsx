import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Folder,
  DollarSign,
  Grid3x3,
  List,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";

const Product = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "grid" ? 9 : 9; // Grid & List: 9 items/page

  // Tính toán top 5 HOT và NEW products
  const { hotProductIds, newProductIds } = useMemo(() => {
    if (products.length === 0) return { hotProductIds: [], newProductIds: [] };

    // Top 5 sản phẩm có soldQuantity cao nhất
    const sortedBySold = [...products].sort(
      (a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0)
    );
    const top5Hot = sortedBySold.slice(0, 5).map((p) => p.id);

    // Top 5 sản phẩm có updatedAt gần nhất
    const sortedByDate = [...products].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    const top5New = sortedByDate.slice(0, 5).map((p) => p.id);

    return {
      hotProductIds: top5Hot,
      newProductIds: top5New,
    };
  }, [products]);

  // Read sort parameter from URL query on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sortParam = params.get("sort");
    if (sortParam === "bestselling" || sortParam === "newest") {
      setSortBy(sortParam);
    }
  }, [location.search]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.result || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/categories");
        if (response.ok) {
          const data = await response.json();
          // Lọc trùng lặp category theo tên để tránh hiển thị lặp lại
          const rawCategories = data.result || [];
          const uniqueCats = [];
          const seenNames = new Set();
          
          rawCategories.forEach(cat => {
            if (!seenNames.has(cat.name)) {
              uniqueCats.push(cat);
              seenNames.add(cat.name);
            }
          });
          
          setCategories(uniqueCats);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, viewMode]);

  // Filter & Sort
  const processedProducts = useMemo(() => {
    let filtered = [...products];

    // Chỉ hiển thị sản phẩm có status ACTIVE
    filtered = filtered.filter((p) => p.status === "ACTIVE");

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      const catId = parseInt(selectedCategory);
      filtered = filtered.filter((p) => p.category?.id === catId);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      case "bestselling":
        filtered.sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const sortOptions = [
    { value: "default", label: "MẶC ĐỊNH" },
    { value: "price-low", label: "GIÁ: THẤP ĐẾN CAO" },
    { value: "price-high", label: "GIÁ: CAO ĐẾN THẤP" },
    { value: "newest", label: "MỚI NHẤT" },
    { value: "bestselling", label: "BÁN CHẠY NHẤT" },
  ];

  const getPageNumbers = () => {
    const pages = [];
    const half = 2;
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(totalPages, half * 2 + 1);
    }
    if (currentPage > totalPages - half) {
      start = Math.max(1, totalPages - half * 2);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Editorial Hero Section with Image */}
      <div className="relative h-[60vh] lg:h-[70vh] bg-white border-b border-primary/5 overflow-hidden flex flex-col lg:flex-row">
        {/* Left: Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-20 py-16 relative z-10">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none translate-x-20 hidden lg:block">
            <span className="text-[25rem] font-black text-primary leading-none tracking-tighter uppercase">
              Shop
            </span>
          </div>
          
          <div className="max-w-xl">
            <div className="inline-block px-4 py-2 bg-accent/10 rounded-full mb-6">
               <span className="text-accent font-black text-[10px] tracking-[0.3em] uppercase">Mùa mới 2025</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-primary mb-8 tracking-tighter leading-none uppercase">
              BỘ SƯU TẬP <br /> <span className="text-accent">HIỆN ĐẠI</span>
            </h1>
            <p className="text-muted text-lg max-w-sm font-medium leading-relaxed">
              Những thiết kế tối giản mang hơi thở đương đại, được chế tác tỉ mỉ dành riêng cho những tín đồ KREDO.
            </p>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="w-full lg:w-1/2 relative h-full">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"
            alt="KREDO Fashion Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white lg:via-white/20 to-transparent"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Categories */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-primary/5 p-8 sticky top-32">
              <h3 className="font-black text-xs tracking-widest uppercase mb-8 text-primary/40 flex items-center gap-2">
                DANH MỤC
              </h3>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left font-black text-sm tracking-tight transition-all duration-300 ${
                      selectedCategory === "all"
                        ? "text-accent translate-x-2"
                        : "text-primary/60 hover:text-primary hover:translate-x-2"
                    }`}
                  >
                    TẤT CẢ SẢN PHẨM
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() =>
                        setSelectedCategory(category.id.toString())
                      }
                      className={`w-full text-left font-black text-sm tracking-tight transition-all duration-300 ${
                        selectedCategory === category.id.toString()
                          ? "text-accent translate-x-2"
                          : "text-primary/60 hover:text-primary hover:translate-x-2"
                      }`}
                    >
                      {category.name.toUpperCase()}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-12 pt-12 border-t border-primary/5">
                <h3 className="font-black text-xs tracking-widest uppercase mb-8 text-primary/40 flex items-center gap-2">
                  KHOẢNG GIÁ
                </h3>
                <div className="space-y-6">
                  <div className="font-black text-primary tracking-tighter text-lg">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </div>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="2000000"
                      step="50000"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                    <input
                      type="range"
                      min="0"
                      max="2000000"
                      step="50000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Search + Sort + View Mode */}
            <div className="bg-white rounded-3xl shadow-sm border border-primary/5 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-12 pr-4 py-4 bg-secondary/50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all font-medium text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                  {/* Sort Dropdown */}
                  <div className="relative flex-1 lg:w-64">
                    <select
                      className="appearance-none w-full px-6 py-4 pr-12 bg-secondary/50 border-none rounded-2xl text-xs font-black tracking-widest text-primary focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer uppercase"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown size={16} className="text-primary/40" />
                    </div>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex gap-2 bg-secondary/50 p-1.5 rounded-2xl">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2.5 rounded-xl transition-all ${
                        viewMode === "grid"
                          ? "bg-white shadow-sm text-accent"
                          : "text-primary/40 hover:text-primary"
                      }`}
                    >
                      <Grid3x3 size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2.5 rounded-xl transition-all ${
                        viewMode === "list"
                          ? "bg-white shadow-sm text-accent"
                          : "text-primary/40 hover:text-primary"
                      }`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 font-medium">
                Đang hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, processedProducts.length)}{" "}
                trên tổng số {processedProducts.length} sản phẩm
              </p>
              <p className="text-sm text-gray-500">
                Chế độ xem:{" "}
                <span className="font-semibold text-gray-700">
                  {viewMode === "grid" ? "Lưới" : "Danh sách"}
                </span>
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
              </div>
            )}

            {/* Product Display - Grid or List */}
            {!loading && paginatedProducts.length > 0 && (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "flex flex-col gap-6"
                  }
                >
                  {paginatedProducts.map((product) => {
                    const isHot = hotProductIds.includes(product.id);
                    const isNew = newProductIds.includes(product.id);

                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isHot={isHot}
                        isNew={isNew && !isHot}
                        viewMode={viewMode}
                      />
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-20">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all duration-300 ${
                        currentPage === 1
                          ? "text-primary/20 border-primary/5 cursor-not-allowed"
                          : "text-primary border-primary/10 hover:border-accent hover:text-accent hover:shadow-xl"
                      }`}
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-12 h-12 rounded-2xl font-black text-xs transition-all duration-300 ${
                            currentPage === pageNum
                              ? "bg-primary text-white shadow-xl scale-110"
                              : "text-primary/40 hover:text-primary hover:bg-white"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="text-primary/20 px-2">...</span>
                      )}
                      {totalPages > 5 && !getPageNumbers().includes(totalPages) && (
                         <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-12 h-12 rounded-2xl font-black text-xs text-primary/40 hover:text-primary hover:bg-white"
                        >
                          {totalPages}
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all duration-300 ${
                        currentPage === totalPages
                          ? "text-primary/20 border-primary/5 cursor-not-allowed"
                          : "text-primary border-primary/10 hover:border-accent hover:text-accent hover:shadow-xl"
                      }`}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!loading && processedProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search size={64} className="mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  Không tìm thấy sản phẩm nào
                </h3>
                <p className="text-gray-500">
                  Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn
                </p>
              </div>
            )}
          </main>
        </div>
        <ChatBot />
        <Contact />
      </div>
    </div>
  );
};

export default Product;
