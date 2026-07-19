// ProductCard.jsx - Custom luxury hover transitions, back-image swaps, and floating size indicators.
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import WishlistSelectorModal from "./WishListSelector";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = {
  async get(url) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Lỗi mạng");
    return data;
  },
};

const ProductCard = ({
  product,
  isHot = false,
  isNew = false,
  viewMode = "grid",
}) => {
  const navigate = useNavigate();
  const [isInAnyWishlist, setIsInAnyWishlist] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.imageUrlFront);

  // Sync image source if product changes
  useEffect(() => {
    setImageSrc(product.imageUrlFront);
  }, [product.imageUrlFront]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (!product.discountAmount || product.discountAmount <= 0) return 0;
    if (product.discountAmount > 100) {
      return Math.round((product.discountAmount / (product.price + product.discountAmount)) * 100);
    }
    return Math.round(product.discountAmount);
  };

  const getPrices = () => {
    const hasDiscount = product.discountAmount > 0;
    if (!hasDiscount) {
      return { currentPrice: product.price, originalPrice: null };
    }
    if (product.discountAmount > 100) {
      return {
        currentPrice: product.price,
        originalPrice: product.price + product.discountAmount
      };
    } else {
      return {
        currentPrice: product.costPrice || product.price,
        originalPrice: product.price
      };
    }
  };

  const isSoldOut = product.quantity === 0;

  const goToDetail = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const checkWishlistStatus = async () => {
    try {
      setLoadingStatus(true);
      const data = await api.get(
        `/wishlists/products/${product.id}/in-wishlist`
      );
      setIsInAnyWishlist(data.result === true);
    } catch (err) {
      setIsInAnyWishlist(false);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    checkWishlistStatus();
  }, [product.id]);

  const openWishlistModal = (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
    setShowWishlistModal(true);
  };

  const closeWishlistModal = () => {
    setShowWishlistModal(false);
    checkWishlistStatus();
  };

  const handleMouseEnter = () => {
    if (product.imageUrlBack && product.imageUrlBack !== product.imageUrlFront) {
      setImageSrc(product.imageUrlBack);
    }
  };

  const handleMouseLeave = () => {
    setImageSrc(product.imageUrlFront);
  };

  // Lấy các size khả dụng của sản phẩm
  const availableSizes = product.sizeDetails
    ? product.sizeDetails.filter((sd) => sd.quantity > 0).map((sd) => sd.sizeName)
    : [];

  // LIST VIEW
  if (viewMode === "list") {
    return (
      <>
        <div
          className={`bg-white rounded-none border border-primary/5 hover:border-primary/20 transition-all duration-500 group cursor-pointer relative flex gap-6 p-5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.02)] ${
            isSoldOut ? "opacity-60 grayscale-[40%]" : ""
          }`}
          onClick={goToDetail}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* IMAGE LEFT */}
          <div className="relative overflow-hidden w-48 h-48 flex-shrink-0 bg-secondary">
            <img
              src={imageSrc}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                isSoldOut ? "blur-[1px] opacity-75" : ""
              }`}
            />

            {/* SOLD OUT */}
            {isSoldOut && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                <div className="bg-white text-primary px-4 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase shadow-lg">
                  HẾT HÀNG
                </div>
              </div>
            )}

            {/* DISCOUNT TAG */}
            {!isSoldOut && getDiscountPercentage() > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-[9px] font-black tracking-widest uppercase">
                -{getDiscountPercentage()}%
              </div>
            )}

            {/* Sizes overlay on hover */}
            {!isSoldOut && availableSizes.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-[2px] py-2 px-1 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 border-t border-primary/5">
                <p className="text-[8px] font-black text-primary/40 uppercase tracking-widest mb-1">Kích cỡ sẵn có</p>
                <div className="flex justify-center gap-1.5 flex-wrap">
                  {availableSizes.map((size) => (
                    <span key={size} className="text-[9px] font-black text-primary border border-primary/10 px-1.5 py-0.5 bg-secondary uppercase">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BADGES */}
          {isHot && !isSoldOut && (
            <div className="absolute top-5 right-5 bg-accent text-white px-2.5 py-1 text-[8px] font-black tracking-[0.2em] uppercase shadow-md flex items-center gap-1 z-10">
              🔥 HOT
            </div>
          )}

          {!isHot && isNew && !isSoldOut && (
            <div className="absolute top-5 right-5 bg-[#111111] text-[#fbfbf9] px-2.5 py-1 text-[8px] font-black tracking-[0.2em] uppercase shadow-md z-10">
              ✨ MỚI
            </div>
          )}

          {/* INFO RIGHT */}
          <div className="flex-1 flex flex-col justify-between py-1">
            <div>
              <h3 className="font-display font-black text-lg tracking-tight uppercase mb-2 group-hover:text-accent transition-colors line-clamp-2">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating || 4.5)
                          ? "text-accent"
                          : "text-primary/10"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[11px] text-primary/40 font-bold">
                  ({product.rating || 4.5})
                </span>
              </div>
            </div>

            {/* PRICE + BUTTONS */}
            <div className="flex items-center justify-between pt-4 border-t border-primary/5">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-display font-black text-accent tracking-tight">
                  {formatPrice(getPrices().currentPrice)}
                </span>
                {!isSoldOut && getPrices().originalPrice && (
                  <span className="text-xs text-primary/30 line-through font-medium">
                    {formatPrice(getPrices().originalPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* LIKE */}
                <button
                  onClick={openWishlistModal}
                  disabled={loadingStatus}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border
                    ${
                      loadingStatus
                        ? "opacity-60 cursor-wait"
                        : "hover:scale-105 active:scale-95"
                    }
                    ${
                      isInAnyWishlist
                        ? "bg-accent border-accent text-white shadow-md shadow-accent/15"
                        : "bg-white border-primary/10 text-primary/60 hover:border-accent hover:text-accent"
                    }
                  `}
                >
                  <Heart
                    size={16}
                    fill={isInAnyWishlist ? "currentColor" : "none"}
                    strokeWidth={2}
                  />
                </button>

                {/* VIEW DETAIL */}
                <button
                  onClick={goToDetail}
                  className="px-6 h-10 text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-accent text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* WISHLIST SELECTOR MODAL */}
        {showWishlistModal && (
          <WishlistSelectorModal
            productId={product.id}
            isOpen={showWishlistModal}
            onClose={closeWishlistModal}
            onSuccess={checkWishlistStatus}
          />
        )}
      </>
    );
  }

  // GRID VIEW
  return (
    <>
      <div
        className={`bg-white rounded-none border border-primary/5 hover:border-primary/20 transition-all duration-500 group cursor-pointer relative hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.03)] flex flex-col h-full ${
          isSoldOut ? "opacity-60 grayscale-[40%]" : ""
        }`}
        onClick={goToDetail}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* IMAGE */}
        <div className="relative overflow-hidden aspect-[3/4] bg-secondary flex-shrink-0">
          <img
            src={imageSrc}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              isSoldOut ? "blur-[1px] opacity-75" : ""
            }`}
          />

          {/* SOLD OUT */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <div className="bg-white text-primary px-5 py-2 text-[9px] font-black tracking-[0.2em] uppercase shadow-lg">
                HẾT HÀNG
              </div>
            </div>
          )}

          {/* DISCOUNT */}
          {!isSoldOut && getDiscountPercentage() > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-[9px] font-black tracking-widest uppercase z-10">
              -{getDiscountPercentage()}%
            </div>
          )}

          {/* HOT */}
          {isHot && !isSoldOut && (
            <div className="absolute top-3 right-3 bg-accent text-white px-2.5 py-1 text-[8px] font-black tracking-[0.2em] uppercase shadow-md flex items-center gap-1 z-10">
              🔥 HOT
            </div>
          )}

          {/* NEW */}
          {!isHot && isNew && !isSoldOut && (
            <div className="absolute top-3 right-3 bg-[#111111] text-[#fbfbf9] px-2.5 py-1 text-[8px] font-black tracking-[0.2em] uppercase shadow-md z-10">
              ✨ MỚI
            </div>
          )}

          {/* Sizes overlay on hover */}
          {!isSoldOut && availableSizes.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-[2px] py-3 px-2 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 border-t border-primary/5">
              <p className="text-[8px] font-black text-primary/40 uppercase tracking-widest mb-1.5">Kích cỡ sẵn có</p>
              <div className="flex justify-center gap-1.5 flex-wrap">
                {availableSizes.map((size) => (
                  <span key={size} className="text-[9px] font-black text-primary border border-primary/10 px-2 py-0.5 bg-secondary uppercase hover:bg-accent hover:text-white hover:border-transparent transition-colors">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* WISHLIST BUTTON FLOATING */}
          <div className="absolute bottom-3 right-3 z-20">
            <button
              onClick={openWishlistModal}
              disabled={loadingStatus}
              className={`
                w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border
                ${
                  loadingStatus
                    ? "opacity-60 cursor-wait"
                    : "hover:scale-105 active:scale-95"
                }
                ${
                  isInAnyWishlist
                    ? "bg-accent border-accent text-white opacity-100 shadow-accent/20"
                    : "bg-white border-primary/5 text-primary/60 hover:text-accent hover:border-accent opacity-0 group-hover:opacity-100"
                }
              `}
            >
              <Heart
                size={14}
                fill={isInAnyWishlist ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>

        {/* INFO */}
        <div className="p-5 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-display font-black text-sm tracking-tight uppercase mb-2 group-hover:text-accent transition-colors line-clamp-2 h-10">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating || 4.5)
                        ? "text-accent"
                        : "text-primary/10"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] text-primary/40 font-bold">
                ({product.rating || 4.5})
              </span>
            </div>
          </div>

          {/* Pricing + Cart Button */}
          <div className="flex items-center justify-between pt-3 border-t border-primary/5">
            <div>
              <p className="text-base font-display font-black text-accent tracking-tight">
                {formatPrice(getPrices().currentPrice)}
              </p>
              {!isSoldOut && getPrices().originalPrice && (
                <p className="text-xs text-primary/30 line-through font-medium">
                  {formatPrice(getPrices().originalPrice)}
                </p>
              )}
            </div>

            {/* Shopping Cart Trigger */}
            <button
              onClick={goToDetail}
              className="w-9 h-9 bg-primary hover:bg-accent text-white transition-all duration-300 flex items-center justify-center shadow-md active:scale-95"
            >
              <ShoppingCart size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* WISHLIST SELECTOR */}
      {showWishlistModal && (
        <WishlistSelectorModal
          productId={product.id}
          isOpen={showWishlistModal}
          onClose={closeWishlistModal}
          onSuccess={checkWishlistStatus}
        />
      )}
    </>
  );
};

export default ProductCard;
