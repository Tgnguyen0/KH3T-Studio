import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import dauTick from "../assets/dauTick.png";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";

const QrPayment = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const orderId = params.get("orderId");
  const amount = params.get("amount");
  const invoiceId = params.get("invoiceId");
  const invoiceCode = params.get("invoiceCode");
  const interval = useRef(null);
  const isPaidRef = useRef(false);

  const qrCode = `https://qr.sepay.vn/img?acc=107876577018&bank=VietinBank&amount=${amount}&des=${invoiceCode}`;

  const handleFetchInvoiceById = async () => {
    if (isPaidRef.current) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8080/invoices/${invoiceId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const invoice = await res.json();
      console.log("new invoice", invoice);
      setInvoiceData(invoice);
      if (invoice.paymentStatus === "PAID") {
        isPaidRef.current = true;
        clearInterval(interval.current);
        await fetch(`http://localhost:8080/orders/status/${orderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ statusOrder: "CONFIRMED" }),
        });

        toast.success("Thanh toán thành công! KREDO cảm ơn quý khách.");
        setPaymentSuccess(true);
      }
    } catch (error) {
      console.log("Invoice not found", error);
    }
  };

  useEffect(() => {
    // Run immediately on mount
    handleFetchInvoiceById();

    interval.current = setInterval(() => {
      handleFetchInvoiceById();
    }, 3000);

    return () => clearInterval(interval.current);
  }, []);

  const handleCopy = (text, fieldName, label) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Đã sao chép ${label} vào bộ nhớ tạm!`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleSimulatePayment = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/payment/sepay-callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Apikey spsk_live_SHcAdLFTRFAQxy8xJqrNMYzNPiVPoJoC"
        },
        body: JSON.stringify({
          transferType: "in",
          code: invoiceCode,
          transferAmount: Number(amount)
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Mô phỏng thanh toán thành công! Đang tiến hành đối soát...");
        handleFetchInvoiceById();
      } else {
        toast.error("Mô phỏng thất bại: " + data.message);
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ giả lập thanh toán!");
      console.error(error);
    }
  };


  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-secondary py-16 px-4 sm:px-6 lg:px-8 selection:bg-accent selection:text-white flex flex-col items-center justify-center relative">
        <div className="max-w-md w-full mx-auto animate-scale-blur bg-white rounded-3xl overflow-hidden shadow-2xl border border-primary/5 p-8 md:p-10 text-center relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Success Tick */}
          <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-green-50 border-4 border-green-100">
            <img src={dauTick} alt="Thành công" className="w-12 h-12 object-contain" />
          </div>

          <h1 className="text-2xl font-display font-black tracking-tight text-primary uppercase">
            Thanh Toán Thành Công
          </h1>
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-[0.2em] mt-2">
            Đơn hàng đã được xác nhận tự động
          </p>

          {/* Invoice Summary Box */}
          <div className="mt-8 p-6 rounded-2xl bg-secondary/50 border border-primary/5 text-left space-y-3.5">
            <div className="flex justify-between items-center text-xs font-bold text-primary/45 uppercase tracking-widest pb-3 border-b border-primary/5">
              <span>Mã hóa đơn</span>
              <span className="text-primary font-black font-display tracking-wider select-all">
                {invoiceCode || (invoiceData && invoiceData.invoiceCode) || "—"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-primary/45 uppercase tracking-widest pb-3 border-b border-primary/5">
              <span>Số tiền đã thanh toán</span>
              <span className="text-accent font-black tracking-wide text-sm">
                {Number(amount).toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-primary/45 uppercase tracking-widest pb-3 border-b border-primary/5">
              <span>Phương thức</span>
              <span className="text-primary font-black uppercase">Chuyển khoản QR</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-primary/45 uppercase tracking-widest">
              <span>Trạng thái</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[9px] font-black uppercase tracking-wider">
                ĐÃ THANH TOÁN
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => navigate("/orders")}
              className="w-full py-4 bg-[#111111] hover:bg-accent text-white text-xs font-black tracking-[0.35em] uppercase transition-all duration-300 shadow-md cursor-pointer"
            >
              Xem lịch sử mua hàng
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-4 border border-primary/10 text-primary bg-white hover:bg-secondary text-xs font-black tracking-[0.35em] uppercase transition-all duration-300 cursor-pointer"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary py-16 px-4 sm:px-6 lg:px-8 selection:bg-accent selection:text-white flex flex-col items-center justify-center relative">
      <style>{`
        @keyframes scan {
          0%, 100% { top: 4%; }
          50% { top: 96%; }
        }
        .scan-line {
          position: absolute;
          left: 4%;
          right: 4%;
          height: 2px;
          background: #b91c1c;
          box-shadow: 0 0 10px #b91c1c, 0 0 20px #b91c1c;
          animation: scan 4s ease-in-out infinite;
          z-index: 10;
        }
      `}</style>

      <div className="max-w-4xl w-full mx-auto animate-scale-blur">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-black tracking-tight text-primary">
            THANH TOÁN ĐƠN HÀNG
          </h1>
          <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.25em] mt-3">
            Hoàn tất thanh toán bằng chuyển khoản VietinBank QR
          </p>
        </div>

        {/* Main Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-primary/5 bg-white">
          
          {/* Left: QR Code Side (Dark Theme) */}
          <div className="md:col-span-5 bg-primary text-white p-8 md:p-10 flex flex-col justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="z-10 text-center mb-6">
              <span className="px-3 py-1 rounded-full text-[9px] font-bold tracking-widest bg-white/10 text-white/90 uppercase border border-white/10">
                QUÉT MÃ VIETQR
              </span>
            </div>

            <div className="relative z-10 p-3 bg-white rounded-2xl shadow-2xl aspect-square w-60 md:w-64 flex items-center justify-center border border-white/20">
              <div className="scan-line"></div>
              
              <img
                src={qrCode}
                alt="QR Code"
                className="w-full h-full object-contain rounded-xl select-none"
              />
            </div>

            <div className="z-10 mt-6 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase text-white/80">
                  Chờ thanh toán...
                </span>
              </div>
              <p className="text-[9px] font-bold text-white/40 tracking-wider uppercase text-center mt-1 leading-relaxed max-w-[200px]">
                Hệ thống tự động kiểm tra giao dịch mỗi 5 giây
              </p>
            </div>
          </div>

          {/* Right: Bank Details (Light Theme) */}
          <div className="md:col-span-7 bg-white p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary/40 mb-6 pb-2.5 border-b border-primary/5">
                Thông tin chuyển khoản
              </h2>

              <div className="flex items-center gap-4 p-4 rounded-2xl border border-primary/5 bg-secondary mb-6 shadow-sm">
                <img
                  className="w-12 h-12 object-contain bg-white rounded-xl p-1.5 shadow-sm border border-primary/10"
                  src="https://api.vietqr.io/img/ICB.png"
                  alt="VietinBank Logo"
                />
                <div>
                  <h4 className="text-xs font-black tracking-wider text-primary">VIETINBANK</h4>
                  <p className="text-[9px] font-bold text-primary/45 uppercase tracking-wider">
                    Ngân hàng Công Thương Việt Nam
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                
                <div className="flex justify-between items-center py-2.5 border-b border-primary/5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-primary/40 uppercase tracking-wider">Chủ tài khoản</span>
                    <span className="font-black text-primary text-xs uppercase tracking-wide">
                      PHAM NGOC THANH
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2.5 border-b border-primary/5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-primary/40 uppercase tracking-wider">Số tài khoản</span>
                    <span className="font-black text-primary text-sm tracking-widest select-all">
                      107876577018
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy("107876577018", "accountNumber", "Số tài khoản")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      copiedField === "accountNumber"
                        ? "bg-green-500/10 text-green-600 border border-green-500/20"
                        : "bg-secondary text-primary hover:bg-primary hover:text-white border border-primary/10"
                    }`}
                  >
                    {copiedField === "accountNumber" ? (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Đã chép
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-2 4h5m-3-3v6" />
                        </svg>
                        Sao chép
                      </>
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center py-2.5 border-b border-primary/5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-primary/40 uppercase tracking-wider">Số tiền</span>
                    <span className="font-black text-accent text-sm tracking-wide">
                      {Number(amount).toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(amount, "amount", "Số tiền")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      copiedField === "amount"
                        ? "bg-green-500/10 text-green-600 border border-green-500/20"
                        : "bg-secondary text-primary hover:bg-primary hover:text-white border border-primary/10"
                    }`}
                  >
                    {copiedField === "amount" ? (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Đã chép
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-2 4h5m-3-3v6" />
                        </svg>
                        Sao chép
                      </>
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center py-2.5 border-b border-primary/5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-primary/40 uppercase tracking-wider">Nội dung chuyển khoản</span>
                    <span className="font-black text-primary text-xs bg-accent/5 border border-accent/15 px-2.5 py-1 rounded-md select-all tracking-wider font-display">
                      {invoiceCode}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(invoiceCode, "invoiceCode", "Nội dung chuyển khoản")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      copiedField === "invoiceCode"
                        ? "bg-green-500/10 text-green-600 border border-green-500/20"
                        : "bg-secondary text-primary hover:bg-primary hover:text-white border border-primary/10"
                    }`}
                  >
                    {copiedField === "invoiceCode" ? (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Đã chép
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-2 4h5m-3-3v6" />
                        </svg>
                        Sao chép
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>

            <div className="mt-8 p-4 bg-accent/5 border border-accent/10 rounded-2xl">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-[9px] font-bold text-primary/70 uppercase tracking-widest leading-relaxed">
                  Lưu ý: Quý khách vui lòng điền chính xác <span className="text-accent font-black">Nội dung chuyển khoản</span>. Hệ thống tự động xác nhận hóa đơn của quý khách ngay khi nhận được giao dịch chuyển khoản hợp lệ.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Helper Simulation Button for Local Development */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSimulatePayment}
            className="px-5 py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 border border-yellow-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-sm"
          >
            ⚡ [Development] Mô phỏng thanh toán thành công (Bỏ qua Ngrok)
          </button>
        </div>

      </div>
      <ChatBot />
      <Contact />
    </div>
  );
};

export default QrPayment;


