import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Shield,
  Heart,
  Package,
} from "lucide-react";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [account, setAccount] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchAccount = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setAccount(null);
        return;
      }
      try {
        const response = await fetch("http://localhost:8080/accounts/myinfor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAccount(data.result);
        } else {
          // Token invalid or expired
          localStorage.removeItem("accessToken");
          setAccount(null);
        }
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    };
    fetchAccount();
  }, [location.pathname]); // Re-fetch on navigation to keep sync

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.result || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!account) {
        setCartCount(0);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8080/carts/account/${account.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setCartCount(data.result?.totalQuantity || 0);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();

    const handleCartUpdate = () => fetchCart();
    window.addEventListener("cartUpdated", handleCartUpdate);

    const interval = setInterval(fetchCart, 3000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [account]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setAccount(null);
    setCartCount(0);
    toast.success("Đã đăng xuất thành công");
    navigate("/login");
  };

  const submitSearch = () => {
    if (searchValue.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchValue.trim())}`);
      setIsSearchOpen(false);
      setSearchValue("");
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      submitSearch();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 border-b border-primary/5 ${isScrolled ? "py-3.5 bg-white/95 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.02)]" : "py-5.5 bg-[#fbfbf9]/90 backdrop-blur-md"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl sm:text-3xl font-display font-black tracking-[0.18em] text-primary uppercase transition-colors group-hover:text-accent">
              Kredo<span className="text-red-500">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <Link
              to="/"
              className={`relative font-display font-black text-[10.5px] uppercase tracking-[0.25em] pb-1 transition-all duration-300 premium-border ${
                isActive("/")
                  ? "text-accent border-accent"
                  : "text-primary/50 hover:text-primary"
              }`}
            >
              Trang chủ
            </Link>
            <Link
              to="/product"
              className={`relative font-display font-black text-[10.5px] uppercase tracking-[0.25em] pb-1 transition-all duration-300 premium-border ${
                isActive("/product")
                  ? "text-accent border-accent"
                  : "text-primary/50 hover:text-primary"
              }`}
            >
              Sản phẩm
            </Link>
            <Link
              to="/about"
              className={`relative font-display font-black text-[10.5px] uppercase tracking-[0.25em] pb-1 transition-all duration-300 premium-border ${
                isActive("/about")
                  ? "text-accent border-accent"
                  : "text-primary/50 hover:text-primary"
              }`}
            >
              Về chúng tôi
            </Link>
            <Link
              to="/policy"
              className={`relative font-display font-black text-[10.5px] uppercase tracking-[0.25em] pb-1 transition-all duration-300 premium-border ${
                isActive("/policy")
                  ? "text-accent border-accent"
                  : "text-primary/50 hover:text-primary"
              }`}
            >
              Chính sách
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Search */}
            <div className="relative" ref={searchRef}>
               <button 
                 onClick={() => setIsSearchOpen(!isSearchOpen)}
                 className="text-primary/60 hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary/80"
               >
                 <Search size={18} />
               </button>
               {isSearchOpen && (
                 <div className="absolute right-0 top-full mt-4 w-76 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-2xl p-4 border border-primary/5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="relative flex items-center">
                       <Search size={14} className="absolute left-4 text-primary/30" />
                       <input 
                         autoFocus
                         type="text"
                         placeholder="Tìm kiếm sản phẩm..."
                         className="w-full pl-10 pr-12 py-3.5 bg-secondary text-xs font-semibold rounded-xl focus:ring-1 focus:ring-red-500 focus:outline-none"
                         value={searchValue}
                         onChange={(e) => setSearchValue(e.target.value)}
                         onKeyDown={handleSearch}
                       />
                       <button 
                         onClick={submitSearch}
                         className="absolute right-2 p-2 bg-[#111111] hover:bg-accent text-white rounded-lg transition-colors"
                       >
                         <Search size={12} />
                       </button>
                    </div>
                 </div>
               )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-primary/60 hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            {account ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-1 pr-3 bg-secondary rounded-full hover:bg-gray-100 transition-all border border-primary/5"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black border border-accent/30 overflow-hidden">
                    {account.customer?.fullName?.charAt(0) || <User size={14} />}
                  </div>
                  <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-primary truncate max-w-[80px]">
                    {account.customer?.fullName?.split(' ').pop()}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-primary/60 transition-transform duration-300 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-64 bg-white border border-primary/5 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="px-6 py-6 border-b border-primary/5 bg-secondary/30">
                      <p className="text-xs font-black tracking-widest text-primary/40 uppercase mb-1">
                        Tài khoản
                      </p>
                      <p className="text-sm font-black text-primary truncate">
                        {account.customer?.fullName}
                      </p>
                      <p className="text-[10px] text-primary/40 truncate font-medium">
                        {account.username}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-black text-primary/70 hover:text-primary hover:bg-secondary rounded-2xl transition-all group"
                      >
                        <User size={18} className="text-primary/30 group-hover:text-accent" />
                        Trang cá nhân
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-black text-primary/70 hover:text-primary hover:bg-secondary rounded-2xl transition-all group"
                      >
                        <Package size={18} className="text-primary/30 group-hover:text-accent" />
                        Đơn hàng của tôi
                      </Link>
                      <Link
                        to="/wishlists"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-black text-primary/70 hover:text-primary hover:bg-secondary rounded-2xl transition-all group"
                      >
                        <Heart size={18} className="text-primary/30 group-hover:text-accent" />
                        Danh sách yêu thích
                      </Link>

                      {(account.role?.name === "ADMIN" ||
                        account.role?.name === "STAFF") && (
                        <Link
                          to={
                            account.role?.name === "ADMIN"
                              ? "/admin/dashboard"
                              : "/staff/orders"
                          }
                          className="flex items-center gap-3 px-4 py-3 text-sm font-black text-primary/70 hover:text-primary hover:bg-secondary rounded-2xl transition-all group"
                        >
                          <Shield size={18} className="text-primary/30 group-hover:text-accent" />
                          Quản lý hệ thống
                        </Link>
                      )}
                    </div>

                    <div className="p-2 border-t border-primary/5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group"
                      >
                        <LogOut size={18} />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                 <Link
                  to="/login"
                  className="text-primary/60 hover:text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 transition-all"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-accent transition-all duration-300 shadow-lg shadow-primary/10"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-primary/60 hover:text-primary p-2 rounded-full hover:bg-secondary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-primary/5 p-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          <nav className="flex flex-col gap-6">
            <Link
              to="/"
              className="text-2xl font-black text-primary tracking-tighter uppercase"
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/product"
              className="text-2xl font-black text-primary tracking-tighter uppercase"
              onClick={() => setIsMenuOpen(false)}
            >
              Sản phẩm
            </Link>
            <Link
              to="/about"
              className="text-2xl font-black text-primary tracking-tighter uppercase"
              onClick={() => setIsMenuOpen(false)}
            >
              Về chúng tôi
            </Link>
            <Link
              to="/policy"
              className="text-2xl font-black text-primary tracking-tighter uppercase"
              onClick={() => setIsMenuOpen(false)}
            >
              Chính sách
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
