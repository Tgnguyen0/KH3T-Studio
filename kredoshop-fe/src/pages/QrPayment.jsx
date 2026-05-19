import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import dauTick from "../assets/dauTick.png";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";
const QrPayment = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const orderId = params.get("orderId");
  const amount = params.get("amount");
  const invoiceId = params.get("invoiceId");
  const invoiceCode = params.get("invoiceCode");
  const interval = useRef(null);

  const qrCode = `https://qr.sepay.vn/img?acc=VQRQAFTEV8402&bank=MBBank&amount=${amount}&des=${invoiceCode}`;

  const handleFetchInvoiceById = async () => {
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
      if (invoice.paymentStatus === "PAID") {
        clearInterval(interval.current);
        await fetch(`http://localhost:8080/orders/status/${orderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ statusOrder: "CONFIRMED" }),
        });

        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      console.log("Invoice not found", error);
    }
  };

  useEffect(() => {
    // handleFetchInvoiceById();
    interval.current = setInterval(() => {
      handleFetchInvoiceById();
    }, 5000);

    return () => clearInterval(interval.current);
  }, []);

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-secondary px-4 selection:bg-accent selection:text-white">
        <div className="bg-white p-12 border border-primary/5 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-[#c87a53]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#c87a53]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="text-xl font-display font-black text-primary uppercase tracking-widest mb-3">
            Thanh toán thành công
          </h3>

          <p className="text-xs font-bold text-primary/40 uppercase tracking-wider leading-relaxed mb-8">
            Giao dịch đã được ghi nhận. Cảm ơn quý khách đã mua sắm tại KREDO Studio!
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full h-12 bg-[#111111] hover:bg-[#c87a53] text-white text-[10px] font-black tracking-[0.2em] uppercase transition-colors shadow-md"
          >
            Trở về Trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary py-16 selection:bg-accent selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-16 pb-8 border-b border-primary/5">
          <h1 className="text-3xl lg:text-4xl font-display font-black uppercase tracking-tight text-primary">Thanh toán chuyển khoản</h1>
          <p className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.25em] mt-3">Quét mã QR để hoàn tất đơn hàng</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          
          {/* QR Code Column */}
          <div className="flex flex-col justify-center items-center bg-white border border-primary/5 p-8 text-center">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 mb-8">
              MÃ QR THANH TOÁN
            </h2>
            <div className="relative p-4 border border-primary/5 bg-secondary aspect-square w-64 mb-6 flex items-center justify-center">
              <img
                src={qrCode}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest leading-relaxed">
              Mở ứng dụng ngân hàng và quét mã để thanh toán tự động
            </p>
          </div>

          {/* Details Column */}
          <div className="bg-white border border-primary/5 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 mb-8 pb-3 border-b border-primary/5">Thông tin tài khoản</h2>
              
              <div className="flex items-center gap-4 p-4 border border-primary/10 bg-secondary mb-6">
                <img
                  className="w-12 h-12 object-contain bg-white p-1"
                  src="https://play-lh.googleusercontent.com/t7F9E1HglpFrmXzXGO7u-hnTSKkFW3ZmXJdmS97WaOnUgrySvAXVgwncj1uE4_3LcA"
                  alt="MBBank Logo"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-black tracking-widest text-primary uppercase">MBBank</span>
                  <span className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Ngân hàng Quân đội</span>
                </div>
              </div>

              <div className="space-y-4 text-xs font-bold text-primary/60 uppercase tracking-widest">
                <div className="flex justify-between pb-2 border-b border-primary/5">
                  <span className="text-primary/40 font-medium">Tên tài khoản:</span>
                  <span className="font-black text-primary">NGUYEN HO VIET KHOA</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-primary/5">
                  <span className="text-primary/40 font-medium">Số tài khoản:</span>
                  <span className="font-black text-primary select-all">0812777990</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-primary/5">
                  <span className="text-primary/40 font-medium">Số tiền:</span>
                  <span className="font-black text-accent text-sm">{amount} VNĐ</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-primary/5">
                  <span className="text-primary/40 font-medium">Nội dung chuyển khoản:</span>
                  <span className="font-black text-primary bg-[#c87a53]/10 px-2 py-0.5 select-all">{invoiceCode}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-primary/5 text-[9px] font-bold text-primary/30 uppercase tracking-widest leading-relaxed">
              * Lưu ý: Vui lòng nhập chính xác nội dung chuyển khoản ở trên để hệ thống tự động xác nhận đơn hàng của quý khách.
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
      <Contact />
    </div>
  );
};

export default QrPayment;
