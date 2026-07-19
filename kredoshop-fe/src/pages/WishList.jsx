// src/pages/Wishlist.jsx
import React, { useState, useEffect } from "react";
import { Plus, X, Edit2, Trash2, Heart, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = {
  async request(url, options = {}) {
    const token = localStorage.getItem("accessToken");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  },
  get(url) { return this.request(url, { method: "GET" }); },
  post(url, body) { return this.request(url, { method: "POST", body: JSON.stringify(body) }); },
  put(url, body) { return this.request(url, { method: "PUT", body: JSON.stringify(body) }); },
  del(url) { return this.request(url, { method: "DELETE" }); },
};

const CARD_PALETTES = [
  { bg: "#FFF5F0", accent: "#FF4D1C", text: "#1a0a05" },
  { bg: "#F0F4FF", accent: "#2952E3", text: "#05091a" },
  { bg: "#F0FFF8", accent: "#00A86B", text: "#001a0d" },
  { bg: "#FDF0FF", accent: "#9B30D9", text: "#120520" },
  { bg: "#FFFBF0", accent: "#E8A000", text: "#1a1205" },
  { bg: "#F0FFFE", accent: "#0097A7", text: "#001a1a" },
];

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistList, setWishlistList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get("/wishlists");
        setWishlistList(data.result || []);
      } catch (err) {
        setError("Không thể tải danh sách yêu thích");
        if (err.message.includes("Unauthorized")) {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWishlists();
  }, [navigate]);

  const openCreate = () => { setName(""); setDescription(""); setIsCreateOpen(true); };
  const openEdit = (item) => { setCurrentItem(item); setName(item.name); setDescription(item.description || ""); setIsEditOpen(true); };
  const openDelete = (item) => { setCurrentItem(item); setIsDeleteOpen(true); };
  const closeAll = () => { setIsCreateOpen(false); setIsEditOpen(false); setIsDeleteOpen(false); setCurrentItem(null); setName(""); setDescription(""); };

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      const data = await api.post("/wishlists", { name: name.trim(), description: description.trim() || null });
      setWishlistList(prev => [...prev, data.result]);
      closeAll();
      toast.success(`Đã tạo danh sách "${data.result.name}"`);
    } catch (err) { toast.error(err.message || "Không thể tạo danh sách"); }
  };

  const handleUpdate = async () => {
    if (!name.trim()) return;
    try {
      const data = await api.put(`/wishlists/${currentItem.id}`, { name: name.trim(), description: description.trim() || null });
      setWishlistList(prev => prev.map(item => item.id === currentItem.id ? data.result : item));
      closeAll();
      toast.success(`Đã cập nhật "${data.result.name}"`);
    } catch (err) { toast.error(err.message || "Cập nhật thất bại"); }
  };

  const handleDelete = async () => {
    try {
      await api.del(`/wishlists/${currentItem.id}`);
      setWishlistList(prev => prev.filter(item => item.id !== currentItem.id));
      closeAll();
      toast.success("Đã xóa danh sách yêu thích");
    } catch (err) { toast.error(err.message); }
  };

  const handleClick = (id) => navigate(`/wishlists/${id}`);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .wl-page { font-family: 'DM Sans', sans-serif; min-height: 60vh; background: #FAFAF8; }

        .wl-header-section {
          background: #0D0D0D;
          padding: 56px 48px 48px;
          position: relative;
          overflow: hidden;
        }
        .wl-header-section::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,77,28,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .wl-header-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FF4D1C;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .wl-header-label::before {
          content: '';
          display: inline-block;
          width: 24px; height: 1px;
          background: #FF4D1C;
        }
        .wl-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 900;
          color: #FFFFFF;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .wl-title em {
          font-style: italic;
          color: #FF4D1C;
        }
        .wl-subtitle {
          font-size: 14px;
          color: #888;
          margin-top: 12px;
          font-weight: 300;
        }
        .wl-add-btn {
          position: absolute;
          top: 50%; right: 48px;
          transform: translateY(-50%);
          display: flex; align-items: center; gap: 10px;
          background: #FF4D1C;
          color: #fff;
          border: none;
          border-radius: 100px;
          padding: 14px 26px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }
        .wl-add-btn:hover {
          background: #e03d0e;
          transform: translateY(-50%) scale(1.04);
          box-shadow: 0 8px 28px rgba(255,77,28,0.35);
        }

        .wl-body { max-width: 900px; margin: 0 auto; padding: 48px 24px 64px; }

        .wl-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }

        .wl-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.22s cubic-bezier(.22,1,.36,1), box-shadow 0.22s ease;
          border: 1.5px solid transparent;
        }
        .wl-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }
        .wl-card-inner {
          display: flex;
          align-items: center;
          padding: 28px 32px;
          gap: 24px;
        }
        .wl-card-icon {
          width: 56px; height: 56px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(8px);
        }
        .wl-card-info { flex: 1; min-width: 0; }
        .wl-card-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: inherit;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .wl-card-desc {
          font-size: 13px;
          margin-top: 4px;
          opacity: 0.6;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .wl-card-count {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 10px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 100px;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(4px);
        }
        .wl-card-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0;
          transition: opacity 0.18s ease;
        }
        .wl-card:hover .wl-card-actions { opacity: 1; }
        .wl-action-btn {
          width: 36px; height: 36px;
          border-radius: 10px;
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(4px);
          transition: all 0.15s ease;
          color: #555;
        }
        .wl-action-btn:hover { background: rgba(255,255,255,0.95); color: #000; transform: scale(1.1); }
        .wl-action-btn.danger:hover { background: #FF4D1C; color: #fff; }
        .wl-arrow {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: rgba(0,0,0,0.08);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.18s ease;
          margin-left: 8px;
          flex-shrink: 0;
        }
        .wl-card:hover .wl-arrow {
          background: rgba(0,0,0,0.15);
          transform: translateX(3px);
        }

        /* EMPTY STATE */
        .wl-empty {
          text-align: center;
          padding: 80px 20px;
        }
        .wl-empty-icon {
          width: 88px; height: 88px;
          border-radius: 50%;
          background: #F0EEE9;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          font-size: 36px;
        }
        .wl-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 10px;
        }
        .wl-empty-sub {
          font-size: 14px;
          color: #888;
          max-width: 280px;
          margin: 0 auto 28px;
          line-height: 1.6;
        }
        .wl-empty-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: #0D0D0D;
          color: #fff;
          border: none;
          border-radius: 100px;
          padding: 14px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .wl-empty-cta:hover { background: #FF4D1C; transform: scale(1.04); }

        /* LOADING */
        .wl-loading {
          display: flex; flex-direction: column; align-items: center;
          padding: 80px 20px; gap: 16px;
        }
        .wl-spinner {
          width: 44px; height: 44px;
          border: 3px solid #E8E8E4;
          border-top-color: #FF4D1C;
          border-radius: 50%;
          animation: wl-spin 0.7s linear infinite;
        }
        @keyframes wl-spin { to { transform: rotate(360deg); } }

        /* MODAL */
        .wl-overlay {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          animation: wl-fade-in 0.15s ease;
        }
        @keyframes wl-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .wl-modal {
          background: #fff;
          border-radius: 24px;
          width: 100%;
          max-width: 460px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.2);
          animation: wl-slide-up 0.22s cubic-bezier(.22,1,.36,1);
        }
        @keyframes wl-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .wl-modal-head {
          padding: 28px 28px 20px;
          border-bottom: 1px solid #F0EEE9;
          display: flex; align-items: center; justify-content: space-between;
        }
        .wl-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #0D0D0D;
        }
        .wl-modal-close {
          width: 36px; height: 36px;
          border-radius: 10px;
          border: none; background: #F5F5F3;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
          color: #666;
        }
        .wl-modal-close:hover { background: #E8E6E0; color: #000; }
        .wl-modal-body { padding: 24px 28px; }
        .wl-field-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 8px;
        }
        .wl-input {
          width: 100%; box-sizing: border-box;
          padding: 14px 16px;
          border: 1.5px solid #E8E6E0;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #0D0D0D;
          background: #FAFAF8;
          transition: all 0.15s;
          outline: none;
          resize: none;
        }
        .wl-input:focus { border-color: #0D0D0D; background: #fff; box-shadow: 0 0 0 3px rgba(13,13,13,0.06); }
        .wl-modal-foot {
          padding: 20px 28px 24px;
          border-top: 1px solid #F0EEE9;
          display: flex; justify-content: flex-end; gap: 10px;
        }
        .wl-btn {
          padding: 12px 24px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
        }
        .wl-btn-ghost {
          background: transparent;
          color: #888;
          border: 1.5px solid #E8E6E0;
        }
        .wl-btn-ghost:hover { border-color: #aaa; color: #333; }
        .wl-btn-primary {
          background: #0D0D0D;
          color: #fff;
        }
        .wl-btn-primary:hover:not(:disabled) { background: #FF4D1C; }
        .wl-btn-primary:disabled { background: #D0CFC9; cursor: not-allowed; }
        .wl-btn-danger { background: #FF4D1C; color: #fff; }
        .wl-btn-danger:hover { background: #e03d0e; }

        .wl-delete-icon {
          width: 64px; height: 64px;
          background: #FFF0EC;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
        }
        .wl-field-gap { margin-top: 20px; }
      `}</style>

      <div className="wl-page">
        {/* HEADER */}
        <div className="wl-header-section">
          <div className="wl-header-label">
            <Heart size={11} /> Bộ sưu tập của bạn
          </div>
          <h1 className="wl-title">
            Danh sách <em>yêu thích</em>
          </h1>
          <p className="wl-subtitle">Lưu lại những sản phẩm bạn yêu thích để mua sau</p>
          <button className="wl-add-btn" onClick={openCreate}>
            <Plus size={16} />
            Tạo danh sách mới
          </button>
        </div>

        {/* BODY */}
        <div className="wl-body">
          {loading && (
            <div className="wl-loading">
              <div className="wl-spinner" />
              <span style={{ color: "#aaa", fontSize: 14 }}>Đang tải...</span>
            </div>
          )}
          {error && !loading && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#FF4D1C", fontWeight: 500 }}>{error}</div>
          )}
          {!loading && !error && (
            <div className="wl-grid">
              {wishlistList.length === 0 ? (
                <div className="wl-empty">
                  <div className="wl-empty-icon">💝</div>
                  <div className="wl-empty-title">Chưa có danh sách nào</div>
                  <p className="wl-empty-sub">Tạo danh sách yêu thích đầu tiên của bạn và bắt đầu lưu sản phẩm yêu thích!</p>
                  <button className="wl-empty-cta" onClick={openCreate}>
                    <Sparkles size={15} />
                    Tạo danh sách đầu tiên
                  </button>
                </div>
              ) : (
                wishlistList.map((item, i) => {
                  const palette = CARD_PALETTES[i % CARD_PALETTES.length];
                  return (
                    <div
                      key={item.id}
                      className="wl-card"
                      style={{
                        background: palette.bg,
                        borderColor: hoveredId === item.id ? palette.accent + "40" : "transparent",
                        color: palette.text,
                      }}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleClick(item.id)}
                    >
                      <div className="wl-card-inner">
                        <div className="wl-card-icon" style={{ background: palette.accent + "18" }}>
                          <Heart size={22} fill={palette.accent} color={palette.accent} />
                        </div>
                        <div className="wl-card-info">
                          <div className="wl-card-name" style={{ color: palette.text }}>{item.name}</div>
                          {item.description && (
                            <div className="wl-card-desc">{item.description}</div>
                          )}
                          {item.itemCount >= 0 && (
                            <span className="wl-card-count" style={{ color: palette.accent }}>
                              <span style={{ color: palette.accent }}>●</span>
                              {item.itemCount} sản phẩm
                            </span>
                          )}
                        </div>

                        <div className="wl-card-actions" onClick={e => e.stopPropagation()}>
                          <button className="wl-action-btn" onClick={() => openEdit(item)} title="Chỉnh sửa">
                            <Edit2 size={15} />
                          </button>
                          <button className="wl-action-btn danger" onClick={() => openDelete(item)} title="Xóa">
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="wl-arrow" style={{ background: palette.accent + "18" }}>
                          <ArrowRight size={16} color={palette.accent} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL TẠO / SỬA */}
      {(isCreateOpen || isEditOpen) && (
        <div className="wl-overlay" onClick={closeAll}>
          <div className="wl-modal" onClick={e => e.stopPropagation()}>
            <div className="wl-modal-head">
              <div className="wl-modal-title">
                {isCreateOpen ? "Tạo danh sách mới" : "Chỉnh sửa danh sách"}
              </div>
              <button className="wl-modal-close" onClick={closeAll}><X size={16} /></button>
            </div>
            <div className="wl-modal-body">
              <label className="wl-field-label">Tên danh sách</label>
              <input
                className="wl-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && name.trim() && (isCreateOpen ? handleCreate() : handleUpdate())}
                placeholder="Ví dụ: Quần áo yêu thích..."
                autoFocus
              />
              <div className="wl-field-gap">
                <label className="wl-field-label">Mô tả (tuỳ chọn)</label>
                <textarea
                  className="wl-input"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ghi chú về danh sách này..."
                  rows={3}
                />
              </div>
            </div>
            <div className="wl-modal-foot">
              <button className="wl-btn wl-btn-ghost" onClick={closeAll}>Huỷ</button>
              <button
                className="wl-btn wl-btn-primary"
                onClick={isCreateOpen ? handleCreate : handleUpdate}
                disabled={!name.trim()}
              >
                {isCreateOpen ? "Tạo danh sách" : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÓA */}
      {isDeleteOpen && (
        <div className="wl-overlay" onClick={closeAll}>
          <div className="wl-modal" onClick={e => e.stopPropagation()}>
            <div className="wl-modal-head">
              <div className="wl-modal-title">Xoá danh sách?</div>
              <button className="wl-modal-close" onClick={closeAll}><X size={16} /></button>
            </div>
            <div className="wl-modal-body" style={{ textAlign: "center", paddingTop: 32, paddingBottom: 8 }}>
              <div className="wl-delete-icon">
                <Trash2 size={26} color="#FF4D1C" />
              </div>
              <p style={{ fontSize: 15, color: "#444", lineHeight: 1.6 }}>
                Bạn sắp xoá <strong style={{ color: "#0D0D0D" }}>"{currentItem?.name}"</strong>.<br />
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="wl-modal-foot">
              <button className="wl-btn wl-btn-ghost" onClick={closeAll}>Giữ lại</button>
              <button className="wl-btn wl-btn-danger" onClick={handleDelete}>Xoá vĩnh viễn</button>
            </div>
          </div>
        </div>
      )}

      <ChatBot />
      <Contact />
    </>
  );
}
