import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

const formatVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const calculateSummary = (items) => {
  if (!Array.isArray(items))
    return {
      subtotal: 0,
      discount: 0,
      shippingFee: 30000,
      total: 0,
    };

  const selectedItems = items.filter((i) => i.selected);
  const subtotal = selectedItems.reduce((s, i) => s + i.subtotal, 0);
  const discount = 0;
  const shippingFee = 30000;
  const total = subtotal - discount + shippingFee;

  return { subtotal, discount, shippingFee, total };
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [addresses, setAddresses] = useState([]);
  const userId = location.state?.userId;
  const product = location.state?.product;
  const quantity = location.state?.quantity;
  const selectedCartItems = location.state?.select || [];
  const [cartItems, setCartItems] = useState([]);
  const [payment, setPayment] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [summary, setSummary] = useState({
    subtotal: 0,
    discount: 0,
    shippingFee: 0,
    total: 0,
  });

  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
  });
  const [formAddress, setFormAddress] = useState({
    province: "",
    delivery_address: "",
    delivery_note: "",
  });
  const [isAddAddress, setIsAddAddress] = useState(false);
  console.log(product, quantity);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`http://localhost:8080/addresses/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setAddresses(data);
      } catch (error) {
        console.log("Lỗi fetch Addreses: ", error);
      }
    };
    if (userId) fetchAddresses();
  }, [userId]);

  useEffect(() => {
    const handleFetchCustomer = async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8080/customers/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const customer = await res.json();
      setForm({
        name: customer.fullName,
        phone: customer.phoneNumber,
        email: customer.email,
      });
    };
    handleFetchCustomer();
  }, []);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/v2/?depth=2")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  const handleProvinceChange = (provinceName) => {
    setSelectedProvince(provinceName);

    const province = provinces.find((p) => p.name == provinceName);

    setWards(province?.wards || []);
  };

  useEffect(() => {
    const stored = localStorage.getItem("cartItems");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCartItems(parsed);
      setSummary(calculateSummary(parsed));
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleChangeAddress = (e) =>
    setFormAddress({ ...formAddress, [e.target.name]: e.target.value });

  const handleSelectAddress = (index) => {
    if (index === "") return;

    const addr = addresses[index];

    setForm((prev) => ({
      ...prev,
      address: addr.delivery_address,
      province: addr.province,
      district: addr.city,
      ward: addr.ward || "",
      note: addr.delivery_note || "",
    }));
  };
  const handleConfirm = async () => {
    try {
      if (payment === "") {
        toast.warning("Vui lòng chọn phương thức thanh toán!!!");
      } else {
        const token = localStorage.getItem("accessToken");
        const fullAddress = `${form.address}${
          form.ward ? ", " + form.ward : ""
        }, ${form.province}`;

        let requestBody;

        if (product) {
          requestBody = {
            receiverName: form.name,
            receiverPhone: form.phone,
            receiverEmail: form.email,
            receiverAddress: fullAddress,
            totalAmount: product.costPrice * quantity + 30000,
          };
        } else {
          requestBody = {
            receiverName: form.name,
            receiverPhone: form.phone,
            receiverEmail: form.email,
            receiverAddress: fullAddress,
            totalAmount: summary.total,
          };
        }

        const res = await fetch(
          "http://localhost:8080/customer-trading/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!res.ok) throw new Error("Failed to create order");

        const data = await res.json();
        console.log(data);
        let orderBody;
        if (payment === "bank") {
          orderBody = {
            customerTradingId: data.id,
            note: form.note || "",
            account_id: userId,
            paymentMethod: "BANK_TRANSFER",
          };
        } else {
          orderBody = {
            customerTradingId: data.id,
            note: form.note || "",
            account_id: userId,
            paymentMethod: "CASH",
          };
        }

        const orderRes = await fetch("http://localhost:8080/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderBody),
        });

        if (!orderRes.ok) throw new Error("Failed to create order");

        const orderData = await orderRes.json();
        console.log("Order created:", orderData);
        if (orderData.ok) {
          toast.success("Đặt hàng thành công!!");
        }
        if (product) {
          await fetch(`http://localhost:8080/order-details/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productName: product.name,
              quantity: quantity,
              unitPrice: product.costPrice,
              totalPrice: product.costPrice * quantity,
              orderId: orderData.id,
              productId: product.id,
            }),
          });
        } else {
          let cartId = null;
          try {
            const cartRes = await fetch(`http://localhost:8080/carts/account/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (cartRes.ok) {
              const cartData = await cartRes.json();
              cartId = cartData.result?.id;
            }
          } catch (err) {
            console.error("Error fetching cart for checkout update:", err);
          }

          for (const item of selectedCartItems) {
            // Create order detail
            await fetch(`http://localhost:8080/order-details/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.priceAtTime,
                totalPrice: item.subtotal,
                orderId: orderData.id,
                productId: item.productId || item.id, // Try productId first, fallback to id if joined
              }),
            });

            // DELETE from backend cart
            await fetch(`http://localhost:8080/cart-details/delete/${item.id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            // Update cart totals on backend
            if (cartId) {
              await fetch(`http://localhost:8080/carts/update/${cartId}/delete`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ price: item.subtotal, quantity: item.quantity }),
              });
            }
          }
          localStorage.removeItem("cartItems");
          window.dispatchEvent(new Event("cartUpdated"));
        }
        toast.success("Đặt hàng thành công!!");
        if (payment === "bank") {
          const orderId = orderData.id;
          const invoiceRequest = {
            orderId: orderId,
            paymentMethod: "BANK_TRANSFER",
            paymentStatus: "UNPAID",
          };
          const res = await fetch("http://localhost:8080/invoices", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(invoiceRequest),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to create invoice");
          } else {
            const newInvoice = await res.json();
            const finalAmount = product ? (product.costPrice * quantity + 30000) : summary.total;
            navigate(
              `/payment?orderId=${orderData.id}&amount=${finalAmount}&invoiceId=${newInvoice.id}&invoiceCode=${newInvoice.invoiceCode}`
            );
          }
        } else {
          navigate("/orders");
        }
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };
  const handleAddNewAddress = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const finalDeliveryAddress = selectedWard
        ? `${formAddress.delivery_address}, ${selectedWard}`
        : `${formAddress.delivery_address}`;
      const requestBody = {
        accountId: userId,
        province: selectedProvince,
        delivery_address: finalDeliveryAddress,
        delivery_note: formAddress.delivery_note,
      };
      const res = await fetch(`http://localhost:8080/addresses/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        setFormAddress({
          city: "",
          province: "",
          delivery_address: "",
          delivery_note: "",
        });
        toast.success("Thêm địa chỉ thành công!!");
        setIsAddAddress(false);
      }
      const resAddress = await fetch(
        `http://localhost:8080/addresses/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await resAddress.json();
      setAddresses(data);
    } catch (error) {
      console.error("Fail to add new address!!", error);
      toast.error("Thêm địa chỉ thất bại!!");
    }
  };

  return (
    <div className="min-h-screen bg-secondary py-16 selection:bg-accent selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT COLUMN: SHIPPING INFO & PRODUCTS */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Delivery Info */}
          <div className="bg-white border border-primary/5 p-8">
            <h2 className="text-xl font-display font-black uppercase tracking-widest mb-8 text-primary pb-3 border-b border-primary/5">
              Thông tin giao hàng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">EMAIL</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-primary/20"
                  onChange={handleChange}
                  value={form.email}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">HỌ VÀ TÊN</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Họ và tên"
                  className="bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-primary/20"
                  onChange={handleChange}
                  value={form.name}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">SỐ ĐIỆN THOẠI</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Số điện thoại"
                  className="bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-primary/20"
                  onChange={handleChange}
                  value={form.phone}
                />
              </div>

              <div className="flex items-end justify-end pb-1.5">
                {!isAddAddress && (
                  <button
                    onClick={() => setIsAddAddress(true)}
                    className="h-10 px-4 bg-[#111111] hover:bg-accent text-white text-[9px] font-black tracking-widest uppercase transition-colors"
                  >
                    Thêm địa chỉ mới
                  </button>
                )}
              </div>

              {/* Saved addresses dropdown */}
              {!isAddAddress ? (
                <div className="md:col-span-2 flex flex-col space-y-1.5">
                  <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">ĐỊA CHỈ ĐÃ LƯU</label>
                  <select
                    name="address"
                    className="bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all cursor-pointer uppercase tracking-wider text-primary"
                    onChange={(e) => handleSelectAddress(e.target.value)}
                  >
                    <option value="">-- Chọn địa chỉ đã lưu --</option>
                    {addresses.map((addr, index) => (
                      <option key={index} value={index}>
                        {addr.delivery_address} ({addr.province})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="md:col-span-2 border border-primary/5 p-6 bg-secondary space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary/60 pb-2 border-b border-primary/5">Thêm địa chỉ mới</h3>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Địa chỉ chi tiết</label>
                    <input
                      type="text"
                      name="delivery_address"
                      placeholder="Số nhà, tên đường..."
                      className="bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-primary/20"
                      onChange={handleChangeAddress}
                      value={formAddress.delivery_address}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">TỈNH/THÀNH PHỐ</label>
                      <select
                        value={selectedProvince}
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        className="bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="">-- Chọn Tỉnh/Thành phố --</option>
                        {provinces.map((p) => (
                          <option key={p.code} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">PHƯỜNG/XÃ</label>
                      <select
                        className="bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all cursor-pointer"
                        disabled={!selectedProvince}
                        onChange={(e) => setSelectedWard(e.target.value)}
                      >
                        <option value="">-- Chọn Phường/Xã --</option>
                        {wards.map((w) => (
                          <option key={w.code} value={w.name}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Ghi chú giao hàng</label>
                    <textarea
                      name="delivery_note"
                      placeholder="Ghi chú giao hàng (tùy chọn)"
                      className="bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-primary/20 w-full"
                      rows="2"
                      onChange={handleChangeAddress}
                      value={formAddress.delivery_note}
                    ></textarea>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setIsAddAddress(false)}
                      className="px-4 py-2 border border-primary/10 text-[9px] font-black tracking-widest uppercase hover:bg-primary/5 transition-colors bg-white"
                    >
                      Hủy
                    </button>

                    <button
                      onClick={handleAddNewAddress}
                      className="px-4 py-2 bg-[#111111] hover:bg-accent text-white text-[9px] font-black tracking-widest uppercase transition-colors"
                    >
                      Lưu địa chỉ
                    </button>
                  </div>
                </div>
              )}

              <div className="md:col-span-2 flex flex-col space-y-1.5">
                <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">GHI CHÚ ĐƠN HÀNG</label>
                <textarea
                  name="note"
                  placeholder="Ghi chú thêm về đơn hàng của bạn..."
                  className="bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-primary/20 md:col-span-2 w-full"
                  rows="3"
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Product list */}
          <div className="bg-white border border-primary/5 p-8">
            <h2 className="text-xl font-display font-black uppercase tracking-widest mb-8 text-primary pb-3 border-b border-primary/5">
              Sản phẩm đang mua
            </h2>

            <div className="divide-y divide-primary/5">
              {product ? (
                // BUY NOW SINGLE PRODUCT
                <div className="flex items-center gap-6 py-6">
                  <div className="w-20 aspect-[3/4] bg-secondary overflow-hidden flex-shrink-0">
                    <img
                      src={product.imageUrlFront}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-black text-sm uppercase tracking-tight text-primary">{product.name}</h4>
                    <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest mt-1">
                      {location.state?.selectedSize && `Kích cỡ: ${location.state.selectedSize} | `}
                      Số lượng: <span className="text-primary font-black">{quantity}</span>
                    </p>
                    <p className="text-xs font-black text-accent mt-1">
                      {formatVND(product.costPrice)}
                    </p>
                  </div>
                  <div className="text-right font-display font-black text-sm text-primary tracking-tight">
                    {formatVND(product.costPrice * quantity)}
                  </div>
                </div>
              ) : selectedCartItems.length > 0 ? (
                // CART ITEMS LIST
                selectedCartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-6 py-6">
                    <div className="w-20 aspect-[3/4] bg-secondary overflow-hidden flex-shrink-0">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display font-black text-sm uppercase tracking-tight text-primary">{item.productName}</h4>
                      <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest mt-1">
                        Kích cỡ: <span className="text-primary font-black">{item.sizeName}</span> | Số lượng: <span className="text-primary font-black">{item.quantity}</span>
                      </p>
                      <p className="text-xs font-black text-accent mt-1">
                        {formatVND(item.priceAtTime)}
                      </p>
                    </div>
                    <div className="text-right font-display font-black text-sm text-primary tracking-tight">
                      {formatVND(item.subtotal)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-primary/30 font-bold uppercase tracking-widest text-xs">
                  Không có sản phẩm nào được chọn.
                </div>
              )}
            </div>
          </div>

          {/* Delivery option */}
          <div className="bg-white border border-primary/5 p-8">
            <h2 className="text-xl font-display font-black uppercase tracking-widest mb-6 text-primary pb-3 border-b border-primary/5">
              Phương thức vận chuyển
            </h2>
            <div className="flex justify-between items-center border border-primary/10 p-5 bg-secondary">
              <span className="text-[11px] font-black tracking-widest uppercase text-primary/60">Tiêu chuẩn (3–5 ngày làm việc)</span>
              <span className="font-display font-black text-sm text-primary">{formatVND(30000)}</span>
            </div>
          </div>

          {/* Payment option */}
          <div className="bg-white border border-primary/5 p-8">
            <h2 className="text-xl font-display font-black uppercase tracking-widest mb-6 text-primary pb-3 border-b border-primary/5">
              Phương thức thanh toán
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-4 border border-primary/10 p-4 cursor-pointer bg-secondary hover:bg-primary/5 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  className="w-4 h-4 accent-[#111111]"
                  onChange={(e) => setPayment(e.target.value)}
                />
                <span className="text-[11px] font-black tracking-widest uppercase text-primary">Thanh toán khi nhận hàng (COD)</span>
              </label>

              <label className="flex items-center gap-4 border border-primary/10 p-4 cursor-pointer bg-secondary hover:bg-primary/5 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  className="w-4 h-4 accent-[#111111]"
                  onChange={(e) => setPayment(e.target.value)}
                />
                <span className="text-[11px] font-black tracking-widest uppercase text-primary">Chuyển khoản ngân hàng</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY & CONFIRM */}
        <div className="lg:col-span-4 bg-white border border-primary/5 p-8 h-fit">
          <h2 className="text-xl font-display font-black uppercase tracking-widest mb-8 text-primary pb-3 border-b border-primary/5">
            Tóm tắt đơn hàng
          </h2>

          <div className="space-y-4 mb-8 text-xs font-bold text-primary/60 uppercase tracking-widest">
            <div className="flex justify-between">
              <span className="font-medium text-primary/40">Tạm tính:</span>
              <span className="font-black text-primary">{formatVND(summary.subtotal)}</span>
            </div>

            {product ? (
              <div className="flex justify-between">
                <span className="font-medium text-primary/40">Phí vận chuyển:</span>
                <span className="font-black text-primary">{formatVND(30000)}</span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="font-medium text-primary/40">Phí vận chuyển:</span>
                <span className="font-black text-primary">{formatVND(summary.shippingFee)}</span>
              </div>
            )}

            <div className="flex justify-between pb-4 border-b border-primary/5">
              <span className="font-medium text-primary/40">Giảm giá:</span>
              <span className="font-black text-accent">{formatVND(summary.discount)}</span>
            </div>
          </div>

          {product ? (
            <div className="flex justify-between items-end font-display font-black text-lg text-primary tracking-tight">
              <span className="text-[10px] font-black tracking-[0.2em] text-primary/40 uppercase mb-1">TỔNG CỘNG:</span>
              <span className="text-xl text-accent font-black">
                {formatVND(product.costPrice * quantity + 30000)}
              </span>
            </div>
          ) : (
            <div className="flex justify-between items-end font-display font-black text-lg text-primary tracking-tight">
              <span className="text-[10px] font-black tracking-[0.2em] text-primary/40 uppercase mb-1">TỔNG CỘNG:</span>
              <span className="text-xl text-accent font-black">{formatVND(summary.total)}</span>
            </div>
          )}

          <button
            onClick={handleConfirm}
            className="w-full mt-8 bg-[#111111] hover:bg-accent text-white py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-colors shadow-md active:scale-98"
          >
            Xác nhận đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
