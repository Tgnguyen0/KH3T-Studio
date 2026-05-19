import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Truck,
} from "lucide-react";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("new");

  const banners = [
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("http://localhost:8080/products"),
          fetch("http://localhost:8080/categories")
        ]);

        let allProducts = [];
        if (prodRes.ok) {
          const data = await prodRes.json();
          allProducts = data.result || [];
          setProducts(allProducts);
        }

        if (catRes.ok) {
          const data = await catRes.json();
          const uniqueCats = [];
          const seenNames = new Set();
          
          (data.result || []).forEach(cat => {
            if (!seenNames.has(cat.name)) {
              seenNames.add(cat.name);
              // Find a representative image from products in this category
              const representativeProduct = allProducts.find(p => p.category?.id === cat.id);
              uniqueCats.push({
                ...cat,
                representativeImage: representativeProduct?.imageUrlFront || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1972&auto=format&fit=crop"
              });
            }
          });
          setDbCategories(uniqueCats.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getFilteredProducts = () => {
    const productsCopy = [...products];
    if (activeTab === "new") {
      return productsCopy.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 4);
    }
    return productsCopy.sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0)).slice(0, 4);
  };

  return (
    <div className="min-h-screen bg-secondary selection:bg-accent selection:text-white">
      {/* ================== DYNAMIC HERO SLIDER ================== */}
      <section className="relative h-[85vh] overflow-hidden bg-primary">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentBanner ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <img src={banner} alt="KREDO Campaign" className="w-full h-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent"></div>
          </div>
        ))}

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-2xl text-left">
              <span className="text-[#c87a53] font-display font-black text-xs tracking-[0.6em] uppercase mb-6 block animate-fade-in-up">
                Season 2026
              </span>
              <h1 className="text-6xl lg:text-[7.5rem] font-display font-black text-white mb-8 tracking-tighter leading-[0.85] uppercase animate-fade-in-up anim-delay-100">
                KREDO <br />
                <span className="text-[#c87a53] underline decoration-2 underline-offset-16">STUDIO</span>
              </h1>
              <p className="text-white/60 text-base lg:text-lg font-medium mb-12 max-w-lg leading-relaxed animate-fade-in-up anim-delay-200">
                Định hình phong cách tối giản, nâng tầm bản sắc cá nhân thông qua ngôn ngữ thiết kế đương đại và nghệ thuật cắt may tỉ mỉ.
              </p>
              <div className="flex gap-4 animate-fade-in-up anim-delay-300">
                <button 
                  onClick={() => navigate("/product")}
                  className="bg-white hover:bg-[#c87a53] text-primary hover:text-white px-10 py-5 rounded-none font-black text-xs tracking-widest uppercase transition-all duration-500 shadow-2xl"
                >
                  Mua sắm ngay
                </button>
                <button 
                  onClick={() => navigate("/about")}
                  className="bg-transparent hover:bg-white text-white hover:text-primary border border-white/20 px-10 py-5 rounded-none font-black text-xs tracking-widest uppercase transition-all duration-500"
                >
                  Câu chuyện
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 z-20">
          <button onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)} className="text-white/40 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-3">
            {banners.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentBanner ? "bg-[#c87a53] scale-150" : "bg-white/20"}`} />
            ))}
          </div>
          <button onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)} className="text-white/40 hover:text-white transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* ================== CATEGORY Grid ================== */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-accent font-black text-xs tracking-[0.4em] uppercase mb-4 block">Bộ sưu tập</span>
            <h2 className="text-4xl lg:text-6xl font-display font-black text-primary tracking-tighter uppercase leading-none">
              Danh mục <br /> <span className="text-primary/20 italic">chọn lọc</span>
            </h2>
          </div>
          <p className="max-w-md text-primary/40 font-medium text-xs leading-relaxed uppercase tracking-wider">
            Mọi sản phẩm của KREDO đều được chế tác từ những chất liệu thượng hạng, tối ưu hóa cả về phom dáng và cảm giác thoải mái khi mặc.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-12 lg:gap-16">
          {dbCategories.map((cat, idx) => (
            <Link 
              to={`/product?category=${cat.id}`} 
              key={idx} 
              className="group relative flex flex-col items-center"
            >
              <div className="relative w-44 h-64 lg:w-56 lg:h-80 overflow-hidden rounded-full border border-primary/5 group-hover:border-[#c87a53]/30 transition-all duration-700 shadow-2xl">
                <img 
                  src={cat.representativeImage} 
                  alt={cat.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-700"></div>
              </div>
              
              <div className="mt-6 text-center relative">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[7px] font-black text-[#c87a53] tracking-[0.5em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500">Discover</span>
                <h3 className="text-xl lg:text-2xl font-display font-black text-primary tracking-tight uppercase leading-none group-hover:text-accent transition-colors duration-500">
                  {cat.name}
                </h3>
                <div className="w-0 h-0.5 bg-[#c87a53] mx-auto mt-2 group-hover:w-8 transition-all duration-500"></div>
              </div>

              {/* Decorative Number */}
              <span className="absolute -left-6 top-8 text-5xl font-display font-black text-primary/5 select-none group-hover:text-[#c87a53]/10 transition-colors">
                0{idx + 1}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================== NEW DROPS SECTION ================== */}
      <section className="bg-white py-32 border-y border-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-16">
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab("new")}
                className={`text-xl font-display font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "new" ? "text-primary border-b-2 border-accent pb-1" : "text-primary/20 hover:text-primary/40 pb-1"}`}
              >
                Hàng mới về
              </button>
              <button 
                onClick={() => setActiveTab("best")}
                className={`text-xl font-display font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "best" ? "text-primary border-b-2 border-accent pb-1" : "text-primary/20 hover:text-primary/40 pb-1"}`}
              >
                Bán chạy nhất
              </button>
            </div>
            <Link to="/product" className="text-[#c87a53] font-black text-xs tracking-widest uppercase hover:underline">Xem tất cả</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [1, 2, 3, 4].map((i) => <div key={i} className="aspect-[3/4] bg-secondary animate-pulse" />)
            ) : (
              getFilteredProducts().map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ================== VALUE PROPS ================== */}
      <section className="py-24 bg-[#fafbf9]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="flex flex-col items-center text-center p-8 border border-primary/5 bg-white group hover:border-[#c87a53]/30 transition-all duration-500 shadow-sm">
                  <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-6 group-hover:bg-[#c87a53] transition-all duration-500">
                     <Truck className="text-primary group-hover:text-white transition-colors" size={20} />
                  </div>
                  <h3 className="text-primary font-display font-black tracking-widest text-[11px] mb-3 uppercase">Vận chuyển nhanh</h3>
                  <p className="text-primary/40 text-[11px] font-medium leading-relaxed max-w-[220px]">Giao hàng hỏa tốc trong vòng 24-48 giờ tại các thành phố lớn.</p>
               </div>
               <div className="flex flex-col items-center text-center p-8 border border-primary/5 bg-white group hover:border-[#c87a53]/30 transition-all duration-500 shadow-sm">
                  <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-6 group-hover:bg-[#c87a53] transition-all duration-500">
                     <Award className="text-primary group-hover:text-white transition-colors" size={20} />
                  </div>
                  <h3 className="text-primary font-display font-black tracking-widest text-[11px] mb-3 uppercase">Chất lượng cao</h3>
                  <p className="text-primary/40 text-[11px] font-medium leading-relaxed max-w-[220px]">Cam kết sử dụng chất liệu vải tuyển chọn kỹ lưỡng đạt chuẩn xuất khẩu.</p>
               </div>
               <div className="flex flex-col items-center text-center p-8 border border-primary/5 bg-white group hover:border-[#c87a53]/30 transition-all duration-500 shadow-sm">
                  <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-6 group-hover:bg-[#c87a53] transition-all duration-500">
                     <TrendingUp className="text-primary group-hover:text-white transition-colors" size={20} />
                  </div>
                  <h3 className="text-primary font-display font-black tracking-widest text-[11px] mb-3 uppercase">Phong cách dẫn đầu</h3>
                  <p className="text-primary/40 text-[11px] font-medium leading-relaxed max-w-[220px]">Cập nhật nhanh chóng những xu hướng thời trang tối giản mới nhất thế giới.</p>
               </div>
            </div>
         </div>
      </section>

      <ChatBot />
      <Contact />
    </div>
  );
};

export default Home;
