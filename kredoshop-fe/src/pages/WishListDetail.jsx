// src/pages/WishlistDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, X, Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import ProductCard from "../components/ProductCard";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";

const API_BASE = "http://localhost:8080";

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
  del(url) { return this.request(url, { method: "DELETE" }); },
};

export default function WishlistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchWishlistDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get(`/wishlists/${id}/items`);
        const items = data.result || [];
        const productList = items.map(item => ({
          id: item.productId,
          name: item.productName,
          imageUrlFront: item.productImage,
          price: item.productPrice,
          costPrice: item.productCostPrice || item.productPrice,
          discountAmount: item.discountAmount || 0,
          quantity: 1,
          rating: 4.5,
        }));
        setProducts(productList);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Unauthorized")) {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistDetail();
  }, [id, navigate]);

  const openDeleteModal = (productId, productName) => {
    setProductToDelete({ id: productId, name: productName });
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleRemoveItem = async () => {
    if (!productToDelete) return;
    try {
      await api.del(`/wishlists/${id}/items/${productToDelete.id}`);
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      toast.success(`"${productToDelete.name}" đã được xóa khỏi danh sách`);
      closeDeleteModal();
    } catch (err) {
      toast.error("Không thể xóa sản phẩm");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .wld-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 60vh;
          background: #FAFAF8;
        }

        /* HEADER BAND */
        .wld-header {
          background: #0D0D0D;
          padding: 36px 48px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .wld-header::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -80px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,77,28,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .wld-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: #ccc;
          border-radius: 100px;
          padding: 10px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          text-decoration: none;
          white-space: nowrap;
        }
        .wld-back-btn:hover {
          background: rgba(255,255,255,0.14);
          color: #fff;
          border-color: rgba(255,255,255,0.25);
        }
        .wld-header-right { text-align: right; }
        .wld-count-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #FF4D1C;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          margin-bottom: 6px;
        }
        .wld-count-label::after {
          content: '';
          display: inline-block;
          width: 24px; height: 1px;
          background: #FF4D1C;
        }
        .wld-count-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }
        .wld-count-title em {
          font-style: italic;
          color: #FF4D1C;
        }

        /* BODY */
        .wld-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* GRID */
        .wld-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 24px;
        }

        /* CARD WRAPPER */
        .wld-card-wrap {
          position: relative;
        }
        .wld-remove-btn {
          position: absolute;
          top: 12px; right: 12px;
          z-index: 30;
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #fff;
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          opacity: 0;
          transform: scale(0.85);
          transition: all 0.18s cubic-bezier(.22,1,.36,1);
          color: #888;
        }
        .wld-card-wrap:hover .wld-remove-btn {
          opacity: 1;
          transform: scale(1);
        }
        .wld-remove-btn:hover {
          background: #FF4D1C;
          color: #fff;
          transform: scale(1.1) !important;
          box-shadow: 0 6px 20px rgba(255,77,28,0.35);
        }
        .wld-product-link {
          display: block;
          cursor: pointer;
        }
        .wld-product-link [&_button] {
          pointer-events: none;
          opacity: 0;
        }

        /* LOADING */
        .wld-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 80px 20px;
          gap: 16px;
        }
        .wld-spinner {
          width: 44px; height: 44px;
          border: 3px solid #E8E8E4;
          border-top-color: #FF4D1C;
          border-radius: 50%;
          animation: wld-spin 0.7s linear infinite;
        }
        @keyframes wld-spin { to { transform: rotate(360deg); } }

        /* EMPTY STATE */
        .wld-empty {
          text-align: center;
          padding: 80px 24px;
          background: #fff;
          border-radius: 28px;
          border: 1.5px dashed #E8E6E0;
        }
        .wld-empty-icon {
          width: 96px; height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFF0EC 0%, #FFE8E0 100%);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
        }
        .wld-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem;
          font-weight: 700;
          color: #0D0D0D;
          margin-bottom: 10px;
        }
        .wld-empty-sub {
          font-size: 14px;
          color: #999;
          max-width: 300px;
          margin: 0 auto 32px;
          line-height: 1.65;
        }
        .wld-shop-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #0D0D0D;
          color: #fff;
          border: none;
          border-radius: 100px;
          padding: 15px 32px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .wld-shop-btn:hover {
          background: #FF4D1C;
          transform: scale(1.04);
          box-shadow: 0 8px 28px rgba(255,77,28,0.3);
        }

        /* MODAL */
        .wld-overlay {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          animation: wld-fade 0.15s ease;
        }
        @keyframes wld-fade { from { opacity: 0; } to { opacity: 1; } }
        .wld-modal {
          background: #fff;
          border-radius: 24px;
          width: 100%;
          max-width: 440px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.2);
          animation: wld-up 0.22s cubic-bezier(.22,1,.36,1);
        }
        @keyframes wld-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .wld-modal-head {
          padding: 26px 28px 20px;
          border-bottom: 1px solid #F0EEE9;
          display: flex; align-items: center; justify-content: space-between;
        }
        .wld-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #0D0D0D;
        }
        .wld-modal-close {
          width: 34px; height: 34px;
          border-radius: 10px;
          border: none; background: #F5F5F3;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
          color: #666;
        }
        .wld-modal-close:hover { background: #E8E6E0; color: #000; }
        .wld-modal-body {
          padding: 28px 28px 12px;
          text-align: center;
        }
        .wld-modal-icon {
          width: 64px; height: 64px;
          background: #FFF0EC;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
        }
        .wld-modal-text {
          font-size: 15px;
          color: #555;
          line-height: 1.65;
        }
        .wld-modal-text strong { color: #0D0D0D; }
        .wld-modal-note {
          font-size: 12.5px;
          color: #aaa;
          margin-top: 8px;
        }
        .wld-modal-foot {
          padding: 20px 28px 26px;
          display: flex; justify-content: center; gap: 10px;
        }
        .wld-btn {
          padding: 12px 26px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
        }
        .wld-btn-ghost {
          background: transparent;
          color: #888;
          border: 1.5px solid #E8E6E0;
        }
        .wld-btn-ghost:hover { border-color: #bbb; color: #333; }
        .wld-btn-danger { background: #FF4D1C; color: #fff; }
        .wld-btn-danger:hover { background: #e03d0e; box-shadow: 0 6px 20px rgba(255,77,28,0.3); }

        @media (max-width: 640px) {
          .wld-header { padding: 28px 20px; flex-direction: column; align-items: flex-start; }
          .wld-header-right { text-align: left; }
          .wld-count-label { justify-content: flex-start; }
          .wld-count-label::after { display: none; }
          .wld-body { padding: 32px 16px 64px; }
          .wld-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
        }
      `}</style>

      <div className="wld-page">
        {/* HEADER */}
        <div className="wld-header">
          <button className="wld-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Quay lại
          </button>

          <div className="wld-header-right">
            <div className="wld-count-label">
              <Heart size={11} fill="#FF4D1C" color="#FF4D1C" /> Danh sách yêu thích
            </div>
            <div className="wld-count-title">
              <em>{products.length}</em> sản phẩm
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="wld-body">
          {loading && (
            <div className="wld-loading">
              <div className="wld-spinner" />
              <span style={{ color: "#aaa", fontSize: 14 }}>Đang tải sản phẩm...</span>
            </div>
          )}

          {error && !loading && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#FF4D1C", fontWeight: 500 }}>{error}</div>
          )}

          {!loading && !error && (
            <>
              {products.length === 0 ? (
                <div className="wld-empty">
                  <div className="wld-empty-icon">
                    <Heart size={36} color="#FF4D1C" fill="#FF4D1C" />
                  </div>
                  <div className="wld-empty-title">Danh sách đang trống</div>
                  <p className="wld-empty-sub">
                    Hãy khám phá sản phẩm và thêm những món bạn yêu thích vào đây nhé!
                  </p>
                  <button className="wld-shop-btn" onClick={() => navigate("/product")}>
                    <ShoppingBag size={17} />
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                <div className="wld-grid">
                  {products.map((product) => (
                    <div key={product.id} className="wld-card-wrap">
                      <button
                        className="wld-remove-btn"
                        onClick={(e) => { e.stopPropagation(); openDeleteModal(product.id, product.name); }}
                        title="Xóa khỏi yêu thích"
                      >
                        <Trash2 size={15} />
                      </button>
                      <div
                        className="wld-product-link"
                        onClick={() => navigate(`/product/${product.id}`)}
                        style={{ pointerEvents: "auto" }}
                      >
                        <div style={{ pointerEvents: "none" }}>
                          <ProductCard product={product} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL XÁC NHẬN XÓA */}
      {showDeleteModal && (
        <div className="wld-overlay" onClick={closeDeleteModal}>
          <div className="wld-modal" onClick={e => e.stopPropagation()}>
            <div className="wld-modal-head">
              <div className="wld-modal-title">Xoá sản phẩm?</div>
              <button className="wld-modal-close" onClick={closeDeleteModal}><X size={15} /></button>
            </div>
            <div className="wld-modal-body">
              <div className="wld-modal-icon">
                <Trash2 size={26} color="#FF4D1C" />
              </div>
              <p className="wld-modal-text">
                Bạn muốn xóa <strong>"{productToDelete?.name}"</strong> khỏi danh sách yêu thích?
              </p>
              <p className="wld-modal-note">Bạn có thể thêm lại bất cứ lúc nào.</p>
            </div>
            <div className="wld-modal-foot">
              <button className="wld-btn wld-btn-ghost" onClick={closeDeleteModal}>Giữ lại</button>
              <button className="wld-btn wld-btn-danger" onClick={handleRemoveItem}>Xoá khỏi danh sách</button>
            </div>
          </div>
        </div>
      )}

      <ChatBot />
      <Contact />
    </>
  );
}
