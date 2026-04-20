import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
const ResetPassword = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("resetToken");
        const otp = sessionStorage.getItem("otp");

        if (!token) {
            alert("Please initiate the forgot password request first!");
            navigate("/forget_password");
        }
    }, [navigate])

    const handleResetSubmit = async () => {
        if (!otp || !newPassword) {
            alert("Please enter both the OTP and the new password.");
            return;
        }
        // Retrieve token from sessionStorage to prepare for sending
        const token = sessionStorage.getItem("resetToken");

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: token,        // Token retrieved from Session
                    otp: otp,            // OTP entered by user
                    newPassword: newPassword // New password entered by user
                }),
            });

            const data = await response.json();

            if (response.ok && data.code === 0) {
                alert("Password changed successfully! Please log in again.");

                // --- IMPORTANT: CLEAN UP SESSION ---
                sessionStorage.removeItem("resetToken");
                sessionStorage.removeItem("otp");

                navigate("/login");
            } else {
                alert(data.result || "Incorrect or expired OTP!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server connection error!");
        } finally {
            setLoading(false);
        }
    };

     return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
        
        {/* Left side - Form */}
        <div className="p-8 md:p-12">
          <h2 className="font-bold text-4xl mb-3">Reset Password</h2>
          

          <div className="grid gap-6">
            
            {/* Input OTP */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <label className="text-gray-700 font-medium">Mã OTP (6 số):</label>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-400 transition tracking-widest"
                placeholder="XXXXXX"
                maxLength={6}
              />
            </div>

            {/* Input New Password */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <label className="text-gray-700 font-medium">Mật khẩu mới:</label>
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-400 transition"
                placeholder="Nhập mật khẩu mới..."
              />
            </div>

            <button
              onClick={handleResetSubmit}
              disabled={loading}
              className={`w-full py-4 rounded-lg text-white font-bold text-lg transition mt-4 ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐỔI MẬT KHẨU"}
            </button>

            <button 
              className="text-sm text-gray-500 hover:underline text-center mt-2"
              onClick={() => {
                // Nếu muốn quay lại nhập lại email, xóa session cũ đi
                sessionStorage.removeItem("resetToken");
                sessionStorage.removeItem("resetEmail");
                navigate("/forgot_password");
              }}
            >
              Quay lại nhập Email khác
            </button>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-red-400 to-red-500 p-12">
          <div className="relative">
            <div className="absolute inset-0 bg-red-300 rounded-full blur-3xl opacity-50"></div>
            <img 
              src="https://i.postimg.cc/J0TgG6NZ/Thiet-ke-chua-co-ten-(6).png" 
              alt="Profile" 
              className="relative rounded-full w-80 h-80 object-cover border-8 border-white shadow-2xl"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
export default ResetPassword;