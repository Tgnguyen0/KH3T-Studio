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
      const normalizedItems = items.map((item) => ({
        ...item,
        selected: item.selected !== undefined ? item.selected : (item.isSelected !== undefined ? item.isSelected : false),
      }));
      setCartItems(normalizedItems);
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
    <div className="min-h-screen bg-secondary py-12 selection:bg-accent selection:text-white font-sans">
      
      {/* STEPPER PROGRESS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-16 w-full max-w-2xl">
            <div className="flex items-center gap-2 sm:gap-3 group">
              <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-[11px] font-black font-display shadow-md transition-transform group-hover:scale-105">
                01
              </span>
              <span className="text-[11px] font-black tracking-[0.2em] text-primary uppercase">
                Giỏ hàng
              </span>
            </div>
            <div className="h-[2px] bg-primary/10 flex-1 min-w-[20px] sm:min-w-[40px]"></div>
            <div 
              className="flex items-center gap-2 sm:gap-3 opacity-40 hover:opacity-80 transition-all cursor-pointer group" 
              onClick={handleCheckout}
            >
              <span className="w-7 h-7 rounded-full bg-white border border-primary/10 text-primary flex items-center justify-center text-[11px] font-black font-display shadow-sm group-hover:border-primary/30 group-hover:scale-105 transition-all">
                02
              </span>
              <span className="text-[11px] font-black tracking-[0.2em] text-primary uppercase">
                Giao hàng
              </span>
            </div>
            <div className="h-[2px] bg-primary/10 flex-1 min-w-[20px] sm:min-w-[40px]"></div>
            <div className="flex items-center gap-2 sm:gap-3 opacity-25">
              <span className="w-7 h-7 rounded-full bg-white border border-primary/10 text-primary flex items-center justify-center text-[11px] font-black font-display shadow-sm">
                03
              </span>
              <span className="text-[11px] font-black tracking-[0.2em] text-primary uppercase">
                Hoàn tất
              </span>
            </div>
          </div>
          <div className="w-full border-b border-primary/5 pt-4"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* FREE SHIPPING PROGRESS CARD */}
        {summary.subtotal > 0 && (
          <div className="mb-10 bg-white border border-primary/5 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent text-lg flex-shrink-0 animate-pulse">
                  🚚
                </div>
                <div className="space-y-1">
                  {summary.subtotal >= summary.minFreeShipping ? (
                    <h4 className="text-xs sm:text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                      Đơn hàng đã được miễn phí vận chuyển!
                    </h4>
                  ) : (
                    <h4 className="text-xs sm:text-sm font-black text-primary/80 uppercase tracking-widest">
                      Mua thêm <span className="text-accent underline underline-offset-4 decoration-2">{formatVND(summary.minFreeShipping - summary.subtotal)}</span> để được miễn phí vận chuyển
                    </h4>
                  )}
                  <p className="text-[10px] text-primary/40 font-bold uppercase tracking-wider">
                    Áp dụng cho đơn hàng từ {formatVND(summary.minFreeShipping)} toàn quốc
                  </p>
                </div>
              </div>
              <div className="w-full md:w-80 flex flex-col gap-1.5">
                <div className="flex justify-between text-[9px] font-black tracking-wider text-primary/40 uppercase">
                  <span>Tiến trình nhận ưu đãi</span>
                  <span>{Math.min(Math.round((summary.subtotal / summary.minFreeShipping) * 100), 100)}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-primary/5">
                  <div
                    className={`h-full transition-all duration-1000 ease-out ${
                      summary.subtotal >= summary.minFreeShipping ? "bg-emerald-500" : "bg-accent"
                    }`}
                    style={{ width: `${Math.min((summary.subtotal / summary.minFreeShipping) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Cart items */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.length > 0 ? (
              <div className="bg-white border border-primary/5 rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
                
                {/* Desktop Table Header */}
                <div className="hidden sm:grid grid-cols-12 gap-6 pb-4 border-b border-primary/10 text-[10px] font-black tracking-widest uppercase text-primary/40">
                  <div className="col-span-5">Sản phẩm</div>
                  <div className="col-span-2 text-center">Đơn giá</div>
                  <div className="col-span-2 text-center">Số lượng</div>
                  <div className="col-span-2 text-right">Thành tiền</div>
                  <div className="col-span-1"></div>
                </div>

                <div className="divide-y divide-primary/5 space-y-6 sm:space-y-0">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className={`grid grid-cols-12 items-center gap-4 sm:gap-6 py-6 group first:pt-0 last:pb-0 transition-all duration-300 ${
                        item.selected ? "opacity-100" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* Product Details (Checkbox, Image, Name, Size) */}
                      <div className="col-span-12 sm:col-span-5 flex items-center gap-3 sm:gap-4">
                        {/* Custom Checkbox */}
                        <label className="relative cursor-pointer flex-shrink-0 select-none">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleToggleSelect(item.id)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                            item.selected
                              ? "bg-primary border-primary"
                              : "bg-white border-primary/20 hover:border-primary"
                          }`}>
                            {item.selected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </label>

                        {/* Image */}
                        <div className="relative w-16 sm:w-20 aspect-[3/4] bg-secondary overflow-hidden flex-shrink-0 rounded-xl border border-primary/5 shadow-sm">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Info details */}
                        <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                          <h4
                            onClick={() => navigate(`/product/${item.productId}`)}
                            className="font-display font-black text-xs sm:text-sm uppercase tracking-tight text-primary hover:text-accent cursor-pointer transition-colors line-clamp-2"
                          >
                            {item.productName}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black tracking-widest text-primary/45 uppercase">Size:</span>
                            <span className="px-2 py-0.5 bg-primary/5 text-[9px] font-black text-primary/75 uppercase tracking-widest rounded-md">
                              {item.sizeName}
                            </span>
                          </div>
                          {/* Unit price on mobile only */}
                          <p className="text-[10px] font-bold text-accent sm:hidden">
                            Đơn giá: {formatVND(item.priceAtTime)}
                          </p>
                        </div>
                      </div>

                      {/* Unit Price (Desktop only) */}
                      <div className="hidden sm:block sm:col-span-2 text-center text-xs font-bold text-primary/55 tabular-nums">
                        {formatVND(item.priceAtTime)}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="col-span-6 sm:col-span-2 flex items-center sm:justify-center">
                        <div className="inline-flex items-center border border-primary/10 bg-secondary rounded-full overflow-hidden h-8 sm:h-9 shadow-inner">
                          <button
                            onClick={() => handleToggleDecrease(item.id, item.priceAtTime)}
                            className="w-7 sm:w-8 h-full flex items-center justify-center text-primary/40 hover:text-primary hover:bg-primary/5 transition-all text-xs sm:text-sm font-bold active:scale-90"
                          >
                            −
                          </button>
                          <span className="w-6 sm:w-8 text-center text-[11px] sm:text-xs font-black text-primary select-none tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleToggleIncrease(item.id, item.priceAtTime)}
                            className="w-7 sm:w-8 h-full flex items-center justify-center text-primary/40 hover:text-primary hover:bg-primary/5 transition-all text-xs sm:text-sm font-bold active:scale-90"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-5 sm:col-span-2 text-right">
                        <p className="font-display font-black text-xs sm:text-sm text-primary tabular-nums">
                          {formatVND(item.subtotal)}
                        </p>
                        <p className="text-[9px] text-primary/35 font-bold mt-0.5 hidden sm:block">
                          {item.quantity > 1 && `${formatVND(item.priceAtTime)} / sp`}
                        </p>
                      </div>

                      {/* Delete button */}
                      <div className="col-span-1 flex justify-end sm:justify-center">
                        <button
                          onClick={() => handleDelete(item.id, item.quantity, item.subtotal)}
                          className="w-8 h-8 flex items-center justify-center text-primary/20 hover:text-accent hover:bg-accent/5 rounded-full transition-all duration-300"
                          title="Xoá khỏi giỏ hàng"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer of item list */}
                <div className="flex justify-between items-center pt-6 border-t border-primary/5 text-xs font-bold uppercase tracking-widest text-primary/45">
                  <span>Tổng cộng {selectedCount} sản phẩm đã chọn</span>
                  <button
                    onClick={() => navigate("/product")}
                    className="text-primary/60 hover:text-accent transition-colors flex items-center gap-1.5 text-[10px] font-black"
                  >
                    <span>← Tiếp tục mua sắm</span>
                  </button>
                </div>

              </div>
            ) : (
              /* EMPTY STATE */
              <div className="bg-white border border-primary/5 rounded-2xl shadow-sm py-16 px-6 text-center flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 bg-secondary/80 flex items-center justify-center rounded-full text-primary/30">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-black text-primary/45 uppercase tracking-[0.2em]">Giỏ hàng của bạn đang trống</p>
                  <p className="text-[10px] text-primary/35 font-bold uppercase tracking-widest">Hãy lựa chọn các thiết kế ấn tượng để lấp đầy giỏ hàng</p>
                </div>
                <button
                  onClick={() => navigate("/product")}
                  className="px-6 py-3 bg-[#111111] hover:bg-accent text-white text-[10px] font-black tracking-widest uppercase transition-all rounded-xl shadow-md active:scale-98"
                >
                  Khám phá bộ sưu tập
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-white border border-primary/5 p-8 rounded-2xl shadow-sm space-y-6">
              
              <h2 className="text-sm font-display font-black uppercase tracking-widest mb-6 text-primary pb-3 border-b border-primary/10 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Tóm tắt đơn hàng
              </h2>

              {/* Coupon Input */}
              <div className="space-y-2">
                <label className="text-[9px] font-black tracking-widest text-[#111111]/50 uppercase">Mã giảm giá</label>
                <div className="flex border border-primary/10 bg-secondary focus-within:border-accent/40 rounded-xl overflow-hidden transition-all shadow-inner">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="NHẬP MÃ GIẢM GIÁ..."
                    className="flex-1 min-w-0 bg-transparent px-3 py-3 text-xs font-black tracking-wider placeholder-primary/25 focus:outline-none uppercase border-0"
                  />
                  <button className="flex-shrink-0 px-4 py-3 bg-[#111111] hover:bg-accent text-white text-[9px] font-black tracking-widest uppercase transition-colors whitespace-nowrap border-0 cursor-pointer">
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-4 text-xs font-bold text-primary/60 uppercase tracking-widest border-t border-primary/5 pt-5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary/45">Tạm tính</span>
                  <span className="font-black text-primary tabular-nums">{formatVND(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary/45">Vận chuyển</span>
                  <span className={`font-black tracking-wider text-right tabular-nums ${summary.shippingText === 'Miễn phí' ? 'text-emerald-600' : 'text-primary/45'}`}>
                    {summary.shippingText === 'Miễn phí' ? 'Miễn phí' : 'Tính ở bước tiếp theo'}
                  </span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary/45">Giảm giá</span>
                    <span className="font-black text-accent tabular-nums">−{formatVND(summary.discount)}</span>
                  </div>
                )}
              </div>

              {/* Final total */}
              <div className="border-t border-primary/10 pt-6">
                <div className="flex justify-between items-end font-display font-black text-primary tracking-tight">
                  <span className="text-[10px] font-black tracking-[0.2em] text-primary/40 uppercase mb-1">Tổng cộng</span>
                  <span className="text-xl text-accent font-black tabular-nums">{formatVND(summary.total)}</span>
                </div>
                {selectedCount > 0 && (
                  <p className="text-right text-[9px] text-primary/35 font-bold uppercase tracking-wider mt-2">
                    {selectedCount} sản phẩm được chọn
                  </p>
                )}
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#111111] hover:bg-accent text-white py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all rounded-xl shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
              >
                Tiến hành thanh toán
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-6 border-t border-primary/5 text-center">
                {[
                  { icon: '🔒', label: 'Bảo mật 100%' },
                  { icon: '↩', label: 'Đổi trả 7 ngày' },
                  { icon: '🚚', label: 'Hỏa tốc' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 py-2 hover:bg-secondary rounded-xl transition-colors duration-300">
                    <span className="text-lg">{icon}</span>
                    <span className="text-[8px] font-black text-primary/35 uppercase tracking-wider whitespace-nowrap">{label}</span>
                  </div>
                ))}
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