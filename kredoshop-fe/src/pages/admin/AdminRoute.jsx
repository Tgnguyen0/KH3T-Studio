import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);

    // CHECK TOKEN HẾT HẠN
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("accessToken");

      return <Navigate to="/login" replace />;
    }

    const userRole =
      decodedToken.scope || decodedToken.role || decodedToken.authorities?.[0];

    if (userRole !== "ADMIN") {
      localStorage.removeItem("accessToken");

      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("accessToken");

    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
