// src/components/Contact.jsx
import React, { useState, useEffect } from "react";

const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false); // THÊM STATE NÀY

  // Nghe sự kiện từ ChatBot
  useEffect(() => {
    const handleChatBotOpened = () => setIsChatBotOpen(true);
    const handleChatBotClosed = () => setIsChatBotOpen(false);

    window.addEventListener("chatbotOpened", handleChatBotOpened);
    window.addEventListener("chatbotClosed", handleChatBotClosed);

    return () => {
      window.removeEventListener("chatbotOpened", handleChatBotOpened);
      window.removeEventListener("chatbotClosed", handleChatBotClosed);
    };
  }, []);

  // Nếu chatbot đang mở → ẩn hoàn toàn nút Contact
  if (isChatBotOpen) return null;

  return (
    <div className="fixed right-6 bottom-28 z-40"> {/* z-40 < z-50 của chatbot */}
      {/* NÚT CHÍNH */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 ring-4 ring-white/50"
      >
        <div className="absolute -inset-1 bg-red-600/60 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition"></div>

        {/* ICON DẤU HỎI (?) */}
        <svg className="w-10 h-10 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
      </button>

      {/* DROPDOWN */}
      <div className={`absolute bottom-20 right-0 flex flex-col gap-3 transition-all duration-300 origin-bottom-right ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
        {/* Messenger */}
        <a href="https://www.facebook.com/profile.php?id=61584287818988" target="_blank" rel="noopener noreferrer"
          className="group/item relative" onClick={() => setIsOpen(false)}>
          <div className="w-14 h-14 rounded-full shadow-xl hover:scale-110 transition-all overflow-hidden ring-4 ring-white/60 bg-white">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/1024px-Facebook_Messenger_logo_2020.svg.png" alt="Messenger" className="w-full h-full object-cover" />
          </div>
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover/item:opacity-100 transition pointer-events-none whitespace-nowrap shadow-lg">
            Chat Messenger
          </span>
        </a>

        {/* Zalo */}
        <a href="https://zalo.me/0337300592" target="_blank" rel="noopener noreferrer"
          className="group/item relative" onClick={() => setIsOpen(false)}>
          <div className="w-14 h-14 rounded-full shadow-xl hover:scale-110 transition-all overflow-hidden ring-4 ring-white/60 bg-white">
            <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Zalo-Arc.png" alt="Zalo" className="w-full h-full object-cover" />
          </div>
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover/item:opacity-100 transition pointer-events-none whitespace-nowrap shadow-lg">
            Chat Zalo
          </span>
        </a>
      </div>
    </div>
  );
};

export default Contact;