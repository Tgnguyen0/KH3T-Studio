// src/components/AdminChatBot
import { useState, useEffect, useRef } from "react";

const AdminChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  useEffect(() => {
    const saved = localStorage.getItem("kredo_admin_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {
        localStorage.removeItem("kredo_admin_chat_history");
      }
    }
    setMessages([{
      sender: "bot",
      text: "Chào sếp! Em là trợ lý CEO của KREDO Studio đây ạ. Sếp cần báo cáo gì hôm nay?",
    }]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("kredo_admin_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

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
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ prompt: userMsg }),
      });
      const reply = await res.text();
      setMessages(prev => [...prev, {
        sender: "bot",
        text: reply || "Em đang phân tích dữ liệu giúp sếp...",
      }]);
    } catch {
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "Lỗi kết nối rồi sếp ơi, em đang thử lại...",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearHistory = () => {
    localStorage.removeItem("kredo_admin_chat_history");
    setMessages([{
      sender: "bot",
      text: "Đã xoá lịch sử. Sếp cần em báo cáo gì ạ?",
    }]);
  };

  return (
    <>
      {/* ── FAB ── */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-6 bottom-6 z-50 w-14 h-14 bg-[#111111] hover:bg-red-500 text-white flex items-center justify-center transition-all duration-200 shadow-xl hover:shadow-red-500/30 group"
        title="Trợ lý CEO"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
        )}
        {/* Unread dot */}
        {!open && messages.length > 1 && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {/* ── Chat window ── */}
      {open && (
        <div className="fixed right-6 bottom-24 z-50 w-[360px] flex flex-col bg-white border border-primary/10 shadow-2xl"
          style={{ height: "520px" }}>

          {/* Header */}
          <div className="bg-[#111111] px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <div>
                <p className="text-red-500 text-[8px] font-black tracking-[0.3em] uppercase">KREDO STUDIO</p>
                <h3 className="text-white font-display font-black text-xs uppercase tracking-widest leading-none mt-0.5">
                  Trợ lý CEO
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-white/30 text-[8px] font-bold uppercase tracking-widest">Online</span>
              </div>
              <button
                onClick={clearHistory}
                className="ml-2 text-white/20 hover:text-white/60 transition-colors p-1"
                title="Xoá lịch sử"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-secondary/30">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>

                {/* Bot avatar */}
                {msg.sender === "bot" && (
                  <div className="w-6 h-6 bg-[#111111] flex items-center justify-center flex-shrink-0 mb-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                  </div>
                )}

                <div className={`max-w-[78%] px-4 py-3 text-xs font-bold leading-relaxed
                  ${msg.sender === "user"
                    ? "bg-[#111111] text-white"
                    : "bg-white border border-primary/8 text-primary/80"
                  }`}>
                  {msg.text}
                </div>

                {/* User avatar */}
                {msg.sender === "user" && (
                  <div className="w-6 h-6 bg-red-500 flex items-center justify-center flex-shrink-0 mb-0.5">
                    <span className="text-white text-[8px] font-black">CEO</span>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-6 h-6 bg-[#111111] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                </div>
                <div className="bg-white border border-primary/8 px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-primary/8 bg-white flex-shrink-0">
            <div className="flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Hỏi về doanh thu, kho, khách hàng..."
                disabled={loading}
                className="flex-1 px-5 py-4 text-xs font-bold text-primary placeholder-primary/20 focus:outline-none bg-transparent uppercase tracking-wider disabled:opacity-50"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="px-5 py-4 bg-[#111111] hover:bg-red-500 text-white text-[9px] font-black tracking-widest uppercase transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 h-full"
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