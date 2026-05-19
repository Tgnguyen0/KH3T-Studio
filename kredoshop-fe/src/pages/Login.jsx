import React, { useState } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, User, Lock, Mail } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formAuthentication, setFormAuthentication] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormAuthentication((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Đang xác thực...");

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formAuthentication),
      });

      if (response.ok) {
        const result = await response.json();

        if (result && result.result && result.result.token) {
          const token = result.result.token;
          localStorage.setItem("accessToken", token);
          
          const decodedToken = jwtDecode(token);
          const userRole = decodedToken.scope;

          toast.success("Chào mừng bạn trở lại!", { id: loadingToast });

          if (userRole === "ADMIN") {
            navigate("/admin");
          } else if (userRole === "USER") {
            navigate("/");
          } else {
            navigate("/staff/orders");
          }
        } else {
          toast.error("Đăng nhập thất bại: Không nhận được mã xác thực.", { id: loadingToast });
        }
      } else {
        let errorData = { message: "Tên đăng nhập hoặc mật khẩu không đúng." };
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error("Could not parse JSON from error response.");
        }
        toast.error(errorData.message || "Đăng nhập thất bại.", { id: loadingToast });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Đã xảy ra lỗi kết nối. Vui lòng thử lại.", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-0 sm:p-6 md:p-12 font-sans selection:bg-black selection:text-white">
      <div className="bg-white rounded-none sm:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden max-w-6xl w-full grid md:grid-cols-2 min-h-[85vh]">
        
        {/* Left Side - Form */}
        <div className="p-8 sm:p-16 flex flex-col justify-center relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/30 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <div className="mb-12">
              <span className="inline-block px-4 py-1.5 bg-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                KREDO Studio / Auth
              </span>
              <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-primary uppercase leading-tight">
                Đăng <br/> <span className="text-accent">Nhập.</span>
              </h2>
              <p className="text-primary/40 mt-4 font-medium uppercase text-[11px] tracking-widest">
                Truy cập vào không gian thời trang của bạn
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Username Input */}
                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary/30 mb-3 group-focus-within:text-accent transition-colors">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="text"
                      name="username"
                      className="w-full bg-transparent border-b-2 border-primary/5 px-8 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-primary/10"
                      value={formAuthentication.username}
                      onChange={handleChange}
                      placeholder="Nhập tài khoản của bạn..."
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-primary/30 group-focus-within:text-accent transition-colors">
                      Mật khẩu
                    </label>
                    <button 
                      type="button"
                      onClick={() => navigate("/forget_password")}
                      className="text-[9px] font-black uppercase tracking-widest text-primary/30 hover:text-primary transition-colors"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="w-full bg-transparent border-b-2 border-primary/5 px-8 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-primary/10"
                      value={formAuthentication.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/20 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                 <button
                  type="submit"
                  className="group w-full py-5 bg-[#111111] hover:bg-accent text-white font-black text-xs uppercase tracking-[0.3em] transition-colors duration-500 shadow-md flex items-center justify-center gap-3"
                >
                  Đăng nhập ngay
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-red-500" />
                </button>
                
                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="h-[1px] flex-1 bg-primary/5"></div>
                  <span className="text-[10px] font-black text-primary/20 uppercase tracking-widest">Hoặc</span>
                  <div className="h-[1px] flex-1 bg-primary/5"></div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="w-full py-5 border border-primary/10 hover:border-primary text-primary font-black text-xs uppercase tracking-[0.3em] hover:bg-[#111111] hover:text-white transition-all duration-500 bg-transparent"
                >
                  Tạo tài khoản mới
                </button>
              </div>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[10px] font-medium text-primary/30 uppercase tracking-[0.1em]">
                Bằng cách đăng nhập, bạn đồng ý với <br/> 
                <a href="/policy" className="text-primary hover:text-accent underline transition-colors">Điều khoản & Chính sách</a> của KREDO
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image/Visual */}
        <div className="hidden md:block relative bg-[#E8E6E1]">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"
            alt="KREDO Editorial"
            className="w-full h-full object-cover mix-blend-multiply opacity-80 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-16 left-16 right-16">
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
              Spring / Summer 2026
            </span>
            <h3 className="text-white text-4xl font-black uppercase tracking-tighter leading-none mb-4">
              Kinh điển <br/> & Tối giản.
            </h3>
            <div className="w-12 h-1 bg-accent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
