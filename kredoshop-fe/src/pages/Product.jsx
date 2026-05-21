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
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Hero slide index
  const [activeSlide, setActiveSlide] = useState(0);

  const itemsPerPage = 9;

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
    <div className="min-h-screen bg-secondary selection:bg-accent selection:text-white">
      
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

      {/* Grid List Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-none border border-primary/5 p-8 sticky top-32">
              
              {/* Category selector */}
              <div>
                <h3 className="font-display font-black text-[10px] tracking-[0.3em] uppercase mb-8 text-primary/30 pb-3 border-b border-primary/5">
                  DANH MỤC SẢN PHẨM
                </h3>
                <ul className="space-y-4">
                  <li>
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full flex justify-between items-center font-display font-black text-[11px] tracking-widest uppercase transition-all duration-300 ${
                        selectedCategory === "all"
                          ? "text-accent translate-x-1"
                          : "text-primary/50 hover:text-primary hover:translate-x-1"
                      }`}
                    >
                      <span>Tất cả sản phẩm</span>
                      <span className="text-[9px] opacity-40 font-mono">({categoryCounts.all || 0})</span>
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => setSelectedCategory(category.id.toString())}
                        className={`w-full flex justify-between items-center font-display font-black text-[11px] tracking-widest uppercase transition-all duration-300 ${
                          selectedCategory === category.id.toString()
                            ? "text-accent translate-x-1"
                            : "text-primary/50 hover:text-primary hover:translate-x-1"
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="text-[9px] opacity-40 font-mono">({categoryCounts[category.id] || 0})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price range */}
              <div className="mt-12 pt-8 border-t border-primary/5">
                <h3 className="font-display font-black text-[10px] tracking-[0.3em] uppercase mb-8 text-primary/30 pb-3 border-b border-primary/5">
                  LỌC THEO GIÁ
                </h3>
                <div className="space-y-6">
                  <div className="font-display font-black text-accent tracking-tight text-sm">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </div>
                  <div className="space-y-4 relative">
                    <input
                      type="range"
                      min="0"
                      max="2000000"
                      step="50000"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full h-[2px] bg-secondary appearance-none cursor-pointer accent-accent"
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
                      className="w-full h-[2px] bg-secondary appearance-none cursor-pointer accent-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Catalog Listing */}
          <main className="lg:col-span-3">
            
            {/* Filter controls bar */}
            <div className="bg-white rounded-none border border-primary/5 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                
                {/* Search input */}
                <div className="relative flex-1 w-full">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30"
                    size={15}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary text-xs font-semibold rounded-none focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-primary/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                  {/* Sort options */}
                  <div className="relative flex-1 lg:w-64">
                    <select
                      className="appearance-none w-full px-5 py-3.5 pr-12 bg-secondary border-none rounded-none text-[10px] font-black tracking-widest text-primary focus:ring-1 focus:ring-red-500 focus:outline-none transition-all cursor-pointer uppercase font-display"
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
                      <ChevronDown size={14} className="text-primary/40" />
                    </div>
                  </div>

                  {/* Layout Grid / List toggles */}
                  <div className="flex gap-1 bg-secondary p-1 rounded-none">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-none transition-all ${
                        viewMode === "grid"
                          ? "bg-white shadow-sm text-accent"
                          : "text-primary/40 hover:text-primary"
                      }`}
                    >
                      <Grid3x3 size={15} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-none transition-all ${
                        viewMode === "list"
                          ? "bg-white shadow-sm text-accent"
                          : "text-primary/40 hover:text-primary"
                      }`}
                    >
                      <List size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count Summary */}
            <div className="flex justify-between items-center mb-6 text-[11px] font-bold text-primary/40 uppercase tracking-widest">
              <p>
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, processedProducts.length)}{" "}
                của {processedProducts.length} sản phẩm
              </p>
              <p className="hidden sm:block">
                CHẾ ĐỘ XEM:{" "}
                <span className="text-primary font-black">
                  {viewMode === "grid" ? "Lưới" : "Danh sách"}
                </span>
              </p>
            </div>

            {/* Catalog Grid list */}
            {loading && (
              <div className="flex justify-center items-center py-32">
                <div className="w-10 h-10 border-2 border-red-500 border-t-transparent animate-spin"></div>
              </div>
            )}

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
              <div className="text-center py-24 bg-white border border-primary/5">
                <div className="text-primary/20 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-sm font-display font-black uppercase tracking-[0.2em] text-primary mb-3">
                  Không tìm thấy sản phẩm nào
                </h3>
                <p className="text-primary/30 text-[10px] font-bold uppercase tracking-widest">
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
