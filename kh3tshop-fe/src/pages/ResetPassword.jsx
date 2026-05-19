import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { KeyRound, ShieldCheck, ArrowRight, MoveLeft, Lock } from "lucide-react";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("resetToken");
        if (!token) {
            toast.warning("Vui lòng thực hiện yêu cầu quên mật khẩu trước!");
            navigate("/forget_password");
        }
    }, [navigate]);

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword) {
            toast.warning("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const token = sessionStorage.getItem("resetToken");
        setLoading(true);
        const loadingToast = toast.loading("Đang thiết lập mật khẩu mới...");

        try {
            const response = await fetch("http://localhost:8080/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: token,
                    otp: otp,
                    newPassword: newPassword
                }),
            });

            const data = await response.json();

            if (response.ok && data.code === 0) {
                toast.success("Đổi mật khẩu thành công! Hãy đăng nhập lại.", { id: loadingToast });
                sessionStorage.removeItem("resetToken");
                sessionStorage.removeItem("otp");
                navigate("/login");
            } else {
                toast.error(data.result || "Mã OTP không chính xác hoặc đã hết hạn!", { id: loadingToast });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Lỗi kết nối máy chủ!", { id: loadingToast });
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
                            KREDO Studio / Security
                        </span>
                        <h2 className="text-5xl sm:text-6xl font-black tracking-tighter text-primary uppercase leading-tight">
                            Đặt lại <br/> <span className="text-accent">Mật khẩu.</span>
                        </h2>
                        <p className="text-primary/40 mt-6 font-medium uppercase text-[10px] tracking-[0.15em] max-w-xs leading-relaxed">
                            Nhập mã OTP vừa được gửi tới email của bạn và mật khẩu mới.
                        </p>
                    </div>

                    <form className="space-y-8" onSubmit={handleResetSubmit}>
                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-primary/30 mb-3 group-focus-within:text-accent transition-colors">
                                    Mã OTP (6 chữ số)
                                </label>
                                <div className="relative">
                                    <KeyRound className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                        className="w-full bg-transparent border-b-2 border-primary/5 px-8 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-primary/10 tracking-[0.5em]"
                                        placeholder="XXXXXX"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-primary/30 mb-3 group-focus-within:text-accent transition-colors">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-transparent border-b-2 border-primary/5 px-8 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-primary/10"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 space-y-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full py-5 bg-[#111111] hover:bg-[#c87a53] text-white font-black text-xs uppercase tracking-[0.3em] transition-colors duration-500 shadow-md flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
                                {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#c87a53]" />}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    sessionStorage.removeItem("resetToken");
                                    navigate("/forgot_password");
                                }}
                                className="text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-primary transition-colors flex items-center gap-2 mx-auto"
                            >
                                <MoveLeft size={14} /> Quay lại nhập Email khác
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side - Visual */}
                <div className="hidden md:block relative bg-[#EFEFEF]">
                    <img
                        src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1920&auto=format&fit=crop"
                        alt="KREDO Security"
                        className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute bottom-16 left-16 right-16">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white shadow-xl shadow-accent/40">
                                <ShieldCheck size={24} />
                            </div>
                            <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Verified Account</span>
                        </div>
                        <h3 className="text-white text-4xl font-black uppercase tracking-tighter leading-none mb-4">
                           Xác minh <br/> An toàn.
                        </h3>
                        <p className="text-white/60 text-[10px] font-medium uppercase tracking-[0.1em] leading-relaxed max-w-xs">
                           Mã OTP chỉ có hiệu lực trong thời gian ngắn. Vui lòng không chia sẻ mã này cho bất kỳ ai.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
