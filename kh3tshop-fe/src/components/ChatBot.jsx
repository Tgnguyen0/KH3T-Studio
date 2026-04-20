// src/components/ChatBot.jsx
import { useState, useEffect, useRef } from "react";

const ChatBot = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào! Mình là trợ lý mua sắm đây. Bạn đang tìm sản phẩm nào hôm nay?" }
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ================== LOCALSTORAGE - F5 KHÔNG MẤT CHAT ==================
  useEffect(() => {
    const saved = localStorage.getItem("kh3t_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 1 || (parsed.length === 1 && parsed[0].sender === "user")) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Lỗi parse chat history:", e);
      }
    }
  }, []);

  useEffect(() => {
    const hasRealMessage = messages.length > 1 || 
      (messages.length === 1 && messages[0].sender === "user");
    if (hasRealMessage) {
      localStorage.setItem("kh3t_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem("kh3t_chat_history");
      setMessages([
        { sender: "bot", text: "Xin chào! Mình là trợ lý mua sắm đây. Bạn đang tìm sản phẩm nào hôm nay?" }
      ]);
    };
    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);
  // ====================================================================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatLoading]);

  // ================== CHỖ SỬA 1: NHẬN JSON TỪ BACKEND ==================
  const sendMessage = async () => {
  if (!input.trim() || chatLoading) return;

  const userMessage = input.trim();
  setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
  setInput("");
  setChatLoading(true);

  try {
    const token = localStorage.getItem("accessToken");

    const res = await fetch("http://localhost:8080/chat/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ prompt: userMessage }),
    });

    // Nếu backend trả lỗi HTTP thì throw luôn
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    setMessages(prev => [...prev, {
      sender: "bot",
      text: data.message || "Dạ em chưa hiểu lắm ạ!",
      suggestedProducts: data.suggestedProducts || [],
      compareIds: data.compareIds || null,
    }]);
  } 
  catch (err) {
    console.error("Chat error:", err);
    setMessages(prev => [...prev, {
      sender: "bot",
      text: "Oops! Có lỗi kết nối rồi, thử lại sau ít phút nhé!"
    }]);
  } 
  finally {
    setChatLoading(false);
  }
};


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Nút nổi góc dưới phải */}
      <button
        onClick={() => {
          setChatOpen(!chatOpen);
          window.dispatchEvent(new Event(chatOpen ? "chatbotClosed" : "chatbotOpened"));
        }}
        className="group fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 ring-4 ring-white/50"
      >
        <div className="absolute inset-0 -z-10 rounded-full bg-red-600/60 blur-xl opacity-70 group-hover:opacity-100 transition duration-300"></div>

        {chatOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2v3l-3-3H9a2 2 0 0 1-2-2v-1" />
            <path d="M3 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-3 3v-3H5a2 2 0 0 1-2-2V6z" />
            <circle cx="9" cy="9" r="1" />
            <circle cx="13" cy="9" r="1" />
          </svg>
        )}
      </button>

      {/* Cửa sổ chat */}
      {chatOpen && (
        <div className="fixed right-6 bottom-24 z-50 w-96 h-120 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full overflow-hidden border-2 border-white shadow-lg">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPJteM29wDFaITjbx1jOkFsIPRa6JKw-508w&s"
                  alt="Trợ lý"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold">Trợ lý mua sắm</h3>
                <p className="text-xs opacity-90">Luôn online • Hỗ trợ 24/7</p>
              </div>
            </div>
          </div>

          {/* Tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* ================== CHỖ SỬA 2: RENDER TIN NHẮN BOT CÓ LINK SẢN PHẨM ================== */}
                {msg.sender === "user" ? (
                  <div className="max-w-xs px-4 py-3 rounded-2xl bg-red-500 text-white rounded-tr-none">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-lg">
                    <div className="px-4 py-3 bg-white rounded-2xl shadow rounded-tl-none whitespace-pre-wrap">
                      {msg.text}
                    </div>

                    {/* Hiển thị sản phẩm gợi ý nếu có */}
                    {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.suggestedProducts.map((product) => (
                          <a
                            key={product.id}
                            href={`/product/${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 hover:border-red-400 hover:shadow-lg transition-all transform hover:scale-105"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-red-700">Xem ngay: {product.name}</p>
                                <p className="text-xs text-gray-600 mt-1">Click để xem chi tiết sản phẩm</p>
                              </div>
                              <span className="text-2xl ml-3">→</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                    {msg.compareIds && msg.compareIds.length >= 2 && (
<div className="mt-3 space-y-2">
<a
href={`/compare?ids=${msg.compareIds.join(',')}`}
target="_blank"
rel="noopener noreferrer"
className="block p-4 bg-red-50 rounded-xl border border-red-200 hover:border-red-400 hover:shadow-lg transition-all transform hover:scale-105"
>
<div className="flex items-center justify-between">
<div>
<p className="font-semibold text-red-700">So sánh {msg.compareIds.length} sản phẩm</p>
<p className="text-xs text-gray-600 mt-1">Bảng so sánh sẽ hiển thị chi tiết form, chất liệu, giá, size...</p>
</div>
<span className="text-2xl ml-3">→</span>
</div>
</a>
</div>
)}

                  </div>
                )}
              </div>
            ))}

            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl shadow rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-red-500"
                disabled={chatLoading}
              />
              <button
                onClick={sendMessage}
                disabled={chatLoading || !input.trim()}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
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

export default ChatBot;