import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Mail, ArrowRight, MoveLeft, KeyRound } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning("Vui lòng nhập email của bạn!");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Đang gửi yêu cầu...");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("resetToken", data.result.token);
        sessionStorage.setItem("otp", data.result.otp);

        toast.success("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra!", { id: loadingToast });
        navigate("/reset_password");
      } else {
        toast.error(data.message || "Email không tồn tại hoặc lỗi hệ thống!", { id: loadingToast });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Không thể kết nối đến máy chủ!", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-0 sm:p-6 md:p-12 font-sans selection:bg-black selection:text-white">
      <div className="bg-white rounded-none sm:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden max-w-6xl w-full grid md:grid-cols-2 min-h-[70vh]">
        
        {/* Left Side - Form */}
        <div className="p-8 sm:p-16 flex flex-col justify-center relative">
          <div className="mb-12">
            <span className="inline-block px-4 py-1.5 bg-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              KREDO Studio / Recovery
            </span>
            <h2 className="text-5xl sm:text-6xl font-black tracking-tighter text-primary uppercase leading-tight">
              Quên <br/> <span className="text-accent">Mật khẩu.</span>
            </h2>
            <p className="text-primary/40 mt-6 font-medium uppercase text-[10px] tracking-[0.15em] max-w-xs leading-relaxed">
              Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào tài khoản của mình.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleForgotPassword}>
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/30 mb-3 group-focus-within:text-accent transition-colors">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-primary/5 px-8 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-primary/10"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="pt-6 space-y-6">
              <button
                type="submit"
                disabled={loading}
                className="group w-full py-5 bg-[#111111] hover:bg-accent text-white font-black text-xs uppercase tracking-[0.3em] transition-colors duration-500 shadow-md flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang gửi yêu cầu..." : "Gửi mã xác thực"}
                {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-red-500" />}
              </button>

              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center px-2">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <MoveLeft size={14} /> Quay lại đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-accent transition-colors"
                >
                  Tạo tài khoản mới
                </button>
              </div>
            </div>
          </form>

          <div className="mt-16 pt-8 border-t border-primary/5 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent">
                <KeyRound size={18} />
             </div>
             <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest leading-relaxed">
                Hệ thống sẽ gửi một mã OTP 6 chữ số <br/> tới email của bạn để xác minh.
             </p>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden md:block relative bg-[#F3F3F3]">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop"
            alt="KREDO Fashion"
            className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
             <div className="border border-white/20 p-12 backdrop-blur-sm bg-white/5 rounded-[2rem] text-center max-w-sm">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Security First</span>
                <h3 className="text-white text-3xl font-black uppercase tracking-tighter leading-tight mb-4">
                   Bảo vệ <br/> Tài khoản.
                </h3>
                <p className="text-white/60 text-[10px] font-medium uppercase tracking-[0.1em] leading-relaxed">
                   Chúng tôi cam kết bảo mật thông tin và dữ liệu của bạn ở mức cao nhất.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
