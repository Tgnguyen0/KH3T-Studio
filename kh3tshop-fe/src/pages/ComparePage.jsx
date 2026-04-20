import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { X, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ChatBot from "../components/ChatBot"; 
import Contact from '../components/Contact';
// Mock function để mô phỏng việc lấy dữ liệu chi tiết sản phẩm
// Trong thực tế, bạn cần thay thế bằng fetch API thật của mình.
// Ideal API endpoint: /products/batch?ids=10,12,15
const fetchProductsByIds = async (ids) => {
    // Đây là nơi bạn gọi API của mình. Ví dụ:
    const response = await fetch(`http://localhost:8080/products/batch?ids=${ids.join(',')}`);
    const data = await response.json();
    return data.result;

};

const formatPrice = (price) => {
    const numericPrice = typeof price === "number" && isFinite(price) ? price : 0;
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(numericPrice);
};

// Hàm xóa danh sách so sánh khỏi Local Storage
const clearCompareList = () => {
    localStorage.removeItem('compareList');
};

const ComparePage = () => {
    const [searchParams] = useSearchParams();
    const idsString = searchParams.get('ids');
    const productIds = idsString ? idsString.split(',').map(id => parseInt(id)) : [];

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const loadProducts = async () => {
            if (productIds.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const fetchedProducts = await fetchProductsByIds(productIds);
                setProducts(fetchedProducts);
            } catch (err) {
                setError("Failed to fetch product data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [idsString]);

    const handleClearComparison = () => {
        clearCompareList();
        setProducts([]); // Xóa sản phẩm khỏi state
        toast.success("Comparison list cleared successfully!");
    };

    // --- Data mapping for comparison table (Đã tối ưu hóa và thêm Ảnh) ---
    const comparisonFeatures = [
        // Các thông tin cơ bản
        { key: 'costPrice', label: 'Sale Price', render: (p) => <span className="text-xl font-bold text-red-600">{formatPrice(p.costPrice)}</span> },
        { key: 'price', label: 'Original Price', render: (p) => <span className="text-gray-500 line-through">{formatPrice(p.price)}</span> },
        { key: 'rating', label: 'Customer Rating', render: (p) => <div className="flex items-center justify-center text-yellow-500"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span className="ml-1 text-gray-800">{p.rating || 'N/A'}</span></div> },
        // Size Available (chỉ hiển thị size còn hàng)
        {
            key: 'availableSizes',
            label: 'Available Sizes',
            render: (p) => {
                const availableSizes = p.sizeDetails
                    ? p.sizeDetails
                        .filter(size => size.quantity > 0)
                        .sort((a, b) => {
                            const order = ["S", "M", "L", "XL"];
                            return order.indexOf(a.sizeName) - order.indexOf(b.sizeName);
                        })
                    : [];

                return (
                    <div className="flex flex-wrap gap-2 justify-center text-sm">
                        {availableSizes.length > 0 ? (
                            availableSizes.map((size) => (
                                <span
                                    key={size.sizeName}
                                    className="px-3 py-1 rounded-full font-semibold bg-green-100 text-green-700"
                                >
                                    {size.sizeName}
                                </span>
                            ))
                        ) : (
                            <span className="text-red-500 italic font-medium">Out of Stock</span>
                        )}
                    </div>
                );
            }
        },

        // Thông số kỹ thuật
        { key: 'form', label: 'Form/Fit', render: (p) => p.form || 'N/A' },
        { key: 'material', label: 'Material', render: (p) => p.material || 'N/A' },
        { key: 'unit', label: 'Unit', render: (p) => p.unit || 'N/A' },

        // Mô tả sản phẩm (Hiển thị đầy đủ)
        { key: 'description', label: 'Description', render: (p) => <div className="text-sm text-left max-w-xs mx-auto p-2 text-gray-700 whitespace-normal">{p.description}</div> },

        // THÊM: Ảnh Mặt Trước
        {
            key: 'imageUrlFront',
            label: 'Image (Front)',
            render: (p) => (
                <img
                    src={p.imageUrlFront}
                    alt={`${p.name} Front`}
                    className="w-24 h-24 object-contain mx-auto rounded-md border border-gray-200 shadow-sm"
                />
            )
        },
        // THÊM: Ảnh Mặt Sau
        {
            key: 'imageUrlBack',
            label: 'Image (Back)',
            render: (p) => (
                <img
                    src={p.imageUrlBack}
                    alt={`${p.name} Back`}
                    className="w-24 h-24 object-contain mx-auto rounded-md border border-gray-200 shadow-sm"
                />
            )
        },
    ];
    // ---------------------------------------------

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div></div>;
    }

    if (error || productIds.length === 0 || products.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 min-h-screen">
                <h3 className="text-2xl font-bold text-red-600 mb-4">
                    {error || (productIds.length === 0 ? "No products selected for comparison." : "Products not found or list is empty.")}
                </h3>
                <Link to="/" className="text-blue-600 hover:underline flex items-center justify-center">
                    <ArrowLeft size={18} className="mr-1" /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-full mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Product Comparison ({products.length} Items)
                    </h1>
                    <button
                        onClick={handleClearComparison}
                        className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                        <Trash2 size={18} className="mr-2" /> Clear Comparison
                    </button>
                </div>

                {/* COMPARISON TABLE CONTAINER */}
                <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200 bg-white">
                    <table className="w-full whitespace-nowrap">
                        <thead>
                        <tr className="bg-gray-100 border-b">
                            {/* Cột Thuộc tính (Cột cố định bên trái) */}
                            <th className="sticky left-0 z-20 bg-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-700 w-48 shadow-md">
                                Feature
                            </th>
                            {/* Các cột Sản phẩm */}
                            {products.map((p, index) => (
                                <th key={p.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-64 border-l">
                                    <div className="flex justify-center relative">
                                        <Link to={`/product/${p.id}`} className="hover:opacity-80 transition block">
                                            {/* Ảnh sản phẩm (Mặt trước) - dùng làm tiêu đề cột */}
                                            <img src={p.imageUrlFront} alt={p.name} className="w-16 h-16 object-contain mx-auto rounded-md mb-2" />
                                            {/* Tên sản phẩm */}
                                            <p className="font-bold text-base line-clamp-2">{p.name}</p>
                                        </Link>
                                    </div>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {comparisonFeatures.map((feature, rowIndex) => (
                            <tr key={feature.key} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {/* Cột Thuộc tính */}
                                <td className="sticky left-0 z-10 bg-gray-100 px-6 py-4 font-medium text-gray-800 border-r w-48">
                                    {feature.label}
                                </td>
                                {/* Các cột Giá trị Sản phẩm */}
                                {products.map((p, colIndex) => (
                                    <td key={`${p.id}-${feature.key}`} className="px-6 py-4 text-center border-l w-64 align-top">
                                        {feature.render(p)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ChatBot/>
            <Contact/>
        </div>
    );
};

export default ComparePage;