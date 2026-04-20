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
      <div className="flex items-center justify-center min-h-[70vh] bg-gray-50 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
          <img
            className="size-28 mx-auto mb-6 drop-shadow-lg"
            src={dauTick}
            alt="Success"
          />

          <h3 className="text-3xl font-extrabold text-gray-900 mb-3">
            Payment Successful
          </h3>

          <p className="text-gray-600 mb-8 text-sm">
            Your transaction has been completed. Thank you for shopping with us!
          </p>

          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-black text-white rounded-full font-semibold
                 hover:bg-red-500 transition-all duration-300 transform
                 hover:scale-105 shadow-lg"
          >
            Comeback to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid lg:grid-cols-2 gap-10">
      <div className="flex flex-col justify-center items-center bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Scan QR Code to Pay
        </h2>
        <img
          src={qrCode}
          alt="QR Code"
          className="w-64 h-64 object-contain mb-4"
        />
        <p className="text-gray-500 text-center">
          Use your banking app to scan the QR code and complete payment.
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Payment Details</h2>
        <div className="flex items-center gap-4 border p-4 rounded-xl bg-blue-50 border-blue-200">
          <img
            className="w-16 h-16 object-contain"
            src="https://play-lh.googleusercontent.com/t7F9E1HglpFrmXzXGO7u-hnTSKkFW3ZmXJdmS97WaOnUgrySvAXVgwncj1uE4_3LcA"
            alt="MBBank Logo"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">MBBank</span>
            <span className="text-gray-500 text-sm">Bank Transfer</span>
          </div>
        </div>
        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between border-b pb-2 border-gray-200">
            <span>Account Name:</span>
            <span className="font-medium">NGUYEN HO VIET KHOA</span>
          </div>
          <div className="flex justify-between border-b pb-2 border-gray-200">
            <span>Account Number:</span>
            <span className="font-medium">0812777990</span>
          </div>
          <div className="flex justify-between border-b pb-2 border-gray-200">
            <span>Amount:</span>
            <span className="font-semibold text-blue-600">{amount} VNĐ</span>
          </div>
          <div className="flex justify-between border-b pb-2 border-gray-200">
            <span>Transfer Content:</span>
            <span className="font-semibold">{invoiceCode}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-2">
          Please complete the payment using the above details to ensure your
          order is processed.
        </p>
      </div>
      <ChatBot />
      <Contact />
    </div>
  );
};

export default QrPayment;
