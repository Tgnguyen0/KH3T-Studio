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
    <div className="min-h-screen bg-[#FDFCF8]">
      {/* ================== DYNAMIC HERO SLIDER ================== */}
      <section className="relative h-[85vh] overflow-hidden bg-primary">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentBanner ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <img src={banner} alt="KREDO Campaign" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent"></div>
          </div>
        ))}

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-2xl">
              <span className="text-accent font-black text-xs tracking-[0.6em] uppercase mb-6 block animate-fade-in">Season 2025</span>
              <h1 className="text-7xl lg:text-[10rem] font-black text-white mb-8 tracking-tighter leading-[0.85] uppercase">
                KREDO <br />
                <span className="text-accent underline decoration-4 underline-offset-8">STUDIO</span>
              </h1>
              <p className="text-white/70 text-lg lg:text-xl font-medium mb-12 max-w-lg leading-relaxed">
                Định hình phong cách tối giản, nâng tầm bản sắc cá nhân thông qua ngôn ngữ thiết kế đương đại.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => navigate("/product")}
                  className="bg-white text-primary px-10 py-5 rounded-full font-black text-xs tracking-widest uppercase hover:bg-accent hover:text-white transition-all duration-500 shadow-2xl"
                >
                  Mua sắm ngay
                </button>
                <button 
                  onClick={() => navigate("/about")}
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-full font-black text-xs tracking-widest uppercase hover:bg-white hover:text-primary transition-all duration-500"
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
            <ChevronLeft size={32} />
          </button>
          <div className="flex gap-3">
            {banners.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i === currentBanner ? "bg-accent scale-150" : "bg-white/20"}`} />
            ))}
          </div>
          <button onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)} className="text-white/40 hover:text-white transition-colors">
            <ChevronRight size={32} />
          </button>
        </div>
      </section>

      {/* ================== CATEGORY BENTO GRID ================== */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-accent font-black text-xs tracking-[0.4em] uppercase mb-4 block">Bộ sưu tập</span>
            <h2 className="text-5xl lg:text-7xl font-black text-primary tracking-tighter uppercase leading-none">
              Danh mục <br /> <span className="text-primary/20 italic">chọn lọc</span>
            </h2>
          </div>
          <p className="max-w-md text-primary/40 font-medium text-sm leading-relaxed">
            Mọi sản phẩm của KREDO đều được chế tác từ những chất liệu thượng hạng, tối ưu hóa cả về phom dáng và cảm giác mặc.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-12 lg:gap-20">
          {dbCategories.map((cat, idx) => (
            <Link 
              to={`/product?category=${cat.id}`} 
              key={idx} 
              className="group relative flex flex-col items-center"
            >
              <div className="relative w-48 h-72 lg:w-64 lg:h-96 overflow-hidden rounded-full border-4 border-transparent group-hover:border-accent/30 transition-all duration-700 shadow-2xl">
                <img 
                  src={cat.representativeImage} 
                  alt={cat.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-700"></div>
              </div>
              
              <div className="mt-8 text-center relative">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-accent tracking-[0.5em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500">Discover</span>
                <h3 className="text-3xl lg:text-4xl font-black text-primary tracking-tighter uppercase leading-none group-hover:text-accent transition-colors duration-500">
                  {cat.name}
                </h3>
                <div className="w-0 h-1 bg-accent mx-auto mt-2 group-hover:w-12 transition-all duration-500"></div>
              </div>

              {/* Decorative Number */}
              <span className="absolute -left-6 top-10 text-6xl font-black text-primary/5 select-none group-hover:text-accent/10 transition-colors">
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
                className={`text-2xl font-black uppercase tracking-tighter transition-all duration-300 ${activeTab === "new" ? "text-primary" : "text-primary/20 hover:text-primary/40"}`}
              >
                Hàng mới về
              </button>
              <button 
                onClick={() => setActiveTab("best")}
                className={`text-2xl font-black uppercase tracking-tighter transition-all duration-300 ${activeTab === "best" ? "text-primary" : "text-primary/20 hover:text-primary/40"}`}
              >
                Bán chạy nhất
              </button>
            </div>
            <Link to="/product" className="text-accent font-black text-xs tracking-widest uppercase hover:underline">Xem tất cả</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [1, 2, 3, 4].map((i) => <div key={i} className="aspect-[3/4] bg-secondary animate-pulse rounded-3xl" />)
            ) : (
              getFilteredProducts().map((product) => (
                <div key={product.id} className="group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 bg-secondary">
                    <img 
                      src={product.imageUrlFront || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1974&auto=format&fit=crop"} 
                      alt={product.name} 
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${product.quantity <= 0 ? "grayscale opacity-50" : ""}`}
                    />
                    {product.quantity <= 0 && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-xl">
                          <span className="text-primary font-black uppercase tracking-widest text-[10px]">Hết hàng</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                       <button className="bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-accent transition-colors">
                          <ShoppingBag size={20} />
                       </button>
                    </div>
                  </div>
                  <h3 className="text-primary font-black uppercase tracking-tight text-sm mb-1 truncate">{product.name}</h3>
                  <p className="text-accent font-black text-xs">{formatPrice(product.costPrice || product.price)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ================== VALUE PROPS ================== */}
      <section className="py-24 bg-[#FDFCF8]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
               <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6 group-hover:bg-accent transition-colors duration-500">
                     <Truck className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-3">Vận chuyển nhanh</h3>
                  <p className="text-primary/40 text-xs font-medium max-w-[200px]">Giao hàng hỏa tốc trong vòng 24-48 giờ tại nội thành.</p>
               </div>
               <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6 group-hover:bg-accent transition-colors duration-500">
                     <Award className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-3">Chất lượng cao</h3>
                  <p className="text-primary/40 text-xs font-medium max-w-[200px]">Cam kết sử dụng chất liệu vải tuyển chọn đạt chuẩn xuất khẩu.</p>
               </div>
               <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6 group-hover:bg-accent transition-colors duration-500">
                     <TrendingUp className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-3">Phong cách dẫn đầu</h3>
                  <p className="text-primary/40 text-xs font-medium max-w-[200px]">Luôn cập nhật những xu hướng thời trang tối giản mới nhất.</p>
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
