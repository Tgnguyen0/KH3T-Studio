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
    <div className="min-h-screen bg-secondary selection:bg-accent selection:text-white">

      {/* ── Hero bar ── */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-red-500 text-[9px] font-black tracking-[0.45em] uppercase mb-2">KREDO STUDIO — GIỎ HÀNG</p>
            <h1 className="text-3xl lg:text-5xl font-display font-black uppercase tracking-tight text-white leading-none">
              Giỏ hàng
            </h1>
          </div>
          <div className="flex items-center gap-6">
            {cartItems.length > 0 && (
              <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                {cartItems.length} sản phẩm
                {selectedCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-[8px]">{selectedCount} đã chọn</span>
                )}
              </span>
            )}
            <button
              onClick={() => navigate("/product")}
              className="text-[9px] font-black tracking-widest text-white/40 uppercase hover:text-white transition-colors border-b border-white/10 hover:border-white pb-0.5"
            >
              ← Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>

      {/* ── Progress bar: free shipping ── */}
      {summary.subtotal > 0 && summary.subtotal < summary.minFreeShipping && (
        <div className="bg-[#111111] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-[2px] bg-white/10">
                <div
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${Math.min((summary.subtotal / summary.minFreeShipping) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[9px] font-black tracking-widest text-white/40 uppercase whitespace-nowrap">
                Còn {formatVND(summary.minFreeShipping - summary.subtotal)} để miễn phí ship
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">

          {/* ── LEFT: Cart items ── */}
          <div className="lg:col-span-8 space-y-0">

            {/* Column headers */}
            {cartItems.length > 0 && (
              <div className="hidden sm:grid grid-cols-12 text-[9px] font-black tracking-[0.3em] text-primary/30 uppercase pb-5 border-b border-primary/8 mb-0">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-3 text-right">Thành tiền</div>
                <div className="col-span-1"></div>
              </div>
            )}

            {cartItems.length > 0 ? (
              <div className="divide-y divide-primary/5">
                {cartItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-12 items-center py-7 gap-4 sm:gap-0 group"
                  >
                    {/* Product info */}
                    <div className="col-span-12 sm:col-span-6 flex items-center gap-5">
                      {/* Checkbox */}
                      <label className="relative cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleToggleSelect(item.id)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 border transition-all ${item.selected ? 'bg-[#111111] border-[#111111]' : 'bg-white border-primary/20 hover:border-primary/50'} flex items-center justify-center`}>
                          {item.selected && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                              <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </label>

                      {/* Image */}
                      <div className="relative w-20 lg:w-24 aspect-[3/4] bg-secondary overflow-hidden flex-shrink-0 border border-primary/5">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {item.selected && (
                          <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                        )}
                      </div>

                      {/* Name + size */}
                      <div className="space-y-1.5 min-w-0">
                        <p className="font-display font-black text-[11px] lg:text-xs uppercase tracking-tight text-primary leading-snug truncate pr-2">
                          {item.productName}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black tracking-widest text-primary/30 uppercase">Size</span>
                          <span className="px-2 py-0.5 bg-secondary border border-primary/8 text-[8px] font-black text-primary uppercase tracking-wider">
                            {item.sizeName}
                          </span>
                        </div>
                        <p className="text-[9px] font-bold text-primary/40 sm:hidden">
                          {formatVND(item.priceAtTime)} / cái
                        </p>
                      </div>
                    </div>

                    {/* Quantity stepper */}
                    <div className="col-span-6 sm:col-span-2 flex sm:justify-center">
                      <div className="inline-flex items-center border border-primary/10 bg-white h-9">
                        <button
                          className="w-9 h-full flex items-center justify-center text-primary/40 hover:text-primary hover:bg-secondary transition-all text-sm font-bold"
                          onClick={() => handleToggleDecrease(item.id, item.priceAtTime)}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-black text-primary select-none tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          className="w-9 h-full flex items-center justify-center text-primary/40 hover:text-primary hover:bg-secondary transition-all text-sm font-bold"
                          onClick={() => handleToggleIncrease(item.id, item.priceAtTime)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-5 sm:col-span-3 text-right">
                      <p className="font-display font-black text-sm text-primary tabular-nums">
                        {formatVND(item.subtotal)}
                      </p>
                      <p className="text-[9px] text-primary/30 font-bold mt-0.5 hidden sm:block">
                        {item.quantity > 1 && `${formatVND(item.priceAtTime)} × ${item.quantity}`}
                      </p>
                    </div>

                    {/* Delete */}
                    <div className="col-span-1 flex sm:justify-center justify-end">
                      <button
                        onClick={() => handleDelete(item.id, item.quantity, item.subtotal)}
                        className="w-8 h-8 flex items-center justify-center text-primary/20 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Xoá"
                      >
                        <FaTrash size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 gap-6 bg-white border border-primary/5">
                <div className="w-16 h-16 bg-secondary flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-black text-primary/30 uppercase tracking-[0.3em] mb-2">Giỏ hàng trống</p>
                  <p className="text-[10px] text-primary/20 font-bold uppercase tracking-widest">Hãy thêm sản phẩm yêu thích</p>
                </div>
                <button
                  onClick={() => navigate("/product")}
                  className="px-6 py-3 bg-[#111111] text-white text-[9px] font-black tracking-[0.3em] uppercase hover:bg-red-500 transition-colors"
                >
                  Khám phá sản phẩm
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT: Summary panel ── */}
          <div className="lg:col-span-4 sticky top-8 space-y-0">
            <div className="bg-white border border-primary/5">

              {/* Panel header */}
              <div className="bg-[#111111] px-7 py-5">
                <p className="text-red-500 text-[8px] font-black tracking-[0.4em] uppercase mb-1">Thanh toán</p>
                <h2 className="text-lg font-display font-black text-white uppercase tracking-tight">Tóm tắt đơn hàng</h2>
              </div>

              <div className="p-7 space-y-7">

                {/* Coupon */}
                <div>
                  <p className="text-[9px] font-black tracking-widest text-primary/40 uppercase mb-3">Mã giảm giá</p>
                  <div className="flex border border-primary/10">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      placeholder="NHẬP MÃ..."
                      className="flex-1 bg-secondary px-3 py-2.5 text-[10px] font-black tracking-widest placeholder-primary/20 focus:outline-none focus:ring-1 focus:ring-[#111111] uppercase"
                    />
                    <button className="px-4 bg-[#111111] hover:bg-red-500 text-white text-[9px] font-black tracking-widest uppercase transition-colors whitespace-nowrap">
                      Áp dụng
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-primary/5" />

                {/* Numbers */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Tạm tính</span>
                    <span className="font-display font-black text-sm text-primary tabular-nums">{formatVND(summary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Vận chuyển</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${summary.shippingText === 'Miễn phí' ? 'text-emerald-600' : 'text-primary/40'}`}>
                      {summary.shippingText}
                    </span>
                  </div>
                  {summary.discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Giảm giá</span>
                      <span className="text-[10px] font-black text-red-500">−{formatVND(summary.discount)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-primary/10 pt-5">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black tracking-[0.25em] text-primary/40 uppercase">Tổng cộng</span>
                    <span className="font-display font-black text-2xl text-accent tabular-nums leading-none">{formatVND(summary.total)}</span>
                  </div>
                  {selectedCount > 0 && (
                    <p className="text-right text-[8px] text-primary/30 font-bold uppercase tracking-widest mt-1.5">{selectedCount} sản phẩm được chọn</p>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#111111] hover:bg-accent text-white py-4 text-[10px] font-black tracking-[0.3em] uppercase transition-colors flex items-center justify-center gap-3 group"
                >
                  <span>Tiến hành thanh toán</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-primary/5">
                  {[
                    { icon: '🔒', label: 'Bảo mật' },
                    { icon: '↩', label: 'Đổi trả' },
                    { icon: '🚚', label: 'Nhanh' },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1 py-2">
                      <span className="text-base">{icon}</span>
                      <span className="text-[8px] font-black text-primary/30 uppercase tracking-widest">{label}</span>
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