// src/pages/Home.jsx (hoặc src/views/Home.jsx – tùy bạn)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  TrendingUp,
  Award,
  Truck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
} from "lucide-react";
import "../css/Home.css";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact"
const Home = () => {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bestseller");

  // Kiểm tra đăng nhập
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener("login", checkAuth);
    window.addEventListener("logout", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("login", checkAuth);
      window.removeEventListener("logout", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        if (response.ok) {
          const data = await response.json();
          const productList = data.result || [];
          setProducts(productList);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto slide banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextBanner = () =>
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () =>
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  const banners = [
    "https://i.postimg.cc/PqLdB115/15b2939b-8354-4ed5-a5d9-d7e15136d19e.jpg",
    "https://i.postimg.cc/GpBbZvv2/886b6349-0378-4f6b-b4c9-d2ca87e23626.jpg",
    "https://i.postimg.cc/hGJKHVVv/c15d6816-8373-4d04-82a6-80318d41ea8f.jpg",
  ];

  const getBestSellers = () => {
    return [...products]
      .filter((p) => p.quantity > 0) // Chỉ hiện sản phẩm còn hàng
      .sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0))
      .slice(0, 5);
  };

  const getNewArrivals = () => {
    return [...products]
      .filter((p) => p.quantity > 0)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const goToProduct = (id) => navigate(`/product/${id}`);

  return (
    <div className="min-h-[80vh] relative">
      {/* ================== BANNER ================== */}
     <section className="relative w-full h-[70vh] sm:h-[80vh] overflow-hidden">
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Banner ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === currentBanner ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Lớp phủ gradient từ dưới lên */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>

        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full z-10"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full z-10"
        >
          <ChevronRight size={28} />
        </button>

        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10">
          <button
            className="px-10 py-4 bg-red-500 text-white rounded-full font-bold text-lg hover:bg-red-600 transform hover:scale-110 transition duration-300 shadow-2xl"
            onClick={() => navigate("/product")}
          >
            Shop Now
          </button>
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentBanner
                  ? "bg-white w-8"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ================== FEATURES ================== */}
      {/* Features Section */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 text-lg">
              Experience shopping like never before
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition duration-300">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{
                  background:
                    "linear-gradient(to right, rgb(0, 0, 0), rgb(75, 85, 99))",
                }}
              >
                <ShoppingBag className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Diverse Products</h3>
              <p className="text-gray-600 text-sm">
                Hundreds of latest fashion designs
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition duration-300">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{
                  background:
                    "linear-gradient(to right, rgb(0, 0, 0), rgb(75, 85, 99))",
                }}
              >
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Latest Trends</h3>
              <p className="text-gray-600 text-sm">
                Updated with hottest fashion trends
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition duration-300">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{
                  background:
                    "linear-gradient(to right, rgb(0, 0, 0), rgb(75, 85, 99))",
                }}
              >
                <Award className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">High Quality</h3>
              <p className="text-gray-600 text-sm">100% quality guarantee</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition duration-300">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{
                  background:
                    "linear-gradient(to right, rgb(0, 0, 0), rgb(75, 85, 99))",
                }}
              >
                <Truck className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">2-3 days nationwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================== BEST SELLER & NEW ARRIVAL ================== */}

      {/* === 2 TABS: BEST SELLER & NEW ARRIVAL === */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Collections</h2>
            <p className="text-gray-600 text-lg">
              Handpicked items just for you
            </p>
          </div>
          <div className="flex justify-center mb-10">
            <div className="bg-white rounded-full shadow-md p-1 flex gap-1">
              <button
                onClick={() => setActiveTab("bestseller")}
                className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${
                  activeTab === "bestseller"
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                🔥 Best Sellers
              </button>
              <button
                onClick={() => setActiveTab("newarrival")}
                className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${
                  activeTab === "newarrival"
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                ✨ New Arrivals
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {(activeTab === "bestseller"
                ? getBestSellers()
                : getNewArrivals()
              ).map((product) => (
                <div
                  key={product.id}
                  onClick={() => goToProduct(product.id)}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer group"
                >
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={product.imageUrlFront}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    {product.quantity === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                        <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="font-semibold text-sm line-clamp-2 mb-2 text-gray-800">
                      {product.name}
                    </h4>

                    {/* Giá tiền + Rating nằm chung 1 dòng */}
                    <div className="flex items-center justify-between">
                      <p className="text-red-600 font-bold text-lg">
                        {formatPrice(product.costPrice)}
                      </p>

                      {/* Hiển thị sao đánh giá */}
                      <div className="flex items-center gap-1">
                        <Star
                          size={16}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {product.rating?.toFixed(1) || "5.0"}
                        </span>
                      </div>
                    </div>

                    {/* Hiển thị số lượt đánh giá nhỏ bên dưới (tùy chọn, rất đẹp) */}
                    {product.reviewCount > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        ({product.reviewCount} reviews)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Button - Pass sort type based on active tab */}
          <div className="text-center mt-10">
            <button
              onClick={() => {
                const sortParam =
                  activeTab === "bestseller" ? "bestselling" : "newest";
                navigate(`/product?sort=${sortParam}`);
              }}
              className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-red-500 transition flex items-center gap-2 mx-auto"
            >
              View All Products <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ================== ĐĂNG KÝ KHI CHƯA LOGIN ================== */}
      {!isLoggedIn && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Start Shopping Today
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Sign up to receive special offers and latest product updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transform hover:scale-105 transition duration-300 shadow-lg"
              >
                Sign Up Now
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-50 transform hover:scale-105 transition duration-300"
              >
                Already Have Account
              </button>
            </div>
          </div>
        </section>
      )}
      {/* CHATBOT  */}
      <ChatBot />
      <Contact/>
    </div>
  );
};

export default Home;
