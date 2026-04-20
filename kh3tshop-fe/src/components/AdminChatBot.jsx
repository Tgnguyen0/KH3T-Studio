// src/components/AdminChatBot.jsx
import { useState, useEffect, useRef } from "react";

const AdminChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // ================== LOCALSTORAGE CHO ADMIN - F5 KHÔNG MẤT CHAT ==================
useEffect(() => {
  const saved = localStorage.getItem("kh3t_admin_chat_history");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
        return;
      }
    } catch (e) {
      console.error("Lỗi parse admin chat history:", e);
      localStorage.removeItem("kh3t_admin_chat_history");
    }
  }

  // Chỉ chào nếu thật sự không có lịch sử
  setMessages([
    {
      sender: "bot",
      text: "Chào sếp! Em là trợ lý CEO của KH3T Shop đây ạ. Sếp cần báo cáo gì hôm nay?"
    }
  ]);
}, []); // Chỉ chạy 1 lần khi mount
useEffect(() => {
  if (messages.length > 0) {
    localStorage.setItem("kh3t_admin_chat_history", JSON.stringify(messages));
  }
}, [messages]);


  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/admin-chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ prompt: userMsg })
      });

      const reply = await res.text();
      setMessages(prev => [...prev, {
        sender: "bot",
        text: reply || "Em đang phân tích dữ liệu giúp sếp..."
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "Lỗi kết nối rồi sếp ơi, em đang thử lại..."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Nút mở chat - góc trái dưới */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-6 bottom-6 z-50 w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 hover:shadow-purple-500/50"
      >
       {open ? (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
) : (
  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
)}
      </button>

      {/* Cửa sổ chat Admin - SIÊU ĐẸP, SIÊU SANG */}
      {open && (
        <div className="fixed right-6 bottom-24 z-50 w-96 h-120 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header - Gradient tím sang trọng */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 overflow-hidden">
  <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
</div>
            <div>
              <h3 className="font-bold text-lg">Trợ Lý CEO</h3>
              <p className="text-xs opacity-90 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Đang phân tích dữ liệu...
              </p>
            </div>
          </div>

          {/* Danh sách tin nhắn */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-5 py-3 rounded-2xl shadow-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Hiệu ứng đang gõ */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-5 py-3 rounded-2xl shadow rounded-tl-none border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Hỏi em về doanh thu, kho, khách hàng..."
                className="flex-1 px-5 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="px-7 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg hover:shadow-purple-500/50"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminChatBot;