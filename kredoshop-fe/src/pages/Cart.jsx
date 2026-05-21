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
        return {
            subtotal: 0,
            discount: 0,
            shippingFee: 0,
            total: 0,
            shippingText: "Chưa chọn",
            minFreeShipping: 1000000,
        };

    const selectedItems = items.filter((item) => item.selected);
    const subtotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const minFreeShipping = 1000000;
    const standardShippingFee = 0;
    const discount = 0;

    const shippingFee = subtotal >= minFreeShipping ? 0 : standardShippingFee;
    const shippingText = subtotal >= minFreeShipping ? "Miễn phí" : "Chưa chọn";

    const total = subtotal - discount + shippingFee;

    return {
        subtotal,
        discount,
        shippingFee,
        total,
        shippingText,
        minFreeShipping,
    };
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

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            const res = await fetch(`http://localhost:8080/accounts/myinfor`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            console.log("Tài khoản đang login: ", data.result);
            setUser(data.result);
        } catch (error) {
            console.error("Lỗi fetch user", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `http://localhost:8080/carts/account/${user.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            console.log("Cart của user: ", data.result);
            setCart(data.result);
        } catch (error) {
            console.error("Lỗi fetch cart: ", error);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchCart();
        }
    }, [user]);

    const hanldeFetchCart = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `http://localhost:8080/cart-details/cart/${cart.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            console.log("Cart API: ", data);
            const items = Array.isArray(data)
                ? data
                : data.result || data.cartDetails || [];
            setCartItems(items);
        } catch (err) {
            console.error("Lỗi: ", err);
        }
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
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    selected: updatedItems.find((i) => i.id === cartDetailId).selected,
                }),
            });
        } catch (err) {
            console.error("Lỗi update select: ", err);
        }
    };

    useEffect(() => {
        const selectedItems = cartItems.filter((item) => item.selected);
        setSelect(selectedItems);
    }, [cartItems]);

    useEffect(() => {
        console.log("Select state đã cập nhật:", select);
    }, [select]);

    const handleToggleIncrease = async (cartDetailId, priceAtTime) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `http://localhost:8080/cart-details/${cartDetailId}/increase-quantity`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            setCartItems((prev) =>
                prev.map((item) =>
                    item.id === cartDetailId ? { ...item, ...data } : item
                )
            );
            const resCart = await fetch(
                `http://localhost:8080/carts/update/${cart.id}/increase`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ price: priceAtTime }),
                }
            );

            const dataCart = await resCart.json();
            if (resCart.ok) {
                window.dispatchEvent(new Event("cartUpdated"));
            }
            console.log("Update quantity response: ", data);
        } catch (err) {
            console.error("Lỗi update select: ", err);
        }
    };

    const handleToggleDecrease = async (cartDetailId, priceAtTime) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `http://localhost:8080/cart-details/${cartDetailId}/decrease-quantity`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            if (!data || data.quantity === 0) {
                setCartItems((prev) => prev.filter((i) => i.id !== cartDetailId));
                const resCart = await fetch(
                    `http://localhost:8080/carts/update/${cart.id}/decrease`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ price: priceAtTime }),
                    }
                );

                const dataCart = await resCart.json();
                if (resCart.ok) {
                    window.dispatchEvent(new Event("cartUpdated"));
                }
                return;
            }
            setCartItems((prev) =>
                prev.map((item) =>
                    item.id === cartDetailId ? { ...item, ...data } : item
                )
            );
            const resCart = await fetch(
                `http://localhost:8080/carts/update/${cart.id}/decrease`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ price: priceAtTime }),
                }
            );

            const dataCart = await resCart.json();
            if (resCart.ok) {
                window.dispatchEvent(new Event("cartUpdated"));
            }
            console.log("Update quantity response: ", data);
        } catch (err) {
            console.error("Lỗi update select: ", err);
        }
    };

    const handleDelete = async (cartDetailId, quantity, subtotal) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `http://localhost:8080/cart-details/delete/${cartDetailId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.ok) {
                setCartItems(cartItems.filter((item) => item.id !== cartDetailId));
                const resCart = await fetch(
                    `http://localhost:8080/carts/update/${cart.id}/delete`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ price: subtotal, quantity: quantity }),
                    }
                );

                const dataCart = await resCart.json();
                if (resCart.ok) {
                    window.dispatchEvent(new Event("cartUpdated"));
                }
            } else {
                console.error("Delete failed:", res.statusText);
            }
        } catch (err) {
            console.error("Lỗi update select: ", err);
        }
    };

    useEffect(() => {
        if (cart?.id) {
            hanldeFetchCart();
        }
    }, [cart]);

    const summary = calculateSummary(cartItems);

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.warning("Giỏ hàng rỗng!!!");
        } else if (select.length === 0) {
            toast.warning("Vui lòng chọn sản phẩm muốn thanh toán!!!");
        } else {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            navigate("/checkout", {
                state: { userId: user.id, select: select },
            });
        }
    };

    return (
        <div className="min-h-screen bg-secondary py-16 selection:bg-accent selection:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* CART ITEMS LEFT COLUMN */}
                    <div className="lg:col-span-8">
                        <div className="flex justify-between items-end mb-12 pb-6 border-b border-primary/5">
                            <h1 className="text-3xl lg:text-4xl font-display font-black uppercase tracking-tight text-primary">Giỏ hàng của bạn</h1>
                            <span className="text-[10px] font-black tracking-widest text-red-500 uppercase cursor-pointer hover:underline">
                                🔍︎ Theo dõi đơn hàng
                            </span>
                        </div>

                        {/* TABLE HEADER */}
                        <div className="grid grid-cols-12 font-display font-black text-[10px] tracking-[0.25em] border-b border-primary/10 pb-4 text-primary/40 uppercase hidden sm:grid">
                            <div className="col-span-7">SẢN PHẨM</div>
                            <div className="col-span-2 text-center">SỐ LƯỢNG</div>
                            <div className="col-span-2 text-right">ĐƠN GIÁ</div>
                            <div className="col-span-1 text-center"></div>
                        </div>

                        {cartItems.length > 0 ? (
                            <div className="divide-y divide-primary/5">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="grid grid-cols-1 sm:grid-cols-12 items-center py-8 gap-6 sm:gap-0"
                                    >
                                        {/* Product Details info */}
                                        <div className="col-span-12 sm:col-span-7 flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={item.selected}
                                                onChange={() => handleToggleSelect(item.id)}
                                                className="w-4 h-4 border-primary/10 text-primary focus:ring-accent rounded-none cursor-pointer accent-[#111111]"
                                            />

                                            <div className="w-24 aspect-[3/4] bg-secondary overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex flex-col space-y-1">
                                                <div className="font-display font-black text-sm uppercase tracking-tight text-primary hover:text-accent transition-colors">
                                                    {item.productName}
                                                </div>
                                                <div className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">
                                                    Kích cỡ: <span className="text-primary font-black">{item.sizeName}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quantity control */}
                                        <div className="col-span-6 sm:col-span-2 flex justify-start sm:justify-center">
                                            <div className="inline-flex items-center border border-primary/10 h-10 bg-white">
                                                <button
                                                    className="w-8 h-full flex items-center justify-center text-primary/60 hover:text-primary transition-colors text-xs font-bold"
                                                    onClick={() =>
                                                        handleToggleDecrease(item.id, item.priceAtTime)
                                                    }
                                                >
                                                    -
                                                </button>

                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    min="1"
                                                    readOnly
                                                    className="w-8 text-center text-xs font-black text-primary bg-transparent"
                                                />

                                                <button
                                                    className="w-8 h-full flex items-center justify-center text-primary/60 hover:text-primary transition-colors text-xs font-bold"
                                                    onClick={() =>
                                                        handleToggleIncrease(item.id, item.priceAtTime)
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="col-span-5 sm:col-span-2 text-right font-display font-black text-sm text-primary tracking-tight">
                                            {formatVND(item.subtotal)}
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-1 text-right sm:text-center">
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id, item.quantity, item.subtotal)
                                                }
                                                className="text-primary/30 hover:text-accent transition-colors p-2"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white border border-primary/5 my-6">
                                <p className="text-xs font-black text-primary/30 uppercase tracking-widest">
                                    Giỏ hàng của bạn đang trống
                                </p>
                            </div>
                        )}

                        <div className="mt-12">
                            <button
                                onClick={() => navigate("/product")}
                                className="h-12 px-6 border border-primary text-[10px] font-black uppercase tracking-widest text-primary hover:bg-[#111111] hover:text-white transition-colors duration-300"
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    </div>

                    {/* CART SUMMARY RIGHT COLUMN */}
                    <div className="lg:col-span-4 bg-white border border-primary/5 p-8 h-fit">
                        <h2 className="text-xl font-display font-black uppercase tracking-widest mb-8 text-primary pb-3 border-b border-primary/5">Tóm tắt đơn hàng</h2>

                        {/* Coupon Section */}
                        <div className="mb-8">
                            <div className="flex border border-primary/10 bg-secondary">
                                <input
                                    type="text"
                                    placeholder="MÃ GIẢM GIÁ"
                                    className="flex-grow bg-transparent p-3 text-[10px] font-black tracking-widest uppercase focus:outline-none placeholder-primary/20"
                                />
                                <button className="bg-[#111111] hover:bg-accent text-white px-5 text-[9px] font-black tracking-widest uppercase transition-colors">
                                    ÁP DỤNG
                                </button>
                            </div>
                        </div>

                        {/* Calculated numbers */}
                        <div className="space-y-4 mb-8 text-xs font-bold text-primary/60 uppercase tracking-widest">
                            <div className="flex justify-between">
                                <span className="font-medium text-primary/40">Tạm tính:</span>
                                <span className="font-black text-primary">
                                    {formatVND(summary.subtotal)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-primary/40">Phí vận chuyển:</span>
                                <span className="font-black text-primary">{summary.shippingText}</span>
                            </div>
                            <div className="flex justify-between pb-4 border-b border-primary/5">
                                <span className="font-medium text-primary/40">Giảm giá:</span>
                                <span className="font-black text-accent">{formatVND(summary.discount)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end font-display font-black text-lg text-primary tracking-tight">
                            <span className="text-[10px] font-black tracking-[0.2em] text-primary/40 uppercase mb-1">TỔNG CỘNG:</span>
                            <span className="text-xl text-accent font-black">{formatVND(summary.total)}</span>
                        </div>

                        <button
                          onClick={handleCheckout}
                          className="w-full mt-8 bg-[#111111] hover:bg-accent text-white py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-colors shadow-md active:scale-98"
                        >
                            Tiến hành thanh toán
                        </button>
                    </div>
                </div>
            </div>
            <ChatBot />
            <Contact />
        </div>
    );
};

export default Cart;
