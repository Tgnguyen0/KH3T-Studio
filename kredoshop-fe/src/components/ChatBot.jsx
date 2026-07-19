// src/components/ChatBot.jsx
import { useState, useEffect, useRef } from "react";
import chatbotAvatar from "../assets/chatbot_avatar.png";
import { Send, Trash2, X, MessageSquare, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";

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
    const saved = localStorage.getItem("kredo_chat_history");
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
      localStorage.setItem("kredo_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem("kredo_chat_history");
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

    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/chat/ask`, {
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

  const handleClearHistory = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat không?")) {
      localStorage.removeItem("kredo_chat_history");
      setMessages([
        { sender: "bot", text: "Xin chào! Mình là trợ lý mua sắm đây. Bạn đang tìm sản phẩm nào hôm nay?" }
      ]);
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
        className="group fixed bottom-6 right-6 z-50 w-16 h-16 bg-accent hover:bg-accent-hover rounded-full shadow-[0_8px_30px_rgba(185,28,28,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white/50 cursor-pointer"
      >
        <div className="absolute inset-0 -z-10 rounded-full bg-accent/60 blur-xl opacity-70 group-hover:opacity-100 transition duration-300"></div>
        
        {/* Pulse ring animation when chat is closed */}
        {!chatOpen && (
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25"></div>
        )}

        <div className={`transition-transform duration-300 ${chatOpen ? 'rotate-90' : 'rotate-0'}`}>
          {chatOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <MessageSquare className="w-7 h-7 text-white" />
          )}
        </div>
      </button>

      {/* Cửa sổ chat */}
      <div 
        className={`fixed right-6 bottom-24 z-50 w-[380px] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-gray-100 transition-all duration-300 origin-bottom-right ${
          chatOpen 
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" 
            : "scale-90 opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-accent text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-full overflow-hidden border-2 border-white shadow-md relative">
              <img
                src={chatbotAvatar}
                alt="Trợ lý"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                Trợ lý mua sắm <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              </h3>
              <p className="text-[10px] opacity-90 flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block animate-pulse border border-white"></span>
                Luôn online • Hỗ trợ 24/7
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleClearHistory}
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/80 hover:text-white"
            title="Xóa lịch sử chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Tin nhắn */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc] scrollbar-thin scrollbar-thumb-gray-200">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "user" ? (
                <div className="max-w-[75%] px-4 py-3 rounded-2xl bg-accent text-white rounded-tr-none shadow-md shadow-accent/10 text-sm leading-relaxed">
                  {msg.text}
                </div>
              ) : (
                <div className="max-w-[85%] flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0 mt-0.5">
                    <img src={chatbotAvatar} alt="bot" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="px-4 py-3 bg-white text-gray-800 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.text}
                    </div>

                    {/* Hiển thị sản phẩm gợi ý nếu có */}
                    {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                      <div className="mt-3 space-y-2.5">
                        {msg.suggestedProducts.map((product) => (
                          <a
                            key={product.id}
                            href={`/product/${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block p-3.5 bg-accent/5 hover:bg-accent/10 rounded-xl border border-accent/20 hover:border-accent/40 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                                  <ShoppingBag className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-semibold text-red-500 text-xs group-hover:text-red-500 transition-colors">
                                    Xem sản phẩm: {product.name}
                                  </p>
                                  <p className="text-[10px] text-gray-500 mt-0.5">Click để xem chi tiết sản phẩm</p>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-red-500/70 group-hover:text-red-500 transition-colors transform group-hover:translate-x-1 duration-300" />
                            </div>
                          </a>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          ))}

          {chatLoading && (
            <div className="max-w-[85%] flex items-start gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0 mt-0.5">
                <img src={chatbotAvatar} alt="bot" className="w-full h-full object-cover" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none">
                <div className="flex space-x-1.5 items-center h-4">
                  <div className="w-2 h-2 bg-red-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-red-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-red-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition"
              disabled={chatLoading}
            />
            <button
              onClick={sendMessage}
              disabled={chatLoading || !input.trim()}
              className="w-11 h-11 bg-accent hover:bg-accent-hover text-white rounded-full flex items-center justify-center shadow-md shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex-shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
