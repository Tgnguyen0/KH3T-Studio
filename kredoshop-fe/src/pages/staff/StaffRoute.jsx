import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

/**
 * StaffRoute - Only allows users with STAFF role to access
 */
const StaffRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  // 1. No token → Redirect to login
  if (!token) {
    alert("You must log in to access the staff area.");
    return <Navigate to="/login" replace />;
  }

  try {
    // 2. Decode token
    const decoded = jwtDecode(token);

    const role =
      decoded.scope ||
      decoded.role ||
      decoded.authorities ||
      decoded.roles ||
      null;

    const rolesArray = Array.isArray(role) ? role : (role ? [role] : []);

    const isStaff = rolesArray.some((r) =>
      r.toString().toUpperCase().includes("STAFF")
    );

    if (!isStaff) {
      alert("You do not have permission to access this area. Staff only.");
      return <Navigate to="/" replace />;
    }

    return children;

  } catch (error) {
    console.error("Invalid or expired token:", error);
    alert("Your session is invalid or has expired. Please log in again.");
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }
};

export default StaffRoute;
