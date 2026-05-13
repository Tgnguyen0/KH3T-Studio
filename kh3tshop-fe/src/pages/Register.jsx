import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { MoveLeft, UserPlus, CheckCircle2, ArrowRight, User, Phone, Mail, Lock, Calendar } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const REGEX = {
    email: /^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/,
    phoneNumber: /^(0[3|5|7|8|9])+([0-9]{8})$/,
  };

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    gender: "MALE",
    dateOfBirth: "",
    username: "",
    password: "",
    password_confirmed: "",
  });

  const [validationStatus, setValidationStatus] = useState({});

  const handleValidation = (e) => {
    const { name, value } = e.target;
    let isValid = false;

    if (value.trim() === "") {
      isValid = false;
    } else {
      switch (name) {
        case "fullName":
        case "username":
          isValid = value.trim().length >= 3;
          break;
        case "email":
          isValid = REGEX.email.test(value);
          break;
        case "phoneNumber":
          isValid = REGEX.phoneNumber.test(value);
          break;
        case "password":
          isValid = value.length >= 8;
          break;
        case "password_confirmed":
          isValid = formData.password === value;
          break;
        default:
          isValid = true;
          break;
      }
    }
    setValidationStatus((prev) => ({ ...prev, [name]: isValid }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Đang khởi tạo tài khoản...");

    if (formData.password !== formData.password_confirmed) {
      toast.warning("Mật khẩu không khớp", { id: loadingToast });
      return;
    }

    const accountData = {
      username: formData.username,
      password: formData.password,
      customer: {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
      },
    };

    try {
      const response = await fetch("http://localhost:8080/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountData),
      });

      if (response.ok) {
        toast.success("Đăng ký thành công! Chào mừng bạn đến với KREDO.", { id: loadingToast });
        navigate("/login");
      } else {
        const errorData = await response.json();
        toast.error(`Đăng ký thất bại: ${errorData.message || "Vui lòng thử lại."}`, { id: loadingToast });
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi kết nối.", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-0 sm:p-6 md:p-12 font-sans selection:bg-black selection:text-white">
      <div className="bg-white rounded-none sm:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden max-w-6xl w-full grid lg:grid-cols-12 min-h-[85vh]">
        
        {/* Left Section - Branding */}
        <div className="hidden lg:flex lg:col-span-4 flex-col justify-between p-16 bg-primary text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <Link to="/" className="flex items-center gap-2 relative z-10">
             <span className="text-3xl font-black tracking-tighter uppercase">
               Kredo<span className="text-accent">.</span>
             </span>
          </Link>

          <div className="relative z-10">
            <h1 className="text-6xl font-black tracking-tighter leading-none uppercase mb-8">
              Tham gia <br /> <span className="text-accent">KREDO.</span>
            </h1>
            <p className="text-white/40 text-sm font-medium max-w-xs leading-relaxed uppercase tracking-widest">
              Ghi danh để nhận những ưu đãi đặc quyền và cập nhật xu hướng mới nhất.
            </p>
          </div>

          <div className="flex gap-12 relative z-10 border-t border-white/10 pt-12">
             <div>
                <span className="block text-2xl font-black mb-1">10K+</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Members</span>
             </div>
             <div>
                <span className="block text-2xl font-black mb-1">2026</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Season</span>
             </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="lg:col-span-8 p-8 sm:p-16 flex flex-col justify-center relative bg-white">
          <div className="mb-12 flex justify-between items-start">
             <div>
                <span className="inline-block px-4 py-1.5 bg-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  KREDO Studio / Registration
                </span>
                <h2 className="text-4xl font-black text-primary tracking-tighter uppercase">Tạo tài khoản</h2>
             </div>
             <Link to="/login" className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline pt-2">
                Đã có tài khoản?
             </Link>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {/* Full Name */}
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/30 mb-3 group-focus-within:text-accent transition-colors">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full bg-transparent border-b-2 border-primary/5 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-primary/10"
                  placeholder="Nguyễn Văn A"
                  onChange={handleChange}
                  onBlur={handleValidation}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/30 mb-3 group-focus-within:text-accent transition-colors">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="text"
                  name="phoneNumber"
                  required
                  className="w-full bg-transparent border-b-2 border-primary/5 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-primary/10"
                  placeholder="0987..."
                  onChange={handleChange}
                  onBlur={handleValidation}
                />
              </div>
            </div>

            {/* Email */}
            <div className="group md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/30 mb-3 group-focus-within:text-accent transition-colors">Email</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-transparent border-b-2 border-primary/5 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-primary/10"
                  placeholder="kredo@example.com"
                  onChange={handleChange}
                  onBlur={handleValidation}
                />
              </div>
            </div>

            {/* Gender */}
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/30 mb-3 group-focus-within:text-accent transition-colors">Giới tính</label>
              <select 
                name="gender" 
                className="w-full bg-transparent border-b-2 border-primary/5 px-0 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                onChange={handleChange}
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            {/* DOB */}
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/30 mb-3 group-focus-within:text-accent transition-colors">Ngày sinh</label>
              <div className="relative">
                <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="date"
                  name="dateOfBirth"
                  required
                  className="w-full bg-transparent border-b-2 border-primary/5 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Account Info Splitter */}
            <div className="md:col-span-2 pt-4">
               <div className="h-[1px] w-full bg-primary/5"></div>
            </div>

            {/* Username */}
            <div className="group md:col-span-2">
               <label className="block text-[10px] font-black uppercase tracking-widest text-primary/30 mb-3 group-focus-within:text-accent transition-colors">Tên đăng nhập</label>
               <div className="relative">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="text"
                  name="username"
                  required
                  className="w-full bg-transparent border-b-2 border-primary/5 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-primary/10"
                  placeholder="Chọn tài khoản của bạn..."
                  onChange={handleChange}
                  onBlur={handleValidation}
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/30 mb-3 group-focus-within:text-accent transition-colors">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full bg-transparent border-b-2 border-primary/5 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-primary/10"
                  placeholder="••••••••"
                  onChange={handleChange}
                  onBlur={handleValidation}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/30 mb-3 group-focus-within:text-accent transition-colors">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="password"
                  name="password_confirmed"
                  required
                  className="w-full bg-transparent border-b-2 border-primary/5 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-primary/10"
                  placeholder="••••••••"
                  onChange={handleChange}
                  onBlur={handleValidation}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 pt-8">
               <button
                type="submit"
                className="group w-full py-6 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-accent transition-all duration-500 shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
              >
                Tạo tài khoản KREDO
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
             <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-primary transition-colors">
                <MoveLeft size={14} /> Quay lại trang chủ
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
