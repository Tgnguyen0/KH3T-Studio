import React from "react";
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        // Nếu không có token, điều hướng người dùng về trang đăng nhập
        alert("Bạn cần đăng nhập để truy cập trang này.");
        return <Navigate to="/login" replace />;
    }
    try {
        // 3. Giải mã token để lấy thông tin role
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.scope; // Dựa theo cấu trúc token của bạn

        // 4. Kiểm tra xem role có phải là 'ADMIN' không
        if (userRole !== 'ADMIN') {
            // Nếu không phải admin, điều hướng về trang chủ và thông báo
            alert("Bạn không có quyền truy cập vào trang quản trị.");
            return <Navigate to="/" replace />;
        }

        // 5. Nếu tất cả kiểm tra đều qua, cho phép truy cập component con
        return children;
    } catch (error) {
        // Xử lý trường hợp token không hợp lệ hoặc hết hạn
        console.error("Token không hợp lệ hoặc đã hết hạn:", error);
        alert("Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem('accessToken'); // Xóa token hỏng
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;