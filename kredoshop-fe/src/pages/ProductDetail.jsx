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
  ShoppingBag,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { toast } from "sonner";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";



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

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/accounts/myinfor`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("Tài khoản đang login: ", data.result);
      setUser(data.result);
      if (data.result && data.result.id) {
        localStorage.setItem("userId", data.result.id);
        localStorage.setItem("user", JSON.stringify(data.result));
      }
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
        `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/carts/account/${user.id}`,
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
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          // Dữ liệu SoldQuantity được lấy trực tiếp từ data.result (ProductResponse)
          setProduct(data.result || null);
        } else {
          setError("Không tìm thấy sản phẩm");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Lỗi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchOtherProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/products`);
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
    if (isSoldOut) {
      return toast.error("Sản phẩm này hiện đang hết hàng.");
    }

    // Kiểm tra xem có size nào khả dụng không
    const uniqueSizes = [];
    const sizeMap = new Map();
    product?.sizeDetails?.forEach((size) => {
      if (sizeMap.has(size.sizeName)) {
        const existing = sizeMap.get(size.sizeName);
        existing.quantity += size.quantity;
      } else {
        sizeMap.set(size.sizeName, { ...size });
      }
    });
    sizeMap.forEach((value) => uniqueSizes.push(value));

    const hasSizes = uniqueSizes.length > 0;

    if (hasSizes && !selectedSize) {
      return toast.warning("Vui lòng chọn kích cỡ");
    }

    if (!user?.id) {
      return toast.warning("Vui lòng đăng nhập trước khi thêm vào giỏ hàng");
    }
    
    if (quantity < 1) return toast.warning("Số lượng phải ít nhất là 1");

    setIsAddedToCart(true);
    toast.success("Đã thêm vào giỏ hàng!");
    setTimeout(() => setIsAddedToCart(false), 2000);

    try {
      const token = localStorage.getItem("accessToken");

      // Lấy sizeDetailId từ product.sizeDetails
      let sizeDetailId = null;
      if (hasSizes && selectedSize) {
        // Tìm sizeDetail có sizeName trùng với selectedSize và có số lượng > 0
        const sizeDetail = product.sizeDetails.find(
          (sd) => sd.sizeName === selectedSize && sd.quantity > 0
        );
        
        if (sizeDetail) {
          sizeDetailId = sizeDetail.id;
        } else {
          // Nếu không tìm thấy cái nào có số lượng > 0, lấy cái đầu tiên trùng tên (để backend báo hết hàng nếu cần)
          const fallbackSize = product.sizeDetails.find(sd => sd.sizeName === selectedSize);
          sizeDetailId = fallbackSize?.id;
        }
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
        `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/cart-details/add-to-cart`,
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
        `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/carts/update/${cart.id}`,
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
      toast.error("Không thể thêm vào giỏ hàng.");
    }
  };

  const handleBuyNow = () => {
    if (isSoldOut) {
      return toast.error("Sản phẩm này hiện đang hết hàng.");
    }

    const hasSizes = uniqueSizes.length > 0;
    if (hasSizes && !selectedSize) {
      return toast.warning("Vui lòng chọn kích cỡ");
    }
    if (quantity < 1) return toast.warning("Số lượng tối thiểu là 1");
    navigate("/checkout", {
      state: { 
        userId: user.id, 
        product: product, 
        quantity: quantity,
        selectedSize: selectedSize 
      },
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
          {error || "Không tìm thấy sản phẩm"}
        </h3>
        <Link to="/product" className="text-red-500 hover:underline">
          Quay lại trang sản phẩm
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
    const aNum = parseFloat(a.sizeName);
    const bNum = parseFloat(b.sizeName);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    const order = ["S", "M", "L", "XL"];
    return order.indexOf(a.sizeName) - order.indexOf(b.sizeName);
  });

  // LOGIC SOLD OUT: Tính tổng tồn kho và xác định Sold Out
  const totalStock = uniqueSizes.reduce((sum, size) => sum + size.quantity, 0);
  const isSoldOut = totalStock === 0;

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



  const renderSizeChart = () => {
    if (!product || !product.sizeDetails || product.sizeDetails.length === 0) return null;

    // Get unique size names for the product
    const productSizes = Array.from(new Set(product.sizeDetails.map(sd => sd.sizeName.trim().toUpperCase())));
    
    // Sort sizes logically: letters S, M, L, XL, XXL first, then numbers
    const sizeOrder = ["S", "M", "L", "XL", "XXL", "3XL", "ONESIZE"];
    productSizes.sort((a, b) => {
      const idxA = sizeOrder.indexOf(a);
      const idxB = sizeOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      
      // Numeric sort
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });

    const categoryId = product.category?.id;
    const productNameLower = (product.name || "").toLowerCase();

    // Determine type: 1 = Top, 2 = Bottom, 4 = Shoes, 3 = Accessories
    let type = 3; // default Accessories
    if (categoryId === 1 || productNameLower.includes("áo") || productNameLower.includes("polo") || productNameLower.includes("sơ mi") || productNameLower.includes("thun") || productNameLower.includes("khoác") || productNameLower.includes("hoodie") || productNameLower.includes("sweater")) {
      type = 1;
    } else if (categoryId === 2 || productNameLower.includes("quần") || productNameLower.includes("jean") || productNameLower.includes("short") || productNameLower.includes("jogger")) {
      type = 2;
    } else if (categoryId === 4 || productNameLower.includes("giày") || productNameLower.includes("dép") || productNameLower.includes("sandal") || productNameLower.includes("sneaker")) {
      type = 4;
    }

    if (type === 1) {
      // Tops
      const specs = {
        "S": { chest: "92 cm", length: "68 cm", shoulder: "42 cm", height: "1m50 - 1m60", weight: "45 - 53 kg" },
        "M": { chest: "98 cm", length: "70 cm", shoulder: "44 cm", height: "1m60 - 1m70", weight: "54 - 62 kg" },
        "L": { chest: "104 cm", length: "72 cm", shoulder: "46 cm", height: "1m70 - 1m75", weight: "63 - 72 kg" },
        "XL": { chest: "110 cm", length: "74 cm", shoulder: "48 cm", height: "1m75 - 1m80", weight: "73 - 82 kg" },
        "XXL": { chest: "116 cm", length: "76 cm", shoulder: "50 cm", height: "1m80 - 1m85", weight: "83 - 90 kg" },
        "3XL": { chest: "122 cm", length: "78 cm", shoulder: "52 cm", height: "1m85 - 1m90", weight: "91 - 100 kg" }
      };

      return (
        <div className="mt-6">
          <h3 className="font-display font-black text-[11px] tracking-widest uppercase mb-3 text-primary">
            Bảng thông số size (Áo)
          </h3>
          <div className="border border-primary/5 bg-[#fafbf9] rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-primary/[0.03] border-b border-primary/5 font-bold uppercase tracking-wider text-primary/50">
                  <th className="p-3">Kích cỡ</th>
                  <th className="p-3">Vòng ngực</th>
                  <th className="p-3">Chiều dài</th>
                  <th className="p-3">Rộng vai</th>
                  <th className="p-3">Chiều cao</th>
                  <th className="p-3">Cân nặng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 text-primary/70 font-medium">
                {productSizes.map((size) => {
                  const spec = specs[size] || {
                    chest: "Co giãn tốt",
                    length: "Tiêu chuẩn",
                    shoulder: "Tiêu chuẩn",
                    height: "Phù hợp nhiều phom dáng",
                    weight: "Phù hợp nhiều phom dáng"
                  };
                  const isSelected = selectedSize === size;
                  return (
                    <tr 
                      key={size} 
                      className={`transition-colors ${
                        isSelected 
                          ? "bg-accent/10 text-accent font-bold" 
                          : "hover:bg-primary/[0.01]"
                      }`}
                    >
                      <td className={`p-3 font-bold ${isSelected ? "text-accent" : "text-primary"}`}>{size}</td>
                      <td className="p-3">{spec.chest}</td>
                      <td className="p-3">{spec.length}</td>
                      <td className="p-3">{spec.shoulder}</td>
                      <td className="p-3">{spec.height}</td>
                      <td className="p-3">{spec.weight}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <span className="text-[10px] text-primary/30 mt-2 block font-medium italic">
            * Các số đo trên mang tính chất tham khảo. Vui lòng liên hệ hỗ trợ nếu cần tư vấn chi tiết hơn.
          </span>
        </div>
      );
    }

    if (type === 2) {
      // Bottoms
      const specsLetter = {
        "S": { waist: "72 cm", hips: "90 cm", length: "94 cm", height: "1m50 - 1m60", weight: "45 - 53 kg" },
        "M": { waist: "76 cm", hips: "94 cm", length: "96 cm", height: "1m60 - 1m70", weight: "54 - 62 kg" },
        "L": { waist: "80 cm", hips: "98 cm", length: "98 cm", height: "1m70 - 1m75", weight: "63 - 72 kg" },
        "XL": { waist: "84 cm", hips: "102 cm", length: "100 cm", height: "1m75 - 1m80", weight: "73 - 82 kg" },
        "XXL": { waist: "88 cm", hips: "106 cm", length: "102 cm", height: "1m80 - 1m85", weight: "83 - 90 kg" }
      };

      const getNumericSpec = (sizeStr) => {
        const size = parseInt(sizeStr, 10);
        if (isNaN(size)) return null;
        const waist = 70 + (size - 28) * 2;
        const hips = 88 + (size - 28) * 2;
        const thigh = 50 + (size - 28) * 1;
        const length = 90 + Math.floor((size - 28) / 2);
        return {
          waist: `${waist} - ${waist + 2} cm`,
          hips: `${hips} - ${hips + 2} cm`,
          thigh: `${thigh} cm`,
          length: `${length} cm`
        };
      };

      const isNumeric = productSizes.some(s => !isNaN(parseInt(s, 10)));

      return (
        <div className="mt-6">
          <h3 className="font-display font-black text-[11px] tracking-widest uppercase mb-3 text-primary">
            Bảng thông số size (Quần)
          </h3>
          <div className="border border-primary/5 bg-[#fafbf9] rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-primary/[0.03] border-b border-primary/5 font-bold uppercase tracking-wider text-primary/50">
                  <th className="p-3">Kích cỡ</th>
                  <th className="p-3">Vòng eo</th>
                  <th className="p-3">Vòng mông</th>
                  {isNumeric ? <th className="p-3">Vòng đùi</th> : <th className="p-3">Cân nặng phù hợp</th>}
                  <th className="p-3">Chiều dài</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 text-primary/70 font-medium">
                {productSizes.map((size) => {
                  let spec = specsLetter[size];
                  if (!spec && isNumeric) {
                    const numSpec = getNumericSpec(size);
                    if (numSpec) {
                      spec = {
                        waist: numSpec.waist,
                        hips: numSpec.hips,
                        thigh: numSpec.thigh,
                        length: numSpec.length
                      };
                    }
                  }
                  if (!spec) {
                    spec = { waist: "Co giãn", hips: "Tiêu chuẩn", thigh: "Tiêu chuẩn", weight: "Tự do", length: "Tiêu chuẩn" };
                  }
                  
                  const isSelected = selectedSize === size;
                  return (
                    <tr 
                      key={size} 
                      className={`transition-colors ${
                        isSelected 
                          ? "bg-accent/10 text-accent font-bold" 
                          : "hover:bg-primary/[0.01]"
                      }`}
                    >
                      <td className={`p-3 font-bold ${isSelected ? "text-accent" : "text-primary"}`}>{size}</td>
                      <td className="p-3">{spec.waist}</td>
                      <td className="p-3">{spec.hips}</td>
                      {isNumeric ? (
                        <td className="p-3">{spec.thigh || "Tiêu chuẩn"}</td>
                      ) : (
                        <td className="p-3">{spec.weight || spec.height || "Tiêu chuẩn"}</td>
                      )}
                      <td className="p-3">{spec.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <span className="text-[10px] text-primary/30 mt-2 block font-medium italic">
            * Các số đo trên mang tính chất tham khảo. Vui lòng liên hệ hỗ trợ nếu cần tư vấn chi tiết hơn.
          </span>
        </div>
      );
    }

    if (type === 4) {
      // Shoes
      const shoeSpecs = {
        "38": "23.5 - 24.0 cm",
        "39": "24.0 - 24.5 cm",
        "40": "24.5 - 25.0 cm",
        "41": "25.0 - 25.5 cm",
        "42": "25.5 - 26.0 cm",
        "43": "26.0 - 26.5 cm",
        "44": "26.5 - 27.0 cm"
      };

      return (
        <div className="mt-6">
          <h3 className="font-display font-black text-[11px] tracking-widest uppercase mb-3 text-primary">
            Bảng thông số size (Giày / Dép)
          </h3>
          <div className="border border-primary/5 bg-[#fafbf9] rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-primary/[0.03] border-b border-primary/5 font-bold uppercase tracking-wider text-primary/50">
                  <th className="p-3">Kích cỡ</th>
                  <th className="p-3">Chiều dài bàn chân</th>
                  <th className="p-3">Hướng dẫn đo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 text-primary/70 font-medium">
                {productSizes.map((size) => {
                  const footLength = shoeSpecs[size] || "Liên hệ hỗ trợ";
                  const isSelected = selectedSize === size;
                  return (
                    <tr 
                      key={size} 
                      className={`transition-colors ${
                        isSelected 
                          ? "bg-accent/10 text-accent font-bold" 
                          : "hover:bg-primary/[0.01]"
                      }`}
                    >
                      <td className={`p-3 font-bold ${isSelected ? "text-accent" : "text-primary"}`}>{size}</td>
                      <td className="p-3">{footLength}</td>
                      <td className="p-3">Đo gót chân tới đầu ngón chân dài nhất</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Default Accessories
    return (
      <div className="mt-6">
        <h3 className="font-display font-black text-[11px] tracking-widest uppercase mb-3 text-primary">
          Bảng thông số size (Phụ kiện)
        </h3>
        <div className="border border-primary/5 bg-[#fafbf9] p-4 text-[11px] font-bold text-primary/60 uppercase tracking-wider rounded-sm">
          ONESIZE - Thiết kế phù hợp với tất cả các phom dáng tiêu chuẩn.
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-secondary selection:bg-accent selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* IMAGE GALLERY SECTION */}
          <div className="lg:col-span-7 bg-white border border-primary/5 p-8 relative flex flex-col items-center justify-between">
            <div className="relative group w-full flex flex-col items-center">
              {/* Sold Out Overlay */}
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30">
                  <div className="bg-white text-primary px-8 py-3 text-[11px] font-black tracking-[0.25em] uppercase shadow-2xl">
                    HẾT HÀNG
                  </div>
                </div>
              )}

              {/* TOP ACTIONS BAR */}
              <div className="w-full flex justify-end items-center mb-6 z-10">
                {/* VIEW CONTROLS */}
                <div className="flex gap-2 bg-secondary p-1 border border-primary/5">
                  <button
                    onClick={() => setCurrentImage("front")}
                    className={`px-3 py-1.5 text-[9px] font-black tracking-widest uppercase transition-all ${
                      currentImage === "front"
                        ? "bg-white text-primary shadow-sm"
                        : "text-primary/40 hover:text-primary"
                    }`}
                  >
                    Mặt trước
                  </button>
                  <button
                    onClick={() => setCurrentImage("back")}
                    className={`px-3 py-1.5 text-[9px] font-black tracking-widest uppercase transition-all ${
                      currentImage === "back"
                        ? "bg-white text-primary shadow-sm"
                        : "text-primary/40 hover:text-primary"
                    }`}
                  >
                    Mặt sau
                  </button>
                </div>
              </div>

              {/* MAIN HERO IMAGE */}
              <div className="relative aspect-[3/4] max-w-md w-full bg-secondary overflow-hidden">
                <img
                  src={
                    currentImage === "front"
                      ? product.imageUrlFront
                      : product.imageUrlBack
                  }
                  alt={product.name}
                  className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-500 hover:scale-105 ${
                    isSoldOut ? "blur-[1px] opacity-60 grayscale-[40%]" : ""
                  }`}
                  onClick={() => handleZoom(currentImage)}
                />
                
                <div className="absolute bottom-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={16} className="text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* DETAILS PANELS */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-8">
              {/* Product title & pricing */}
              <div>
                <h2 className="text-3xl lg:text-4xl font-display font-black tracking-tight uppercase mb-4 text-primary">
                  {product.name}
                </h2>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl lg:text-3xl font-display font-black text-accent tracking-tight">
                     {formatPrice(getPrices().currentPrice)}
                  </span>
                  {!isSoldOut && getPrices().originalPrice && (
                    <span className="text-sm text-primary/30 line-through font-medium">
                      {formatPrice(getPrices().originalPrice)}
                    </span>
                  )}
                  {!isSoldOut && getDiscountPercentage() > 0 && (
                    <span className="bg-red-500 text-white px-2 py-0.5 text-[9px] font-black tracking-widest uppercase">
                      -{getDiscountPercentage()}%
                    </span>
                  )}
                </div>
              </div>

              {/* Quiet Meta Stats */}
              <div className="flex items-center gap-6 py-4 border-y border-primary/5 text-[10px] font-black tracking-widest text-primary/40 uppercase">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={14} className="text-red-500" />
                  <span>Đã bán: <span className="text-primary font-black">{(product.soldQuantity || 0).toLocaleString("vi-VN")}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="text-red-500 fill-current" size={14} />
                  <span>Đánh giá: <span className="text-primary font-black">{product.rating || "5.0"}</span></span>
                </div>
              </div>

              {/* SIZE SELECT */}
              <div>
                <h3 className="font-display font-black text-[10px] tracking-[0.25em] uppercase mb-4 text-primary/40">
                  Chọn kích cỡ
                </h3>
                <div className="flex gap-2.5 flex-wrap">
                  {uniqueSizes.map((size) => (
                    <button
                      key={size.sizeName}
                      onClick={() => setSelectedSize(size.sizeName)}
                      disabled={size.quantity <= 0}
                      className={`w-12 h-12 text-xs font-black transition-all duration-300 border ${
                        selectedSize === size.sizeName
                          ? "bg-primary border-primary text-white"
                          : "border-primary/10 hover:border-primary/30 text-primary hover:bg-secondary"
                      } ${
                        size.quantity <= 0 ? "opacity-30 cursor-not-allowed line-through" : ""
                      }`}
                    >
                      {size.sizeName}
                    </button>
                  ))}
                  {uniqueSizes.length === 0 && <p className="text-xs text-primary/30 uppercase tracking-widest font-black">Không có sẵn kích cỡ nào</p>}
                </div>
              </div>

              {/* QUANTITY */}
              <div>
                <h3 className="font-display font-black text-[10px] tracking-[0.25em] uppercase mb-4 text-primary/40">
                  Số lượng
                </h3>
                <div className="inline-flex items-center border border-primary/10 h-12 bg-white">
                  <button
                    onClick={() => changeQuantity(-1)}
                    disabled={isSoldOut}
                    className="w-12 h-full flex items-center justify-center text-primary/60 hover:text-primary transition-colors disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center text-xs font-black text-primary">
                    {quantity}
                  </span>
                  <button
                    onClick={() => changeQuantity(1)}
                    disabled={isSoldOut}
                    className="w-12 h-full flex items-center justify-center text-primary/60 hover:text-primary transition-colors disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* ACTION CTA BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isSoldOut}
                  className={`flex-1 h-13 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                    isSoldOut
                      ? "bg-primary/5 text-primary/20 border-primary/5 cursor-not-allowed"
                      : "bg-white text-primary border-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  <ShoppingCart size={14} />{" "}
                  {isSoldOut
                    ? "Hết hàng"
                    : isAddedToCart
                    ? "Đã thêm vào giỏ"
                    : "Thêm vào giỏ"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isSoldOut}
                  className={`flex-1 h-13 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    isSoldOut
                      ? "bg-primary/5 text-primary/20 cursor-not-allowed"
                      : "bg-[#111111] hover:bg-accent text-white shadow-lg active:scale-98"
                  }`}
                >
                  <CreditCard size={14} /> Mua ngay
                </button>
              </div>

              {/* SPECIFICATION ACCORDIONS */}
              <div className="pt-8 border-t border-primary/5 space-y-6">
                <div>
                  <h3 className="font-display font-black text-[11px] tracking-widest uppercase mb-3 text-primary">
                    Mô tả sản phẩm
                  </h3>
                  <p className="text-primary/60 text-xs leading-relaxed">{product.description}</p>
                </div>

                <div>
                  <h3 className="font-display font-black text-[11px] tracking-widest uppercase mb-3 text-primary">
                    Chi tiết sản phẩm
                  </h3>
                  <ul className="grid grid-cols-2 gap-y-2.5 text-[11px] font-bold text-primary/50 uppercase tracking-wider">
                    <li><span className="text-primary/30 mr-1.5 font-medium">Form:</span> {product.form}</li>
                    <li><span className="text-primary/30 mr-1.5 font-medium">Chất liệu:</span> {product.material}</li>
                    <li><span className="text-primary/30 mr-1.5 font-medium">Đơn vị:</span> {product.unit}</li>
                  </ul>
                </div>

                {renderSizeChart()}
              </div>

            </div>
          </div>
        </div>

        {/* RELATED RECOMMENDATIONS ROW */}
        {otherProducts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-primary/5">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="text-accent font-black text-[10px] tracking-[0.4em] uppercase mb-3 block">Có thể bạn quan tâm</span>
                <h2 className="text-2xl lg:text-3xl font-display font-black text-primary tracking-tight uppercase">
                  Sản phẩm tương tự
                </h2>
              </div>
            </div>
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
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 overflow-hidden transition-opacity duration-300 ease-in-out">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              ref={imageRef}
              src={zoomImage}
              alt="Zoomed campaign design"
              className="cursor-grab active:cursor-grabbing transition-transform duration-200 ease-in-out max-h-[85vh] object-contain"
              style={{
                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
              }}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
            />

            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-6 right-6 bg-white hover:bg-accent text-primary hover:text-white p-3 transition-colors shadow-2xl"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default ProductDetail;
