import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Layout from "./components/Layout";
import ForgotPassword from "./pages/ForgetPassword";
import About from "./pages/AboutUs";
import WishList from "./pages/WishList";
import WishlistDetail from "./pages/WishListDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Product from "./pages/Product";
import AdminRoute from "./pages/admin/AdminRoute";
import Policy from "./pages/Policy";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import { Toaster } from "sonner";
import QrPayment from "./pages/QrPayment";
import ComparePage from "./pages/ComparePage.jsx";
import ResetPassword from "./pages/ResetPassword";
import StaffOrdersPage from "./pages/staff/StaffOrderPage";
import StaffInvoicesPage from "./pages/staff/StaffInvoicePage";
import StaffRoute from "./pages/staff/StaffRoute";
import UserOnlyRoute from "./components/UserOnlyRoute";
import { jwtDecode } from "jwt-decode";
import Profile from "./pages/Profile.jsx";
import Order from "./pages/Order.jsx";
function App() {
  return (
    <>
      <Toaster richColors closeButton position="top-right" />

      <Routes>
        {/* ====================== TRANG CHỈ DÀNH CHO USER THƯỜNG (ADMIN BỊ CHẶN) ====================== */}
        <Route
          element={
            <UserOnlyRoute>
              <Layout />
            </UserOnlyRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/wishlists" element={<WishList />} />
          <Route path="/wishlists/:id" element={<WishlistDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<QrPayment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Order />} />
        </Route>

        {/* ====================== TRANG PUBLIC (ai cũng vào được, kể cả Admin) ====================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget_password" element={<ForgotPassword />} />
        <Route path="/reset_password" element={<ResetPassword />} />

        {/* Admin Routes */}

        {/* ====================== CHỈ ADMIN MỚI VÀO ĐƯỢC ====================== */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* ====================== CHỈ STAFF MỚI VÀO ĐƯỢC ====================== */}
        {/* Nếu bạn muốn STAFF cũng bị chặn khỏi trang user → thêm <UserOnlyRoute> vào đây */}
        <Route
          path="/staff/orders"
          element={
            <StaffRoute>
              <StaffOrdersPage />
            </StaffRoute>
          }
        />
        <Route
          path="/staff/invoices"
          element={
            <StaffRoute>
              <StaffInvoicesPage />
            </StaffRoute>
          }
        />

        {/* ====================== 404 - Điều hướng thông minh ====================== */}
        <Route path="*" element={<SmartRedirect />} />
      </Routes>
    </>
  );
}

// Component điều hướng 404 thông minh
const SmartRedirect = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const role = decoded.scope || decoded.role || decoded.authorities?.[0];
      if (role === "ADMIN") return <Navigate to="/admin" replace />;
      if (role === "STAFF") return <Navigate to="/staff/orders" replace />;
    } catch (e) {
      // token lỗi → xóa luôn
      localStorage.removeItem("accessToken");
    }
  }
  return <Navigate to="/" replace />;
};

export default App;
