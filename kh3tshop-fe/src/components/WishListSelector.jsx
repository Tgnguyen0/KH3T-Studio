import React from "react";
import { X, Plus, Heart, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE = "http://localhost:8080";

const api = {
  get: async (url) => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Lỗi");
    return data;
  },
  post: async (url, body) => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Lỗi");
    return data;
  },
  del: async (url) => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_BASE}${url}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { const data = await res.json(); throw new Error(data.message || "Lỗi"); }
  },
};

const CARD_PALETTES = [
  { accent: "#FF4D1C" },
  { accent: "#2952E3" },
  { accent: "#00A86B" },
  { accent: "#9B30D9" },
  { accent: "#E8A000" },
  { accent: "#0097A7" },
];

export default function WishlistSelectorModal({ productId, isOpen, onClose, onSuccess }) {
  const [wishlists, setWishlists] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [savingIds, setSavingIds] = React.useState(new Set());
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) return;
    const fetchWishlists = async () => {
      try {
        setLoading(true);
        const data = await api.get("/wishlists");
        const list = data.result || [];
        const updated = await Promise.all(
          list.map(async (wl) => {
            try {
              const check = await api.get(`/wishlists/${wl.id}/items`);
              const items = check.result || [];
              return { ...wl, hasProduct: items.some(i => i.productId === productId) };
            } catch { return { ...wl, hasProduct: false }; }
          })
        );
        setWishlists(updated);
      } catch { toast.error("Không thể tải danh sách yêu thích"); }
      finally { setLoading(false); }
    };
    fetchWishlists();
  }, [isOpen, productId]);

  const toggleProductInWishlist = async (wishlistId, currentHasProduct, wishlistName) => {
    if (savingIds.has(wishlistId)) return;
    setSavingIds(prev => new Set(prev).add(wishlistId));
    try {
      if (currentHasProduct) {
        await api.del(`/wishlists/${wishlistId}/items/${productId}`);
        toast.error(`Đã xóa sản phẩm khỏi "${wishlistName}"`);
      } else {
        await api.post(`/wishlists/${wishlistId}/items`, { productId });
        toast.success(`Đã lưu vào "${wishlistName}"`);
      }
      setWishlists(prev => prev.map(wl => wl.id === wishlistId ? { ...wl, hasProduct: !currentHasProduct } : wl));
      onSuccess?.();
    } catch (err) { toast.error(err.message || "Có lỗi xảy ra"); }
    finally {
      setSavingIds(prev => { const next = new Set(prev); next.delete(wishlistId); return next; });
    }
  };

  const handleCreateWishlist = async () => {
    if (!newName.trim()) { toast.error("Tên danh sách không được để trống"); return; }
    try {
      const data = await api.post("/wishlists", { name: newName.trim(), description: newDesc.trim() || null });
      const newWishlist = data.result;
      setWishlists(prev => [...prev, { ...newWishlist, hasProduct: true }]);
      toast.success(`Đã tạo "${newWishlist.name}" và lưu sản phẩm`);
      setNewName(""); setNewDesc(""); setShowCreateForm(false);
      onSuccess?.();
    } catch (err) { toast.error("Không thể tạo danh sách: " + err.message); }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .wsm-overlay {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: flex-end; justify-content: center;
          padding: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          animation: wsm-fade 0.18s ease;
        }
        @media (min-width: 540px) {
          .wsm-overlay { align-items: center; padding: 20px; }
        }
        @keyframes wsm-fade { from { opacity: 0; } to { opacity: 1; } }

        .wsm-sheet {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          background: #fff;
          width: 100%;
          max-width: 480px;
          max-height: 88vh;
          border-radius: 28px 28px 0 0;
          overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 -12px 60px rgba(0,0,0,0.18);
          animation: wsm-slide-up 0.26s cubic-bezier(.22,1,.36,1);
        }
        @media (min-width: 540px) {
          .wsm-sheet {
            border-radius: 24px;
            box-shadow: 0 32px 80px rgba(0,0,0,0.22);
            animation: wsm-pop 0.22s cubic-bezier(.22,1,.36,1);
          }
        }
        @keyframes wsm-slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wsm-pop { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

        /* DRAG HANDLE (mobile) */
        .wsm-handle {
          width: 36px; height: 4px;
          background: #E0DED8;
          border-radius: 2px;
          margin: 14px auto 0;
          flex-shrink: 0;
        }
        @media (min-width: 540px) { .wsm-handle { display: none; } }

        /* HEADER */
        .wsm-head {
          padding: 20px 24px 18px;
          border-bottom: 1px solid #F0EEE9;
          display: flex; align-items: center; gap: 14px;
          flex-shrink: 0;
        }
        .wsm-head-icon {
          width: 42px; height: 42px;
          background: #FFF0EC;
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .wsm-head-text { flex: 1; }
        .wsm-head-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #FF4D1C;
          margin-bottom: 2px;
        }
        .wsm-head-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #0D0D0D;
          line-height: 1.2;
        }
        .wsm-close {
          width: 34px; height: 34px;
          border-radius: 10px;
          border: none; background: #F5F5F3;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; color: #666;
          flex-shrink: 0;
        }
        .wsm-close:hover { background: #E8E6E0; color: #000; }

        /* SCROLL BODY */
        .wsm-body { overflow-y: auto; flex: 1; overscroll-behavior: contain; }

        /* LOADING */
        .wsm-loading {
          display: flex; flex-direction: column; align-items: center;
          padding: 48px 20px; gap: 14px;
          color: #aaa; font-size: 14px;
        }
        .wsm-spinner {
          width: 36px; height: 36px;
          border: 3px solid #F0EEE9;
          border-top-color: #FF4D1C;
          border-radius: 50%;
          animation: wsm-spin 0.7s linear infinite;
        }
        @keyframes wsm-spin { to { transform: rotate(360deg); } }

        /* EMPTY */
        .wsm-empty {
          padding: 48px 24px;
          text-align: center;
          color: #aaa; font-size: 14px;
        }

        /* WISHLIST ITEMS */
        .wsm-list { padding: 8px 0; }
        .wsm-item {
          width: 100%;
          display: flex; align-items: center; gap: 16px;
          padding: 14px 24px;
          background: none; border: none;
          cursor: pointer;
          transition: background 0.14s ease;
          text-align: left;
          position: relative;
        }
        .wsm-item:hover { background: #FAFAF8; }
        .wsm-item:disabled { opacity: 0.6; cursor: wait; }
        .wsm-item-dot {
          width: 40px; height: 40px;
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.18s ease;
        }
        .wsm-item-info { flex: 1; min-width: 0; }
        .wsm-item-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #0D0D0D;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .wsm-item-desc {
          font-size: 12.5px; color: #aaa; margin-top: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .wsm-item-count {
          font-size: 11.5px; color: #bbb; margin-top: 4px; font-weight: 500;
        }
        .wsm-item-status {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.18s ease;
        }
        .wsm-item-status.saved {
          background: #FFF0EC;
        }
        .wsm-item-status.unsaved {
          background: #F5F5F3;
        }
        .wsm-item + .wsm-item::before {
          content: '';
          position: absolute; top: 0; left: 24px; right: 24px;
          height: 1px;
          background: #F5F5F2;
        }

        /* CREATE FORM */
        .wsm-form { padding: 20px 24px; }
        .wsm-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #0D0D0D;
          margin-bottom: 16px;
        }
        .wsm-field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 7px;
        }
        .wsm-input {
          width: 100%; box-sizing: border-box;
          padding: 13px 15px;
          border: 1.5px solid #E8E6E0;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #0D0D0D;
          background: #FAFAF8;
          outline: none;
          transition: all 0.15s;
          resize: none;
        }
        .wsm-input:focus { border-color: #0D0D0D; background: #fff; box-shadow: 0 0 0 3px rgba(13,13,13,0.06); }
        .wsm-form-gap { margin-top: 14px; }
        .wsm-form-actions { display: flex; gap: 10px; margin-top: 18px; }
        .wsm-btn {
          flex: 1; padding: 13px 20px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer; border: none;
          transition: all 0.15s ease;
        }
        .wsm-btn-ghost {
          background: transparent; color: #888;
          border: 1.5px solid #E8E6E0;
        }
        .wsm-btn-ghost:hover { border-color: #bbb; color: #333; }
        .wsm-btn-primary { background: #0D0D0D; color: #fff; }
        .wsm-btn-primary:hover:not(:disabled) { background: #FF4D1C; }
        .wsm-btn-primary:disabled { background: #D0CFC9; cursor: not-allowed; }

        /* FOOTER */
        .wsm-footer {
          padding: 14px 20px 20px;
          border-top: 1px solid #F0EEE9;
          background: #FAFAF8;
          flex-shrink: 0;
        }
        .wsm-create-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          padding: 13px 20px;
          background: #0D0D0D;
          color: #fff;
          border: none; border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .wsm-create-btn:hover { background: #FF4D1C; box-shadow: 0 6px 20px rgba(255,77,28,0.28); }
      `}</style>

      <div className="wsm-overlay" onClick={onClose}>
        <div className="wsm-sheet" onClick={e => e.stopPropagation()}>
          <div className="wsm-handle" />

          {/* HEADER */}
          <div className="wsm-head">
            <div className="wsm-head-icon">
              <Heart size={20} color="#FF4D1C" fill="#FF4D1C" />
            </div>
            <div className="wsm-head-text">
              <div className="wsm-head-label">Yêu thích</div>
              <div className="wsm-head-title">Lưu vào danh sách</div>
            </div>
            <button className="wsm-close" onClick={onClose}><X size={15} /></button>
          </div>

          {/* BODY */}
          <div className="wsm-body">
            {loading ? (
              <div className="wsm-loading">
                <div className="wsm-spinner" />
                Đang tải danh sách...
              </div>
            ) : showCreateForm ? (
              <div className="wsm-form">
                <div className="wsm-form-title">Tạo danh sách mới</div>
                <label className="wsm-field-label">Tên danh sách</label>
                <input
                  className="wsm-input"
                  type="text"
                  placeholder="Ví dụ: Quần áo yêu thích..."
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && newName.trim() && handleCreateWishlist()}
                  autoFocus
                />
                <div className="wsm-form-gap">
                  <label className="wsm-field-label">Mô tả (tuỳ chọn)</label>
                  <textarea
                    className="wsm-input"
                    placeholder="Ghi chú về danh sách này..."
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="wsm-form-actions">
                  <button className="wsm-btn wsm-btn-ghost" onClick={() => { setShowCreateForm(false); setNewName(""); setNewDesc(""); }}>
                    Huỷ
                  </button>
                  <button className="wsm-btn wsm-btn-primary" onClick={handleCreateWishlist} disabled={!newName.trim()}>
                    Tạo & lưu
                  </button>
                </div>
              </div>
            ) : wishlists.length === 0 ? (
              <div className="wsm-empty">Bạn chưa có danh sách yêu thích nào</div>
            ) : (
              <div className="wsm-list">
                {wishlists.map((wl, i) => {
                  const palette = CARD_PALETTES[i % CARD_PALETTES.length];
                  const isSaving = savingIds.has(wl.id);
                  return (
                    <button
                      key={wl.id}
                      className="wsm-item"
                      onClick={() => toggleProductInWishlist(wl.id, wl.hasProduct, wl.name)}
                      disabled={isSaving}
                    >
                      <div
                        className="wsm-item-dot"
                        style={{ background: palette.accent + "18" }}
                      >
                        <Heart size={18} color={palette.accent} fill={wl.hasProduct ? palette.accent : "none"} />
                      </div>
                      <div className="wsm-item-info">
                        <div className="wsm-item-name">{wl.name}</div>
                        {wl.description && <div className="wsm-item-desc">{wl.description}</div>}
                        <div className="wsm-item-count">{wl.itemCount || 0} sản phẩm</div>
                      </div>
                      <div className={`wsm-item-status ${wl.hasProduct ? "saved" : "unsaved"}`}>
                        {isSaving ? (
                          <Loader2 size={15} color="#FF4D1C" style={{ animation: "wsm-spin 0.7s linear infinite" }} />
                        ) : wl.hasProduct ? (
                          <Check size={15} color="#FF4D1C" strokeWidth={2.5} />
                        ) : (
                          <Plus size={15} color="#bbb" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* FOOTER */}
          {!showCreateForm && (
            <div className="wsm-footer">
              <button className="wsm-create-btn" onClick={() => setShowCreateForm(true)}>
                <Plus size={16} />
                Tạo danh sách mới
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}