import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";

const formatVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const calculateSummary = (items) => {
  if (!Array.isArray(items))
    return { subtotal: 0, discount: 0, shippingFee: 0, total: 0, shippingText: "Chưa chọn", minFreeShipping: 1000000 };

  const selectedItems = items.filter((item) => item.selected);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const minFreeShipping = 1000000;
  const discount = 0;
  const shippingFee = subtotal >= minFreeShipping ? 0 : 0;
  const shippingText = subtotal >= minFreeShipping ? "Miễn phí" : "Chưa chọn";
  const total = subtotal - discount + shippingFee;
  return { subtotal, discount, shippingFee, total, shippingText, minFreeShipping };
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [select, setSelect] = useState([]);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [cart, setCart] = useState(null);
  const [coupon, setCoupon] = useState("");

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8080/accounts/myinfor`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data.result);
      if (data.result && data.result.id) {
        localStorage.setItem("userId", data.result.id);
        localStorage.setItem("user", JSON.stringify(data.result));
      }
    } catch (error) { console.error("Lỗi fetch user", error); }
  };

  useEffect(() => { fetchUser(); }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8080/carts/account/${user.id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(data.result);
    } catch (error) { console.error("Lỗi fetch cart: ", error); }
  };

  useEffect(() => { if (user?.id) fetchCart(); }, [user]);

  const hanldeFetchCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8080/cart-details/cart/${cart.id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.result || data.cartDetails || [];
      setCartItems(items);
    } catch (err) { console.error("Lỗi: ", err); }
  };

  const handleToggleSelect = async (cartDetailId) => {
    const updatedItems = cartItems.map((item) =>
      item.id === cartDetailId ? { ...item, selected: !item.selected } : item
    );
    setCartItems(updatedItems);
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://localhost:8080/cart-details/${cartDetailId}/select`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ selected: updatedItems.find((i) => i.id === cartDetailId).selected }),
      });
    } catch (err) { console.error("Lỗi update select: ", err); }
  };

  useEffect(() => { setSelect(cartItems.filter((item) => item.selected)); }, [cartItems]);

  const handleToggleIncrease = async (cartDetailId, priceAtTime) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8080/cart-details/${cartDetailId}/increase-quantity`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCartItems((prev) => prev.map((item) => item.id === cartDetailId ? { ...item, ...data } : item));
      const resCart = await fetch(`http://localhost:8080/carts/update/${cart.id}/increase`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ price: priceAtTime }),
      });
      if (resCart.ok) window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) { console.error("Lỗi:", err); }
  };

  const handleToggleDecrease = async (cartDetailId, priceAtTime) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8080/cart-details/${cartDetailId}/decrease-quantity`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data || data.quantity === 0) {
        setCartItems((prev) => prev.filter((i) => i.id !== cartDetailId));
      } else {
        setCartItems((prev) => prev.map((item) => item.id === cartDetailId ? { ...item, ...data } : item));
      }
      const resCart = await fetch(`http://localhost:8080/carts/update/${cart.id}/decrease`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ price: priceAtTime }),
      });
      if (resCart.ok) window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) { console.error("Lỗi:", err); }
  };

  const handleDelete = async (cartDetailId, quantity, subtotal) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8080/cart-details/delete/${cartDetailId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCartItems(cartItems.filter((item) => item.id !== cartDetailId));
        const resCart = await fetch(`http://localhost:8080/carts/update/${cart.id}/delete`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ price: subtotal, quantity }),
        });
        if (resCart.ok) window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) { console.error("Lỗi:", err); }
  };

  useEffect(() => { if (cart?.id) hanldeFetchCart(); }, [cart]);

  const summary = calculateSummary(cartItems);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("Giỏ hàng rỗng!!!");
    } else if (select.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm muốn thanh toán!!!");
    } else {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      navigate("/checkout", { state: { userId: user.id, select } });
    }
  };

  const selectedCount = cartItems.filter((i) => i.selected).length;

  return (
    <div className="min-h-screen bg-[#F9F8F6] selection:bg-accent selection:text-white font-sans">

      {/* ── Hero bar ── */}
      <div className="bg-[#111111] text-white py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-red-500 text-xs sm:text-sm font-black tracking-[0.3em] uppercase mb-3">KREDO STUDIO — GIỎ HÀNG</p>
            <h1 className="text-4xl lg:text-6xl font-display font-black uppercase tracking-tight text-white leading-none">
              Giỏ hàng
            </h1>
          </div>
          <div className="flex items-center gap-8">
            {cartItems.length > 0 && (
              <span className="text-sm font-black tracking-widest text-white/45 uppercase flex items-center gap-3">
                {cartItems.length} sản phẩm
                {selectedCount > 0 && (
                  <span className="px-3 py-1.5 bg-red-500 text-white text-[11px] sm:text-xs font-black tracking-wider uppercase">{selectedCount} đã chọn</span>
                )}
              </span>
            )}
            <button
              onClick={() => navigate("/product")}
              className="text-sm font-black tracking-widest text-white/50 uppercase hover:text-white transition-colors border-b-2 border-white/10 hover:border-white pb-1"
            >
              ← Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>

      {/* ── Progress bar: free shipping ── */}
      {summary.subtotal > 0 && summary.subtotal < summary.minFreeShipping && (
        <div className="bg-[#181818] border-t border-white/5 py-5">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm font-black tracking-widest text-white/50 uppercase">
                Còn <span className="text-red-500 font-bold">{formatVND(summary.minFreeShipping - summary.subtotal)}</span> để nhận ưu đãi miễn phí giao hàng toàn quốc
              </p>
              <div className="w-full sm:w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-700 ease-out"
                  style={{ width: `${Math.min((summary.subtotal / summary.minFreeShipping) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">

          {/* ── LEFT: Cart items ── */}
          <div className="lg:col-span-8 space-y-4">

            {/* Column headers */}
            {cartItems.length > 0 && (
              <div className="hidden sm:grid grid-cols-12 text-xs sm:text-sm font-black tracking-[0.25em] text-primary/45 uppercase pb-4 border-b border-primary/10 mb-2">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-3 text-right">Thành tiền</div>
                <div className="col-span-1"></div>
              </div>
            )}

            {cartItems.length > 0 ? (
              <div className="divide-y divide-primary/10 bg-white border border-primary/5 shadow-sm px-6">
                {cartItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 items-center py-8 gap-6 sm:gap-0 group"
                  >
                    {/* Product info */}
                    <div className="col-span-12 sm:col-span-6 flex items-center gap-6">
                      {/* Checkbox */}
                      <label className="relative cursor-pointer flex-shrink-0 select-none">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleToggleSelect(item.id)}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 border-2 transition-all ${item.selected ? 'bg-[#111111] border-[#111111]' : 'bg-white border-primary/20 hover:border-[#111111]'} flex items-center justify-center`}>
                          {item.selected && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 10 10">
                              <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </label>

                      {/* Image */}
                      <div className="relative w-24 lg:w-28 aspect-[3/4] bg-secondary overflow-hidden flex-shrink-0 border border-primary/5 shadow-sm">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {item.selected && (
                          <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        )}
                      </div>

                      {/* Name + size */}
                      <div className="space-y-2 min-w-0 flex-1">
                        <p className="font-display font-black text-base lg:text-lg uppercase tracking-tight text-primary leading-snug hover:text-red-500 transition-colors cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>
                          {item.productName}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black tracking-widest text-primary/40 uppercase">Kích cỡ</span>
                          <span className="px-3.5 py-1.5 bg-[#f5f5f3] border border-primary/10 text-xs font-black text-primary uppercase tracking-wider">
                            {item.sizeName}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-primary/45 sm:hidden">
                          Đơn giá: {formatVND(item.priceAtTime)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity stepper */}
                    <div className="col-span-6 sm:col-span-2 flex sm:justify-center">
                      <div className="inline-flex items-center border border-primary/15 bg-white h-11 shadow-sm">
                        <button
                          className="w-11 h-full flex items-center justify-center text-primary/55 hover:text-[#111111] hover:bg-[#f5f5f3] transition-all text-lg font-bold"
                          onClick={() => handleToggleDecrease(item.id, item.priceAtTime)}
                        >
                          −
                        </button>
                        <span className="w-11 text-center text-base font-black text-primary select-none tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          className="w-11 h-full flex items-center justify-center text-primary/55 hover:text-[#111111] hover:bg-[#f5f5f3] transition-all text-lg font-bold"
                          onClick={() => handleToggleIncrease(item.id, item.priceAtTime)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-5 sm:col-span-3 text-right">
                      <p className="font-display font-black text-lg lg:text-xl text-primary tabular-nums">
                        {formatVND(item.subtotal)}
                      </p>
                      <p className="text-xs text-primary/35 font-bold mt-1.5 hidden sm:block">
                        {item.quantity > 1 && `${formatVND(item.priceAtTime)} × ${item.quantity}`}
                      </p>
                    </div>

                    {/* Delete */}
                    <div className="col-span-1 flex sm:justify-center justify-end">
                      <button
                        onClick={() => handleDelete(item.id, item.quantity, item.subtotal)}
                        className="w-11 h-11 flex items-center justify-center text-primary/30 hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
                        title="Xoá khỏi giỏ hàng"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-28 gap-8 bg-white border border-primary/5 shadow-sm">
                <div className="w-24 h-24 bg-secondary/80 flex items-center justify-center rounded-full text-primary/30">
                  <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="text-center space-y-2 px-6">
                  <p className="text-base font-black text-primary/45 uppercase tracking-[0.25em]">Giỏ hàng của bạn đang trống</p>
                  <p className="text-xs sm:text-sm text-primary/30 font-bold uppercase tracking-wider">Hãy thêm các mẫu thiết kế yêu thích vào giỏ hàng ngay</p>
                </div>
                <button
                  onClick={() => navigate("/product")}
                  className="px-10 py-4.5 bg-[#111111] text-white text-xs sm:text-sm font-black tracking-[0.25em] uppercase hover:bg-red-500 transition-all duration-300 shadow-md"
                >
                  Khám phá sản phẩm
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT: Summary panel ── */}
          <div className="lg:col-span-4 sticky top-8 space-y-0">
            <div className="bg-white border border-primary/5 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.08)]">

              {/* Panel header */}
              <div className="bg-[#111111] px-8 py-7">
                <p className="text-red-500 text-xs sm:text-sm font-black tracking-[0.4em] uppercase mb-1.5">Thanh toán</p>
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">Tóm tắt đơn hàng</h2>
              </div>

              <div className="p-8 space-y-8">

                {/* Coupon */}
                <div>
                  <p className="text-xs font-black tracking-widest text-[#111111] uppercase mb-3">Mã giảm giá</p>
                  <div className="flex border border-primary/15 focus-within:border-primary transition-all overflow-hidden">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      placeholder="NHẬP MÃ..."
                      className="flex-1 min-w-0 bg-[#fbfbfa] px-3.5 py-4 text-xs font-black tracking-wider placeholder-primary/30 focus:outline-none uppercase border-0"
                    />
                    <button className="flex-shrink-0 px-5 py-4 bg-[#111111] hover:bg-red-500 text-white text-xs font-black tracking-wider uppercase transition-colors whitespace-nowrap border-0">
                      Áp dụng
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-primary/5" />

                {/* Numbers */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-primary/45 uppercase tracking-widest">Tạm tính</span>
                    <span className="font-display font-black text-base sm:text-lg text-primary tabular-nums">{formatVND(summary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-primary/45 uppercase tracking-widest">Vận chuyển</span>
                    <span className={`text-sm font-black uppercase tracking-widest ${summary.shippingText === 'Miễn phí' ? 'text-emerald-600' : 'text-primary/40'}`}>
                      {summary.shippingText}
                    </span>
                  </div>
                  {summary.discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-primary/45 uppercase tracking-widest">Giảm giá</span>
                      <span className="text-sm font-black text-red-500">−{formatVND(summary.discount)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-primary/10 pt-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black tracking-[0.2em] text-[#111111] uppercase pb-1">Tổng cộng</span>
                    <span className="font-display font-black text-2xl lg:text-3xl text-accent tabular-nums leading-none">{formatVND(summary.total)}</span>
                  </div>
                  {selectedCount > 0 && (
                    <p className="text-right text-xs text-primary/35 font-bold uppercase tracking-wider mt-2">{selectedCount} sản phẩm được chọn</p>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#111111] hover:bg-accent text-white py-4.5 text-sm sm:text-base font-black tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-3 group shadow-[0_12px_24px_-10px_rgba(0,0,0,0.18)] hover:shadow-none"
                >
                  <span>Tiến hành thanh toán</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-primary/5">
                  {[
                    { icon: '🔒', label: 'Bảo mật' },
                    { icon: '↩', label: 'Đổi trả 7 ngày' },
                    { icon: '🚚', label: 'Giao nhanh' },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 py-2 hover:bg-[#fbfbfa] transition-colors">
                      <span className="text-lg">{icon}</span>
                      <span className="text-[11px] sm:text-xs font-black text-primary/35 uppercase tracking-wider text-center">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <ChatBot />
      <Contact />
    </div>
  );
};

export default Cart;