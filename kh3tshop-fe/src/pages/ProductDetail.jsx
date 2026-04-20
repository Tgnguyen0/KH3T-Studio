import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
  CreditCard,
  X,
  ZoomIn,
  Minus,
  Plus,
  GitCompare,
  ShoppingBag,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { toast } from "sonner";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";

// --- GLOBAL UTILS FOR COMPARE LIST ---
const getCompareList = () => {
  const list = localStorage.getItem("compareList");
  return list ? JSON.parse(list) : [];
};

const setCompareList = (list) => {
  localStorage.setItem("compareList", JSON.stringify(list));
};
// ------------------------------------

// --- COMPARISON BAR COMPONENT ---
// Component hiển thị thanh so sánh cố định ở cuối trang
const CompareBar = ({ compareList, setCompareListState, formatPrice }) => {
  if (compareList.length === 0) return null;

  // Hàm loại bỏ sản phẩm khỏi danh sách
  const handleRemoveProduct = (productId, productName) => {
    const newList = compareList.filter((p) => p.id !== productId);
    setCompareList(newList); // Cập nhật localStorage
    setCompareListState(newList); // Cập nhật state
    toast.info(`${productName} removed from Compare List.`);
  };

  // Tạo URL cho trang so sánh
  const compareUrl = `/compare?ids=${compareList.map((p) => p.id).join(",")}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 p-4 transition-transform duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LEFT: Product List */}
        <div className="flex items-center space-x-4 overflow-x-auto p-2">
          {compareList.map((p) => (
            <div
              key={p.id}
              className="relative flex-shrink-0 w-32 bg-gray-50 p-2 rounded-lg border border-gray-200"
            >
              {/* Product Image and Name */}
              <Link
                to={`/product/${p.id}`}
                className="block text-center hover:opacity-80 transition-opacity"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-20 object-contain mx-auto mb-1 rounded"
                />
                <p className="text-xs font-medium truncate">{p.name}</p>
                <p className="text-sm font-bold text-red-500">
                  {formatPrice(p.discount_amount || p.price)}
                </p>
              </Link>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveProduct(p.id, p.name)}
                className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {/* Placeholders for remaining slots */}
          {Array(4 - compareList.length)
            .fill(0)
            .map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="flex-shrink-0 w-32 h-36 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 text-sm p-2"
              >
                <Plus size={20} className="mb-1" />
                Add product
              </div>
            ))}
        </div>

        {/* RIGHT: Status and Action Button */}
        <div className="flex-shrink-0 ml-4 space-y-2 text-center">
          <p className="text-sm font-semibold text-gray-700 whitespace-nowrap">
            {compareList.length} / 4 Products selected
          </p>
          <p className="text-xs text-gray-500 italic">
            Select 2-4 products to compare
          </p>
          <Link
            to={compareUrl}
            onClick={() => {
              if (compareList.length < 2) {
                toast.warning("Please select at least 2 products to compare.");
                return false; // Ngăn chặn điều hướng nếu < 2
              }
            }}
            className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-all ${
              compareList.length >= 2
                ? "bg-green-600 hover:bg-green-700 shadow-md"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            style={{ pointerEvents: compareList.length >= 2 ? "auto" : "none" }}
          >
            <GitCompare size={20} /> Compare ({compareList.length})
          </Link>
        </div>
      </div>
    </div>
  );
};
// ------------------------------------

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [otherProducts, setOtherProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [currentImage, setCurrentImage] = useState("front");
  const [zoomImage, setZoomImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const [compareList, setCompareListState] = useState(getCompareList());

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
    window.scrollTo(0, 0);
  }, [id]);

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          // Dữ liệu SoldQuantity được lấy trực tiếp từ data.result (ProductResponse)
          setProduct(data.result || null);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchOtherProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        if (response.ok) {
          const data = await response.json();
          let products = data.result || [];

          products.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
          products = products.filter((p) => p.id !== parseInt(id)).slice(0, 4);
          setOtherProducts(products);
        }
      } catch (error) {
        console.error("Error fetching other products:", error);
      }
    };
    fetchOtherProducts();
  }, [id]);

  const formatPrice = (price) => {
    // Đảm bảo giá là một số hợp lệ
    const numericPrice =
      typeof price === "number" && isFinite(price) ? price : 0;

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericPrice);
  };

  const handleAddToCart = async () => {
    // BỔ SUNG: Kiểm tra Sold Out
    if (isSoldOut) {
      return toast.error("This product is currently sold out.");
    }

    // Kiểm tra xem có size nào khả dụng không
    const hasSizes = uniqueSizes.length > 0;

    if (hasSizes && !selectedSize) {
      return toast.warning("Please select a size");
    }

    if (!user?.id) {
      toast.warning("Vui lòng đăng nhập trước khi thêm vào giỏ hàng");
      return toast.warning("Please Log in before add to cart");
    }
    if (quantity < 1) return toast.warning("Quantity must be at least 1");

    setIsAddedToCart(true);
    toast.success("Added items, check your Cart!");
    setTimeout(() => setIsAddedToCart(false), 2000);

    try {
      const token = localStorage.getItem("accessToken");

      // Lấy sizeDetailId dựa trên selectedSize (sizeName)
      let sizeDetailId = null;
      if (hasSizes && selectedSize) {
        // Tìm sizeDetail có sizeName trùng với selectedSize
        const sizeDetail = uniqueSizes.find(
          (size) => size.sizeName === selectedSize
        );
        // Lưu ý: uniqueSizes đã được gộp quantity, sizeDetailId là id của 1 trong các sizeDetails
        // Giả định backend có thể xử lý việc này nếu chỉ gửi sizeName hoặc productId + sizeName
        // Nếu backend yêu cầu sizeDetailId cụ thể, cần fetch size detail dựa trên productId và sizeName

        // **GIẢI QUYẾT CONFLICT:** Giữ lại logic tìm sizeDetailId chi tiết từ nhánh khác
        const resSize = await fetch(
          `http://localhost:8080/sizes/${selectedSize}`, // Giả định selectedSize là tên (S, M, L, XL)
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const size = await resSize.json();
        const sizeIdToFind = size.id;
        const productIdToFind = parseInt(id);
        const resSizeDatail = await fetch(
          `http://localhost:8080/size-details/find?productId=${productIdToFind}&sizeId=${sizeIdToFind}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sizeDetailResponse = await resSizeDatail.json();
        sizeDetailId = sizeDetailResponse.id; // Lấy sizeDetailId
      }

      const dataSend = {
        productId: parseInt(id),
        cartId: cart.id,
        quantity: quantity,
        // Chỉ thêm sizeDetailId nếu có size được chọn. Nếu không cần, backend sẽ tự xác định.
        // Cần đảm bảo backend xử lý được cả 2 trường hợp (có sizeDetailId hoặc không)
        ...(sizeDetailId && { sizeDetailId: sizeDetailId }),
      };

      const res = await fetch(
        `http://localhost:8080/cart-details/add-to-cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataSend),
        }
      );

      // **GIẢI QUYẾT CONFLICT:** Giữ lại logic cập nhật cart totalAmount
      const cartRequest = {
        quantity: parseInt(quantity),
        totalAmount: product.costPrice, // Dùng costPrice (giá sale)
      };

      const resCart = await fetch(
        `http://localhost:8080/carts/update/${cart.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cartRequest),
        }
      );
      if (resCart.ok) {
        // Kích hoạt sự kiện để thông báo cập nhật giỏ hàng (ví dụ cho header cart icon)
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.log("Lỗi thêm vào cart: ", error);
      toast.error("Failed to add to cart.");
    }
  };

  const handleBuyNow = () => {
    // BỔ SUNG: Kiểm tra Sold Out
    if (isSoldOut) {
      return toast.error("This product is currently sold out.");
    }

    const hasSizes = uniqueSizes.length > 0;
    if (hasSizes && !selectedSize) {
      return toast.warning("Please select a size");
    }
    if (quantity < 1) return toast.warning("Quantity must be at least 1");
    navigate("/checkout", {
      state: { userId: user.id, product: product, quantity: quantity },
    });
  };

  const handleZoom = (imageType) => {
    setZoomImage(
      imageType === "front" ? product.imageUrlFront : product.imageUrlBack
    );
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const changeQuantity = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    setZoomLevel((prev) => Math.max(1, Math.min(prev + delta, 5)));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (moveE) => {
      setPosition({
        x: moveE.clientX - startX,
        y: moveE.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleCompare = () => {
    // Đảm bảo product đã load xong
    if (!product) return;

    const currentProductInList = compareList.find((p) => p.id === product.id);
    const newProductData = {
      id: product.id,
      name: product.name,
      price: product.price,
      discount_amount: product.costPrice, // Sử dụng costPrice là giá đã giảm (sale price)
      imageUrl: product.imageUrlFront, // Lấy ảnh front để hiển thị
    };

    if (currentProductInList) {
      // Nếu đã có trong danh sách -> Xóa (Toggle off)
      const newList = compareList.filter((p) => p.id !== product.id);
      setCompareList(newList);
      setCompareListState(newList);
      toast.info(`${product.name} removed from Compare List.`);
    } else {
      // Nếu chưa có trong danh sách -> Thêm vào (Toggle on)
      if (compareList.length < 4) {
        const newList = [...compareList, newProductData];
        setCompareList(newList);
        setCompareListState(newList);
        toast.success(
          `${product.name} added to Compare List (${newList.length}/4).`
        );
      } else {
        toast.error("Maximum 4 products allowed for comparison.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-bold text-gray-700 mb-2">
          {error || "Product not found"}
        </h3>
        <Link to="/product" className="text-red-500 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const uniqueSizes = [];
  const sizeMap = new Map();

  product.sizeDetails?.forEach((size) => {
    if (sizeMap.has(size.sizeName)) {
      const existing = sizeMap.get(size.sizeName);
      existing.quantity += size.quantity;
    } else {
      sizeMap.set(size.sizeName, { ...size });
    }
  });

  sizeMap.forEach((value) => uniqueSizes.push(value));
  uniqueSizes.sort((a, b) => {
    const order = ["S", "M", "L", "XL"];
    return order.indexOf(a.sizeName) - order.indexOf(b.sizeName);
  });

  // LOGIC SOLD OUT: Tính tổng tồn kho và xác định Sold Out
  const totalStock = uniqueSizes.reduce((sum, size) => sum + size.quantity, 0);
  const isSoldOut = totalStock === 0;

  const isComparing = compareList.some((p) => p.id === product.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* IMAGE SECTION */}
          <div className="bg-white rounded-xl shadow-md p-6 relative">
            <div className="relative group">
              {/* BỔ SUNG: Tag Sold Out */}
              {isSoldOut && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                  <div className="bg-red-600 text-white px-8 py-3 rounded-full text-xl font-bold tracking-wider shadow-2xl border-4 border-white transform -rotate-12 opacity-90">
                    SOLD OUT
                  </div>
                </div>
              )}

              <div className="flex justify-center mt-4 gap-2">
                <button
                  onClick={() => setCurrentImage("front")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    currentImage === "front"
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => setCurrentImage("back")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    currentImage === "back"
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  Back
                </button>
              </div>

              {/* COMPARE BUTTON */}
              <button
                onClick={handleCompare}
                className={`absolute top-0 left-0 flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all z-10 ${
                  isComparing
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-black text-white border border-white"
                }`}
              >
                <GitCompare size={16} />{" "}
                {isComparing ? "Comparing" : "Add to Compare"}
              </button>
              {/* END COMPARE BUTTON */}

              <img
                src={
                  currentImage === "front"
                    ? product.imageUrlFront
                    : product.imageUrlBack
                }
                alt={product.name}
                className="w-140 h-140 rounded-lg object-cover cursor-pointer"
                onClick={() => handleZoom(currentImage)}
              />

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={24} className="text-gray-600" />
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
            {/* PRICE SECTION */}
            <div className="flex items-center gap-3 mb-4">
              {/* Giá sale (Giá sau khi giảm) */}
              <span className="text-3xl font-bold text-red-500">
                {formatPrice(product.costPrice)}
              </span>
              {!isSoldOut && product.discountAmount > 0 && (
                <p className="text-sm text-gray-400 line-through">
                  {formatPrice(product.price)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 mb-6 text-gray-600">
              <ShoppingBag size={20} className="text-red-500" />
              <span className="font-semibold">Sold:</span>
              <span className="font-bold text-red-600">
                {(product.soldQuantity || 0).toLocaleString("en-US")} products
              </span>
            </div>
            <div className="flex items-center mb-4">
              <Star className="text-yellow-400" size={20} />
              <span className="ml-1 font-medium">
                {product.rating || "N/A"}
              </span>
            </div>
            {/* SIZE SELECT */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Select Size</h3>
              <div className="flex gap-2 flex-wrap">
                {uniqueSizes.map((size) => (
                  <button
                    key={size.sizeName}
                    onClick={() => setSelectedSize(size.sizeName)}
                    disabled={size.quantity <= 0}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedSize === size.sizeName
                        ? "bg-red-500 text-white border-red-500"
                        : "border-gray-300 hover:bg-gray-100"
                    } ${
                      size.quantity <= 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {size.sizeName}
                  </button>
                ))}
                {uniqueSizes.length === 0 && <p>No sizes available</p>}
              </div>
            </div>
            {/* QUANTITY */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeQuantity(-1)}
                  disabled={isSoldOut} // Disable quantity change if sold out
                  className={`p-2 border border-gray-300 rounded-lg ${
                    isSoldOut ? "opacity-50" : "hover:bg-gray-100"
                  }`}
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => changeQuantity(1)}
                  disabled={isSoldOut} // Disable quantity change if sold out
                  className={`p-2 border border-gray-300 rounded-lg ${
                    isSoldOut ? "opacity-50" : "hover:bg-gray-100"
                  }`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={isSoldOut} // FIX: Vô hiệu hóa nếu hết hàng
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 shadow-md ${
                  isSoldOut
                    ? "bg-gray-400 text-white cursor-not-allowed" // Style khi disabled
                    : "bg-white text-black hover:bg-black hover:text-white hover:shadow-lg"
                }`}
              >
                <ShoppingCart size={20} />{" "}
                {isSoldOut
                  ? "Sold Out"
                  : isAddedToCart
                  ? "Added"
                  : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isSoldOut} // FIX: Vô hiệu hóa nếu hết hàng
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 shadow-md ${
                  isSoldOut
                    ? "bg-gray-400 text-white cursor-not-allowed" // Style khi disabled
                    : "bg-black text-white hover:bg-green-600 hover:shadow-lg"
                }`}
              >
                <CreditCard size={20} /> Buy Now
              </button>
            </div>
            {/* DESCRIPTION */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Description</h3>
              <p className="text-gray-600">{product.description}</p>

              <h3 className="font-bold text-lg">Details</h3>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Form: {product.form}</li>
                <li>Material: {product.material}</li>
                <li>Unit: {product.unit}</li>
              </ul>

              <h3 className="font-bold text-lg">Size Chart</h3>
              <img
                src={product.category?.imageUrl}
                alt="Size Chart"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <ChatBot /> {/* Giữ lại ChatBot ở đây */}
            <Contact />
          </div>
        </div>

        {/* YOU MAY ALSO LIKE */}
        {otherProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ZOOM MODAL */}
      {zoomImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-hidden transition-opacity duration-300 ease-in-out">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              ref={imageRef}
              src={zoomImage}
              alt="Zoomed product"
              className="rounded-lg cursor-grab transition-transform duration-200 ease-in-out"
              style={{
                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                maxHeight: "90vh",
                objectFit: "contain",
              }}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
            />

            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              <X size={24} className="text-gray-800" />
            </button>
          </div>
        </div>
      )}

      {/* COMPARISON BAR - Đặt ở cuối cùng để hiển thị fixed */}
      <CompareBar
        compareList={compareList}
        setCompareListState={setCompareListState}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default ProductDetail;
