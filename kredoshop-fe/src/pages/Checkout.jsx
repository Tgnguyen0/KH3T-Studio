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

  const selectedItems = items.filter((i) => i.selected !== undefined ? i.selected : (i.isSelected !== undefined ? i.isSelected : false));
  const subtotal = selectedItems.reduce((s, i) => s + i.subtotal, 0);
  const discount = 0;
  const shippingFee = subtotal >= 1000000 ? 0 : 30000;
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
  const [payment, setPayment] = useState("cash");
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
  const [errors, setErrors] = useState({});
  console.log(product, quantity);

  const buyNowSubtotal = product ? ((product.costPrice || product.price) * quantity) : 0;
  const buyNowShippingFee = product ? (buyNowSubtotal >= 1000000 ? 0 : 30000) : 0;
  const buyNowTotal = product ? (buyNowSubtotal + buyNowShippingFee) : 0;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/addresses/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setAddresses(data);
        if (data && data.length > 0) {
          const addr = data[0];
          setForm((prev) => ({
            ...prev,
            address: addr.delivery_address,
            province: addr.province,
            district: addr.city || "",
            ward: addr.ward || "",
            note: addr.delivery_note || "",
          }));
        }
      } catch (error) {
        console.log("Lỗi fetch Addreses: ", error);
      }
    };
    if (userId) fetchAddresses();
  }, [userId]);

  useEffect(() => {
    const handleFetchCustomer = async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/customers/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const customer = await res.json();
      setForm((prev) => ({
        ...prev,
        name: customer.fullName,
        phone: customer.phoneNumber,
        email: customer.email,
      }));
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
    setSelectedWard("");
  };

  useEffect(() => {
    const stored = localStorage.getItem("cartItems");
    if (stored) {
      const parsed = JSON.parse(stored).map((item) => ({
        ...item,
        selected: item.selected !== undefined ? item.selected : (item.isSelected !== undefined ? item.isSelected : false),
      }));
      setCartItems(parsed);
      setSummary(calculateSummary(parsed));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };
  const handleChangeAddress = (e) =>
    setFormAddress({ ...formAddress, [e.target.name]: e.target.value });

  const handleSelectAddress = (index) => {
    if (index === "") return;

    const addr = addresses[index];

    setForm((prev) => ({
      ...prev,
      address: addr.delivery_address,
      province: addr.province,
      district: addr.city || "",
      ward: addr.ward || "",
      note: addr.delivery_note || "",
    }));

    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: "" }));
    }
  };

  const handleConfirm = async () => {
    try {
      const newErrors = {};

      // 1. Validate Họ và tên
      if (!form.name || form.name.trim() === "") {
        newErrors.name = "Họ và tên không được để trống!";
      }

      // 2. Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!form.email || form.email.trim() === "") {
        newErrors.email = "Email không được để trống!";
      } else if (!emailRegex.test(form.email)) {
        newErrors.email = "Email không đúng định dạng!";
      }

      // 3. Validate Số điện thoại (Vietnam format)
      const phoneRegex = /^(0|84)[3|5|7|8|9][0-9]{8}$/;
      if (!form.phone || form.phone.trim() === "") {
        newErrors.phone = "Số điện thoại không được để trống!";
      } else if (!phoneRegex.test(form.phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ (phải gồm 10 chữ số)!";
      }

      // 4. Validate Địa chỉ
      if (isAddAddress) {
        toast.warning("Vui lòng lưu địa chỉ mới trước khi xác nhận đặt hàng!");
        return;
      }

      if (!form.address || !form.province || form.address.trim() === "") {
        newErrors.address = "Vui lòng chọn địa chỉ giao hàng hoặc thêm địa chỉ mới!";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        const firstError = Object.values(newErrors)[0];
        toast.warning(firstError);
        return;
      }

      if (payment === "") {
        toast.warning("Vui lòng chọn phương thức thanh toán!!!");
        return;
      }

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
          totalAmount: buyNowTotal,
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
        `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/customer-trading/create`,
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

      const orderRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/orders/create`, {
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
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/order-details/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productName: product.name,
            quantity: quantity,
            unitPrice: product.costPrice || product.price,
            totalPrice: (product.costPrice || product.price) * quantity,
            orderId: orderData.id,
            productId: product.id,
          }),
        });
      } else {
        let cartId = null;
        try {
          const cartRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/carts/account/${userId}`, {
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
          await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/order-details/create`, {
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
              productId: item.productId || item.id,
            }),
          });

          // DELETE from backend cart
          await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/cart-details/delete/${item.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Update cart totals on backend
          if (cartId) {
            await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/carts/update/${cartId}/delete`, {
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
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/invoices`, {
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
          const finalAmount = product ? buyNowTotal : summary.total;
          navigate(
            `/payment?orderId=${orderData.id}&amount=${finalAmount}&invoiceId=${newInvoice.id}&invoiceCode=${newInvoice.invoiceCode}`
          );
        }
      } else {
        navigate("/orders");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  const handleAddNewAddress = async () => {
    if (!formAddress.delivery_address || formAddress.delivery_address.trim() === "") {
      toast.warning("Vui lòng nhập địa chỉ chi tiết!");
      return;
    }
    if (!selectedProvince) {
      toast.warning("Vui lòng chọn Tỉnh/Thành phố!");
      return;
    }

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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/addresses/add`, {
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
        const prevProvince = selectedProvince;
        setSelectedProvince("");
        setSelectedWard("");
        toast.success("Thêm địa chỉ thành công!!");
        setIsAddAddress(false);

        // Fetch updated address list
        const resAddress = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/addresses/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await resAddress.json();
        setAddresses(data);

        // Auto select the new address
        if (data && data.length > 0) {
          let selectedAddr = data[data.length - 1];
          const newAddrIndex = data.findIndex(
            (addr) =>
              addr.delivery_address === finalDeliveryAddress &&
              addr.province === prevProvince
          );
          if (newAddrIndex !== -1) {
            selectedAddr = data[newAddrIndex];
          }
          setForm((prev) => ({
            ...prev,
            address: selectedAddr.delivery_address,
            province: selectedAddr.province,
            district: selectedAddr.city || "",
            ward: selectedAddr.ward || "",
            note: selectedAddr.delivery_note || "",
          }));

          if (errors.address) {
            setErrors((prev) => ({ ...prev, address: "" }));
          }
        }
      } else {
        toast.error("Thêm địa chỉ thất bại!!");
      }
    } catch (error) {
      console.error("Fail to add new address!!", error);
      toast.error("Thêm địa chỉ thất bại!!");
    }
  };

  return (
    <div className="min-h-screen bg-secondary py-12 selection:bg-accent selection:text-white">
      {/* HEADER & BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h1 className="text-2xl md:text-3xl font-display font-black uppercase tracking-widest text-primary mb-3 text-center lg:text-left">
          Thanh toán
        </h1>
        <div className="flex items-center justify-center lg:justify-start gap-3 text-[10px] font-black tracking-widest uppercase text-primary/40">
          <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate("/cart")}>Giỏ hàng</span>
          <span>/</span>
          <span className="text-accent">Thông tin giao hàng</span>
          <span>/</span>
          <span>Hoàn tất</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: SHIPPING INFO & PRODUCTS & PAYMENTS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Contact & Delivery Info */}
          <div className="bg-white border border-primary/5 p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-display font-black uppercase tracking-widest mb-6 text-primary pb-3 border-b border-primary/5 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Thông tin giao hàng
            </h2>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[9px] font-black tracking-widest text-primary/45 uppercase">Họ và tên người nhận</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Họ và tên"
                  className={`bg-secondary p-3.5 text-xs font-semibold focus:ring-1 focus:ring-accent focus:outline-none transition-all placeholder-primary/20 border rounded-xl ${
                    errors.name
                      ? "border-accent focus:ring-accent"
                      : "border-primary/5 focus:ring-accent"
                  }`}
                  onChange={handleChange}
                  value={form.name}
                />
                {errors.name && (
                  <span className="text-[10px] text-accent font-semibold mt-1">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[9px] font-black tracking-widest text-primary/45 uppercase">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Số điện thoại"
                  className={`bg-secondary p-3.5 text-xs font-semibold focus:ring-1 focus:ring-accent focus:outline-none transition-all placeholder-primary/20 border rounded-xl ${
                    errors.phone
                      ? "border-accent focus:ring-accent"
                      : "border-primary/5 focus:ring-accent"
                  }`}
                  onChange={handleChange}
                  value={form.phone}
                />
                {errors.phone && (
                  <span className="text-[10px] text-accent font-semibold mt-1">
                    {errors.phone}
                  </span>
                )}
              </div>

              <div className="md:col-span-2 flex flex-col space-y-1.5">
                <label className="text-[9px] font-black tracking-widest text-primary/45 uppercase">Địa chỉ Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`bg-secondary p-3.5 text-xs font-semibold focus:ring-1 focus:ring-accent focus:outline-none transition-all placeholder-primary/20 border rounded-xl ${
                    errors.email
                      ? "border-accent focus:ring-accent"
                      : "border-primary/5 focus:ring-accent"
                  }`}
                  onChange={handleChange}
                  value={form.email}
                />
                {errors.email && (
                  <span className="text-[10px] text-accent font-semibold mt-1">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Address Selection Block */}
            <div className="flex flex-col space-y-4 pt-6 border-t border-primary/5">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black tracking-widest text-primary/45 uppercase">
                  Địa chỉ giao hàng
                </label>
                {!isAddAddress && (
                  <button
                    onClick={() => setIsAddAddress(true)}
                    className="text-[9px] font-black tracking-widest uppercase text-accent hover:text-accent-hover transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm địa chỉ mới
                  </button>
                )}
              </div>

              {errors.address && (
                <div className="text-[10px] text-accent font-semibold px-3 py-2 bg-accent/5 border border-accent/15 rounded-lg">
                  {errors.address}
                </div>
              )}

              {!isAddAddress ? (
                addresses.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {addresses.map((addr, index) => {
                      const isSelected = form.address === addr.delivery_address && form.province === addr.province;
                      return (
                        <div
                          key={index}
                          onClick={() => handleSelectAddress(index)}
                          className={`p-4 border cursor-pointer transition-all rounded-xl flex justify-between items-start ${
                            isSelected
                              ? "border-accent bg-accent/[0.02] ring-1 ring-accent"
                              : "border-primary/10 bg-secondary hover:border-primary/30"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black tracking-widest text-primary uppercase">
                                Địa chỉ #{index + 1}
                              </span>
                              {index === 0 && (
                                <span className="bg-primary/5 text-primary/65 text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-primary">{addr.delivery_address}</p>
                            <p className="text-[10px] text-primary/60 font-medium">Tỉnh/TP: {addr.province}</p>
                            {addr.delivery_note && (
                              <p className="text-[10px] text-primary/45 italic mt-1">Lưu ý: {addr.delivery_note}</p>
                            )}
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? "border-accent bg-accent" : "border-primary/20"
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-primary/20 rounded-xl bg-secondary flex flex-col items-center justify-center">
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-3">
                      Bạn chưa lưu địa chỉ nào
                    </p>
                    <button
                      onClick={() => setIsAddAddress(true)}
                      className="px-4 py-2.5 bg-[#111111] hover:bg-accent text-white text-[9px] font-black tracking-widest uppercase transition-colors rounded-lg shadow-sm"
                    >
                      Thêm địa chỉ đầu tiên
                    </button>
                  </div>
                )
              ) : (
                <div className="border border-primary/5 p-6 rounded-2xl bg-secondary space-y-6 animate-fade-in-up">
                  <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary/70">Thêm địa chỉ mới</h3>
                    <button
                      onClick={() => setIsAddAddress(false)}
                      className="text-[9px] font-black tracking-widest uppercase text-primary/40 hover:text-primary transition-colors"
                    >
                      Quay lại chọn địa chỉ
                    </button>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Địa chỉ chi tiết</label>
                    <input
                      type="text"
                      name="delivery_address"
                      placeholder="Số nhà, tên đường..."
                      className="bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-accent focus:outline-none transition-all placeholder-primary/20 border border-primary/5 rounded-xl"
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
                        className="w-full bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-accent focus:outline-none transition-all cursor-pointer border border-primary/5 rounded-xl"
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
                        className="w-full bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-accent focus:outline-none transition-all cursor-pointer border border-primary/5 rounded-xl"
                        disabled={!selectedProvince}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        value={selectedWard}
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
                      className="bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-accent focus:outline-none transition-all placeholder-primary/20 w-full border border-primary/5 rounded-xl"
                      rows="2"
                      onChange={handleChangeAddress}
                      value={formAddress.delivery_note}
                    ></textarea>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setIsAddAddress(false)}
                      className="px-4 py-2 border border-primary/10 text-[9px] font-black tracking-widest uppercase hover:bg-primary/5 transition-colors bg-white rounded-lg"
                    >
                      Hủy
                    </button>

                    <button
                      onClick={handleAddNewAddress}
                      className="px-4 py-2 bg-[#111111] hover:bg-accent text-white text-[9px] font-black tracking-widest uppercase transition-colors rounded-lg shadow-sm"
                    >
                      Lưu địa chỉ
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Note */}
            <div className="flex flex-col space-y-1.5 pt-6 mt-6 border-t border-primary/5">
              <label className="text-[9px] font-black tracking-widest text-primary/45 uppercase">GHI CHÚ ĐƠN HÀNG</label>
              <textarea
                name="note"
                placeholder="Ghi chú thêm về đơn hàng của bạn..."
                className="bg-secondary p-3.5 text-xs font-semibold focus:ring-1 focus:ring-accent focus:outline-none transition-all placeholder-primary/20 border border-primary/5 rounded-xl w-full"
                rows="3"
                onChange={handleChange}
                value={form.note}
              ></textarea>
            </div>
          </div>

          {/* Product list */}
          <div className="bg-white border border-primary/5 p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-display font-black uppercase tracking-widest mb-6 text-primary pb-3 border-b border-primary/5 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Sản phẩm đang mua
            </h2>

            <div className="divide-y divide-primary/5">
              {product ? (
                // BUY NOW SINGLE PRODUCT
                <div className="flex items-center gap-6 py-6 group animate-fade-in-up">
                  <div className="w-20 aspect-[3/4] bg-secondary overflow-hidden flex-shrink-0 rounded-xl border border-primary/5 shadow-sm transition-transform duration-300 group-hover:scale-102">
                    <img
                      src={product.imageUrlFront}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-black text-sm uppercase tracking-tight text-primary transition-colors group-hover:text-accent">
                      {product.name}
                    </h4>
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-1">
                      {location.state?.selectedSize && `Kích cỡ: ${location.state.selectedSize} | `}
                      Số lượng: <span className="text-primary font-black">{quantity}</span>
                    </p>
                    <p className="text-xs font-black text-accent mt-1.5">
                      {formatVND(product.costPrice || product.price)}
                    </p>
                  </div>
                  <div className="text-right font-display font-black text-sm text-primary tracking-tight">
                    {formatVND((product.costPrice || product.price) * quantity)}
                  </div>
                </div>
              ) : selectedCartItems.length > 0 ? (
                // CART ITEMS LIST
                selectedCartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-6 py-6 group animate-fade-in-up">
                    <div className="w-20 aspect-[3/4] bg-secondary overflow-hidden flex-shrink-0 rounded-xl border border-primary/5 shadow-sm transition-transform duration-300 group-hover:scale-102">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display font-black text-sm uppercase tracking-tight text-primary transition-colors group-hover:text-accent">
                        {item.productName}
                      </h4>
                      <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-1">
                        Kích cỡ: <span className="text-primary font-black">{item.sizeName}</span> | Số lượng: <span className="text-primary font-black">{item.quantity}</span>
                      </p>
                      <p className="text-xs font-black text-accent mt-1.5">
                        {formatVND(item.priceAtTime)}
                      </p>
                    </div>
                    <div className="text-right font-display font-black text-sm text-primary tracking-tight">
                      {formatVND(item.subtotal)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-primary/30 font-bold uppercase tracking-widest text-xs">
                  Không có sản phẩm nào được chọn.
                </div>
              )}
            </div>
          </div>

          {/* Delivery Option */}
          <div className="bg-white border border-primary/5 p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-display font-black uppercase tracking-widest mb-6 text-primary pb-3 border-b border-primary/5 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              Phương thức vận chuyển
            </h2>
            <div className="flex justify-between items-center border border-accent/20 p-5 bg-accent/[0.01] rounded-xl ring-1 ring-accent/10">
              <div className="space-y-1">
                <span className="text-xs font-black tracking-widest uppercase text-primary">Tiêu chuẩn</span>
                <p className="text-[10px] text-primary/50 font-medium">Giao hàng tận nơi từ 3–5 ngày làm việc</p>
              </div>
              <span className="font-display font-black text-sm text-accent">
                {product 
                  ? (buyNowShippingFee === 0 ? "Miễn phí" : formatVND(buyNowShippingFee)) 
                  : (summary.shippingFee === 0 ? "Miễn phí" : formatVND(summary.shippingFee))
                }
              </span>
            </div>
          </div>

          {/* Payment Option */}
          <div className="bg-white border border-primary/5 p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-display font-black uppercase tracking-widest mb-6 text-primary pb-3 border-b border-primary/5 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Phương thức thanh toán
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`flex flex-col p-5 border cursor-pointer transition-all rounded-xl ${
                  payment === "cash"
                    ? "border-accent bg-accent/[0.02] ring-1 ring-accent"
                    : "border-primary/10 bg-secondary hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={payment === "cash"}
                      className="w-4 h-4 accent-accent"
                      onChange={(e) => setPayment(e.target.value)}
                    />
                    <span className="text-xs font-black tracking-widest uppercase text-primary">COD</span>
                  </div>
                  <svg className="w-5 h-5 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-[10px] text-primary/50 mt-2 font-medium">
                  Thanh toán bằng tiền mặt khi nhận hàng.
                </p>
              </label>

              <label
                className={`flex flex-col p-5 border cursor-pointer transition-all rounded-xl ${
                  payment === "bank"
                    ? "border-accent bg-accent/[0.02] ring-1 ring-accent"
                    : "border-primary/10 bg-secondary hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={payment === "bank"}
                      className="w-4 h-4 accent-accent"
                      onChange={(e) => setPayment(e.target.value)}
                    />
                    <span className="text-xs font-black tracking-widest uppercase text-primary">Chuyển khoản</span>
                  </div>
                  <svg className="w-5 h-5 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0a8 8 0 11-16 0 8 8 0 0116 0z" />
                  </svg>
                </div>
                <p className="text-[10px] text-primary/50 mt-2 font-medium">
                  Quét mã QR qua ứng dụng Ngân hàng (SePay).
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY & CONFIRM */}
        <div className="lg:col-span-4 sticky top-24 h-fit">
          <div className="bg-white border border-primary/5 p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-display font-black uppercase tracking-widest mb-6 text-primary pb-3 border-b border-primary/5 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-4 mb-6 text-xs font-bold text-primary/60 uppercase tracking-widest">
              <div className="flex justify-between">
                <span className="font-medium text-primary/45">Tạm tính:</span>
                <span className="font-black text-primary">
                  {formatVND(product ? buyNowSubtotal : summary.subtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-primary/45">Phí vận chuyển:</span>
                <span className="font-black text-primary">
                  {product 
                    ? (buyNowShippingFee === 0 ? "Miễn phí" : formatVND(buyNowShippingFee)) 
                    : (summary.shippingFee === 0 ? "Miễn phí" : formatVND(summary.shippingFee))
                  }
                </span>
              </div>

              <div className="flex justify-between pb-4 border-b border-primary/5">
                <span className="font-medium text-primary/45">Giảm giá:</span>
                <span className="font-black text-accent">
                  {formatVND(product ? 0 : summary.discount)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end font-display font-black text-lg text-primary tracking-tight">
              <span className="text-[10px] font-black tracking-[0.2em] text-primary/40 uppercase mb-1">TỔNG CỘNG:</span>
              <span className="text-xl text-accent font-black">
                {formatVND(product ? buyNowTotal : summary.total)}
              </span>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full mt-8 bg-[#111111] hover:bg-accent text-white py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all rounded-xl shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              Xác nhận đặt hàng
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
