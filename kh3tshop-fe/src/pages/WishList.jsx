// src/pages/Wishlist.jsx
import React, { useState, useEffect } from "react";
import { ChevronRight, Plus, X, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
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

  get(url) { return this.request(url, { method: "GET" }); },
  post(url, body) { return this.request(url, { method: "POST", body: JSON.stringify(body) }); },
  put(url, body) { return this.request(url, { method: "PUT", body: JSON.stringify(body) }); },
  del(url) { return this.request(url, { method: "DELETE" }); },
};

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

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get("/wishlists");
        setWishlistList(data.result || []);
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
    fetchWishlists();
  }, [navigate]);

  const openCreate = () => {
    setName(""); setDescription(""); setIsCreateOpen(true);
  };

  const openEdit = (item) => {
    setCurrentItem(item);
    setName(item.name);
    setDescription(item.description || "");
    setIsEditOpen(true);
  };

  const openDelete = (item) => {
    setCurrentItem(item);
    setIsDeleteOpen(true);
  };

  const closeAll = () => {
    setIsCreateOpen(false); setIsEditOpen(false); setIsDeleteOpen(false);
    setCurrentItem(null); setName(""); setDescription("");
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      const data = await api.post("/wishlists", { name: name.trim(), description: description.trim() || null });
      setWishlistList(prev => [...prev, data.result]);
      closeAll();
      toast.success(`Success creating "${data.result.name}"`);
    } catch (err) {
      toast.error(err.message || "Failed to create wishlist");
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) return;
    try {
      const data = await api.put(`/wishlists/${currentItem.id}`, {
        name: name.trim(),
        description: description.trim() || null,
      });
      setWishlistList(prev => prev.map(item => item.id === currentItem.id ? data.result : item));
      closeAll();
      toast.success(`Updated "${data.result.name}"`);
    } catch (err) {
      toast.error(err.message || "Failed to update");
    }
  };

  const handleDelete = async () => {
    try {
      await api.del(`/wishlists/${currentItem.id}`);
      setWishlistList(prev => prev.filter(item => item.id !== currentItem.id));
      closeAll();
       toast.success(`Wishlist deleted`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClick = (id) => navigate(`/wishlists/${id}`);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Wishlists</h1>
          <button
            onClick={openCreate}
            className="w-10 h-10 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-all hover:shadow-lg"
            title="Create new wishlist"
          >
            <Plus size={22} />
          </button>
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-black"></div>
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-12 text-red-600 font-medium">{error}</div>
        )}

        {/* Danh sách */}
        {!loading && !error && (
          <div className="space-y-4">
            {wishlistList.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg">You dont have any wishlist</p>
                <p className="text-sm mt-2">Press <strong className="text-black">+</strong> to make a new one !</p>
              </div>
            ) : (
              wishlistList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 group"
                >
                  <button
                    onClick={() => handleClick(item.id)}
                    className="flex items-center gap-4 flex-1 text-left"
                  >
                    <div className="text-3xl">✨</div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                      )}
                      {item.itemCount > 0 && (
                        <span className="text-xs text-gray-400">• {item.itemCount} product</span>
                      )}
                    </div>
                  </button>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                      className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openDelete(item); }}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                    <ChevronRight className="text-gray-400 ml-1" size={20} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* MODAL TẠO / SỬA */}
      {(isCreateOpen || isEditOpen) && (
        <Modal
          title={isCreateOpen ? "Create new wishlist" : "Edit your wishlist"}
          name={name}
          description={description}
          setName={setName}
          setDescription={setDescription}
          onConfirm={isCreateOpen ? handleCreate : handleUpdate}
          onClose={closeAll}
          confirmText={isCreateOpen ? "Add" : "Update"}
          disabled={!name.trim()}
        />
      )}

      {/* MODAL XÓA */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeAll} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-red-600">Delete your wishlist?</h2>
              <button onClick={closeAll} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure to delete <strong className="text-black">"{currentItem?.name}"</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-3">This action cant be undo.</p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeAll}
                className="px-5 py-2.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
       <ChatBot/>
       <Contact/>
    </>
  );
}

// REUSABLE MODAL
function Modal({ title, name, description, setName, setDescription, onConfirm, onClose, confirmText, disabled }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wishlist name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !disabled && onConfirm()}
              placeholder="Ex: Your favorite clothes, special birthday outfit..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Note something about this wishlist..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={disabled}
            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}