import React from "react";
import { X, Plus, Heart } from "lucide-react";
import { toast } from "sonner";

const API_BASE = "http://localhost:8080";

const api = {
  get: async (url) => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Lỗi");
    return data;
  },
  post: async (url, body) => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
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
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Lỗi");
    }
  },
};

export default function WishlistSelectorModal({ productId, isOpen, onClose, onSuccess }) {
  const [wishlists, setWishlists] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [savingIds, setSavingIds] = React.useState(new Set());

  // Form tạo wishlist mới
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
            } catch {
              return { ...wl, hasProduct: false };
            }
          })
        );
        setWishlists(updated);
      } catch (err) {
        toast.error("Cant load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, [isOpen, productId]);

  const toggleProductInWishlist = async (wishlistId, currentHasProduct, wishlistName) => {
    if (savingIds.has(wishlistId)) return;

    setSavingIds(prev => new Set(prev).add(wishlistId));

    try {
      if (currentHasProduct) {
        await api.del(`/wishlists/${wishlistId}/items/${productId}`);
        toast.error(`Removed product from "${wishlistName}"`);
      } else {
        await api.post(`/wishlists/${wishlistId}/items`, { productId });
        toast.success(`Saved to "${wishlistName}"`);
      }

      setWishlists(prev =>
        prev.map(wl =>
          wl.id === wishlistId ? { ...wl, hasProduct: !currentHasProduct } : wl
        )
      );

      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra");
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete(wishlistId);
        return next;
      });
    }
  };

  const handleCreateWishlist = async () => {
    if (!newName.trim()) {
      toast.error("Wishlist name cant be empty");
      return;
    }

    try {
      const data = await api.post("/wishlists", {
        name: newName.trim(),
        description: newDesc.trim() || null,
      });

      const newWishlist = data.result;
      setWishlists(prev => [...prev, { ...newWishlist, hasProduct: true }]);
      toast.success(`Created wishlist "${newWishlist.name}" and saved product to wishlist`);

      setNewName("");
      setNewDesc("");
      setShowCreateForm(false);

      // Cập nhật trạng thái tim ở ProductCard
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to create wishlist: " + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-semibold">Save to wishlist</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Nội dung cuộn */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : showCreateForm ? (
            <div className="p-5 space-y-4">
              <input
                type="text"
                placeholder="Your wishlist name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                autoFocus
              />
              <textarea
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWishlist}
                  className="flex-1 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          ) : wishlists.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>You dont have any wishlist</p>
            </div>
          ) : (
            <div className="divide-y">
              {wishlists.map((wl) => (
                <button
                  key={wl.id}
                  onClick={() => toggleProductInWishlist(wl.id, wl.hasProduct, wl.name)}
                  disabled={savingIds.has(wl.id)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition disabled:opacity-70 text-left"
                >
                  <div className="flex-1">
                    <div className="font-medium">{wl.name}</div>
                    {wl.description && (
                      <div className="text-xs text-gray-500 mt-1">{wl.description}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {wl.itemCount || 0} product
                    </div>
                  </div>
                  {savingIds.has(wl.id) ? (
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Heart
                      size={24}
                      fill={wl.hasProduct ? "#ef4444" : "none"}
                      className={wl.hasProduct ? "text-red-500" : "text-gray-400"}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nút tạo mới */}
        {!showCreateForm && (
          <div className="p-4 border-t bg-gray-50">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full py-3 flex items-center justify-center gap-2 text-black font-medium hover:bg-gray-200 rounded-lg transition"
            >
              <Plus size={20} />
              Create new wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}