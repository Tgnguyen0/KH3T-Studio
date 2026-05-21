// File: src/pages/Product.jsx
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  SlidersHorizontal,
  X,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";

const Product = () => {
  const location = useLocation();
  
  const categoryTranslations = {
    top: "Áo thời trang",
    bottom: "Quần thời trang",
    accessories: "Phụ kiện",
    shoes: "Giày & Dép",
  };
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Hero slide index
  const [activeSlide, setActiveSlide] = useState(0);

  const itemsPerPage = 12;

  // Hero Campaign Slides
  const slides = [
    {
      collection: "BỘ SƯU TẬP HÈ 2026",
      title: "BẢN SẮC TỐI GIẢN",
      highlight: "TỐI GIẢN",
      desc: "Những thiết kế tối giản mang hơi thở đương đại, được chế tác tỉ mỉ dành riêng cho những tín đồ KREDO đích thực.",
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"
    },
    {
      collection: "EDITION 02 / HIGH STREET",
      title: "ĐƯỜNG PHỐ KIỂU MẪU",
      highlight: "KIỂU MẪU",
      desc: "Phong cách thành thị thanh lịch đầy nổi loạn. Phom dáng cứng cáp cùng đường cắt may dứt khoát định hình cá tính độc bản.",
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&auto=format&fit=crop"
    },
    {
      collection: "CLASSIC RETROFIT",
      title: "DI SẢN THỜI GIAN",
      highlight: "DI SẢN",
      desc: "Chất liệu cao cấp từ len và sợi bông tự nhiên nguyên bản, kiến tạo nên giá trị vĩnh cửu bất chấp dòng chảy thời gian.",
      img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop"
    }
  ];

  // Auto rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Tính toán top 5 HOT và NEW products
  const { hotProductIds, newProductIds } = useMemo(() => {
    if (products.length === 0) return { hotProductIds: [], newProductIds: [] };

    const sortedBySold = [...products].sort(
      (a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0)
    );
    const top5Hot = sortedBySold.slice(0, 5).map((p) => p.id);

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

  // Thống kê số lượng sản phẩm cho mỗi danh mục
  const categoryCounts = useMemo(() => {
    const counts = { all: 0 };
    products.forEach((p) => {
      if (p.status === "ACTIVE") {
        counts.all = (counts.all || 0) + 1;
        if (p.category) {
          counts[p.category.id] = (counts[p.category.id] || 0) + 1;
        }
      }
    });
    return counts;
  }, [products]);

  // Dynamic max price
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000000000;
    const maxVal = Math.max(...products.map((p) => p.price || 0));
    return maxVal > 0 ? maxVal : 1000000000;
  }, [products]);

  // Set priceRange max to match loaded products max price
  useEffect(() => {
    if (products.length > 0) {
      const maxVal = Math.max(...products.map((p) => p.price || 0));
      setPriceRange([0, maxVal > 0 ? maxVal : 1000000000]);
    }
  }, [products]);

  // Filter & Sort
  const processedProducts = useMemo(() => {
    let filtered = [...products];

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
    <div className="min-h-screen bg-secondary relative">
      {/* Sliding Filter Drawer Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsFilterOpen(false)}
      />
      
      {/* Sliding Filter Drawer Panel */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-white shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 ease-out ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="space-y-8 overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-4 border-b border-primary/10">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-primary" />
              <h3 className="font-black text-sm tracking-widest uppercase text-primary">Bộ lọc sản phẩm</h3>
            </div>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="p-1.5 rounded-full hover:bg-secondary text-primary/60 hover:text-primary transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Category Section */}
          <div className="space-y-3">
            <h4 className="font-black text-xs tracking-widest uppercase text-primary/40">Danh mục</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === "all"
                    ? "bg-primary text-white"
                    : "bg-secondary text-primary/60 hover:text-primary"
                }`}
              >
                TẤT CẢ SẢN PHẨM ({categoryCounts.all || 0})
              </button>
              {categories.map((category) => {
                const translatedName = categoryTranslations[category.name.toLowerCase()] || category.name;
                const isSelected = selectedCategory === category.id.toString();
                const count = categoryCounts[category.id] || 0;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id.toString())}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-secondary text-primary/60 hover:text-primary"
                    }`}
                  >
                    {translatedName.toUpperCase()} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Filter Section */}
          <div className="space-y-4 pt-4 border-t border-primary/5">
            <h4 className="font-black text-xs tracking-widest uppercase text-primary/40">Lọc theo giá</h4>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={priceRange[0]}
                  min={0}
                  max={maxPrice}
                  onChange={(e) => {
                    const val = Math.max(0, parseInt(e.target.value) || 0);
                    setPriceRange([val, priceRange[1]]);
                  }}
                  className="w-full pl-3 pr-5 py-2 bg-secondary border border-primary/5 rounded-xl font-bold text-xs outline-none text-primary focus:border-accent"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-primary/40 font-bold">đ</span>
              </div>
              <span className="text-primary/20 text-xs">-</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  value={priceRange[1]}
                  min={0}
                  max={maxPrice}
                  onChange={(e) => {
                    const val = Math.max(0, parseInt(e.target.value) || 0);
                    setPriceRange([priceRange[0], val]);
                  }}
                  className="w-full pl-3 pr-5 py-2 bg-secondary border border-primary/5 rounded-xl font-bold text-xs outline-none text-primary focus:border-accent"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-primary/40 font-bold">đ</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <input
                type="range"
                min="0"
                max={maxPrice}
                step={maxPrice / 100}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value), priceRange[1]])
                }
                className="w-full h-1 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <input
                type="range"
                min="0"
                max={maxPrice}
                step={maxPrice / 100}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full h-1 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-black text-primary/50">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Drawer Footer Buttons */}
        <div className="pt-6 border-t border-primary/10 flex gap-3">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setPriceRange([0, maxPrice]);
              setSearchTerm("");
            }}
            className="flex-1 py-3 bg-secondary text-primary font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-primary/5 transition"
          >
            Xóa bộ lọc
          </button>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-accent transition shadow-lg shadow-primary/10"
          >
            Áp dụng
          </button>
        </div>
      </div>

      {/* Luxury Lookbook Campaign Slider */}
      <div className="relative h-[65vh] bg-[#fbfbf9] border-b border-primary/5 overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 flex flex-col lg:flex-row transition-all duration-[1200ms] cubic-bezier(0.25, 1, 0.5, 1) ${
              idx === activeSlide ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-8 z-0 pointer-events-none"
            }`}
          >
            {/* Left: Info */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-20 py-12 relative">
              <div className="max-w-xl">
                <span className="text-red-500 font-black text-[9px] tracking-[0.4em] uppercase block mb-4">
                  {slide.collection}
                </span>
                <h1 className="text-4xl lg:text-6xl font-display font-black text-primary mb-6 tracking-tighter leading-tight uppercase">
                  {slide.title.replace(slide.highlight, "")}
                  <span className="text-red-500 underline decoration-1 underline-offset-8">
                    {slide.highlight}
                  </span>
                </h1>
                <p className="text-primary/50 text-xs lg:text-sm max-w-sm font-medium leading-relaxed uppercase tracking-wider">
                  {slide.desc}
                </p>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="w-full lg:w-1/2 relative h-full bg-secondary">
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover grayscale brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fbfbf9] lg:via-[#fbfbf9]/15 to-transparent"></div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-8 lg:left-20 z-20 flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-[3px] transition-all duration-500 rounded-none ${
                idx === activeSlide ? "w-12 bg-primary" : "w-6 bg-primary/20 hover:bg-primary/45"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Combined Header & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-primary/10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-primary uppercase">Cửa hàng</h2>
            <p className="text-xs text-primary/40 font-bold mt-1 uppercase tracking-wider">
              Hiện có <span className="text-accent">{processedProducts.length}</span> sản phẩm được tìm thấy
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`flex items-center gap-2 px-5 py-2.5 bg-white border rounded-xl text-xs font-black tracking-wider transition ${
                selectedCategory !== "all" || priceRange[0] !== 0 || priceRange[1] < maxPrice
                  ? "border-accent text-accent bg-accent/5"
                  : "border-primary/10 text-primary hover:border-accent"
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>BỘ LỌC</span>
              {(selectedCategory !== "all" || priceRange[0] !== 0 || priceRange[1] < maxPrice) && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              )}
            </button>

            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-primary/10 rounded-xl text-xs font-medium w-48 md:w-64 focus:w-80 focus:border-accent transition-all outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-10 py-2.5 bg-white border border-primary/10 rounded-xl text-xs font-black tracking-wider text-primary appearance-none cursor-pointer outline-none hover:border-accent transition"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white border border-primary/10 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-primary text-white shadow-sm"
                    : "text-primary/40 hover:text-primary"
                }`}
                title="Lưới"
              >
                <Grid3x3 size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-primary text-white shadow-sm"
                    : "text-primary/40 hover:text-primary"
                }`}
                title="Danh sách"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Full-width Product Grid or List */}
        <div className="w-full">
          <main className="w-full">
            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-32">
                <div className="w-10 h-10 border-2 border-red-500 border-t-transparent animate-spin"></div>
              </div>
            )}

            {/* Product Display - Grid (4 columns) or List */}
            {!loading && paginatedProducts.length > 0 && (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
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

                {/* Pagination links */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-20">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`w-10 h-10 flex items-center justify-center rounded-none border transition-all duration-300 ${
                        currentPage === 1
                          ? "text-primary/20 border-primary/5 cursor-not-allowed"
                          : "text-primary border-primary/10 hover:border-accent hover:text-accent bg-white"
                      }`}
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-none font-display font-black text-xs transition-all duration-300 ${
                            currentPage === pageNum
                              ? "bg-primary text-white"
                              : "text-primary/40 hover:text-primary hover:bg-white border border-transparent hover:border-primary/10 bg-white"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="text-primary/20 px-2 font-mono">...</span>
                      )}
                      {totalPages > 5 && !getPageNumbers().includes(totalPages) && (
                         <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-10 h-10 rounded-none font-display font-black text-xs text-primary/40 hover:text-primary hover:bg-white border border-transparent hover:border-primary/10 bg-white"
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
                      className={`w-10 h-10 flex items-center justify-center rounded-none border transition-all duration-300 ${
                        currentPage === totalPages
                          ? "text-primary/20 border-primary/5 cursor-not-allowed"
                          : "text-primary border-primary/10 hover:border-accent hover:text-accent bg-white"
                      }`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* No items fallback */}
            {!loading && processedProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-primary/5 shadow-sm">
                <div className="text-gray-400 mb-4">
                  <Search size={64} className="mx-auto text-primary/20" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  Không tìm thấy sản phẩm nào
                </h3>
                <p className="text-primary/60 mb-6 max-w-md mx-auto">
                  Hãy thử điều chỉnh khoảng giá, chọn danh mục khác hoặc nhập từ khóa tìm kiếm khác.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, maxPrice]);
                    setSearchTerm("");
                  }}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-accent transition"
                >
                  Xóa tất cả bộ lọc
                </button>
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
