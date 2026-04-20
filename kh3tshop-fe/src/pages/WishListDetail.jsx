// src/pages/WishlistDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner"; // THÊM DÒNG NÀY
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

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  },

  get(url) {
    return this.request(url, { method: "GET" });
  },

  del(url) {
    return this.request(url, { method: "DELETE" });
  },
};

export default function WishlistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
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
      toast.success(`"${productToDelete.name}" removed from wishlist`);
      closeDeleteModal();
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition font-medium"
        >
          <ArrowLeft size={22} />
          Back
        </button>

        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-900">
            {products.length} {products.length === 1 ? "product" : "products"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">In your wishlist</p>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
        </div>
      )}

      {/* ERROR */}
      {error && !loading && (
        <div className="text-center py-20 text-red-600 font-medium">{error}</div>
      )}

      {/* DANH SÁCH SẢN PHẨM */}
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 rounded-3xl">
              <div className="text-7xl mb-6">Empty</div>
              <p className="text-xl text-gray-600 font-medium">Your wishlist is empty</p>
              <button
                onClick={() => navigate("/product")} // hoặc /product
                className="mt-8 px-8 py-3.5 bg-black hover:bg-gray-900 text-white font-medium rounded-full transition inline-flex items-center shadow-lg"
              >
                <Plus size={22} className="mr-2" />
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="relative group">
                  {/* NÚT XÓA - hiện khi hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(product.id, product.name);
                    }}
                    className="absolute top-3 right-3 z-30 bg-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600 hover:scale-110"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* PRODUCT CARD - tắt nút tim & giỏ hàng */}
                  <div
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="cursor-pointer [&_button]:pointer-events-none [&_button]:opacity-0"
                  >
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* MODAL XÁC NHẬN XÓA */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeDeleteModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-red-600">Remove from wishlist?</h2>
              <button onClick={closeDeleteModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                Remove <strong className="text-black">"{productToDelete?.name}"</strong> from this wishlist?
              </p>
              <p className="text-sm text-gray-500 mt-3">You can add it back anytime.</p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeDeleteModal}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveItem}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      <ChatBot/>
      <Contact/>
    </div>
  );
}