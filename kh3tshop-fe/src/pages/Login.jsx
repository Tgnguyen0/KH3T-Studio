import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
const Login = () => {
  const navigate = useNavigate();
  const [formAuthentication, setFormAuthentication] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormAuthentication((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formAuthentication),
      });

      if (response.ok) {
        const result = await response.json();

        if (result && result.result && result.result.token) {
          const token = result.result.token;

          // 1. Save token to localStorage (always do this step)
          localStorage.setItem("accessToken", token);

          // 2. Decode the token to extract information
          const decodedToken = jwtDecode(token);

          // !!! IMPORTANT: Check your token structure
          // Run console.log to see the token object structure
          console.log("Decoded Token:", decodedToken);

          // 3. Extract role/scope from token
          // Based on your token sample, the permission field might be "scope"
          const userRole = decodedToken.scope;

          toast.success("Login successful!");

          // 5. Navigate based on user role
          if (userRole === "ADMIN") {
            navigate("/admin");
          } else if (userRole === "USER") {
            // Or any other role
            navigate("/");
          } else {
            // Redirect to default home page if role is undefined
            navigate("/staff/orders");
          }
        } else {
          toast.error("Login failed: Authentication token not received.");
        }
      } else {
        // If server returns error (e.g., wrong password), response.json() might still contain error info
        let errorData = { message: "Invalid username or password." };
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error("Could not parse JSON from error response.");
        }
        console.error("Login error:", errorData);
        toast.error(
          `Login failed: ${errorData.message || "Please try again."}`
        );
      }
    } catch (error) {
      console.error("Network or unknown error:", error);
      toast.error(
        "An error occurred. Please check your network connection and try again."
      );
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
        {/* Left side - Form */}
        <div className="p-8 md:p-12">
          <h2 className="font-bold text-5xl mb-12">Sign In</h2>

          {/* BẮT ĐẦU THÊM THẺ FORM TẠI ĐÂY */}
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                {/* ... SVG icon ... */}
                <label className="text-gray-700 font-medium">User name:</label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 transition"
                  value={formAuthentication.username}
                  onChange={handleChange}
                  placeholder="Username.........."
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                {/* ... SVG icon ... */}
                <label className="text-gray-700 font-medium">Password:</label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 transition"
                  value={formAuthentication.password}
                  onChange={handleChange}
                  placeholder="Password..........."
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 items-center mt-2 flex-wrap sm:flex-nowrap">
              <button
                type="submit" // Đổi nút này thành submit cũng được, hoặc để onClick
                className="px-6 py-2 rounded-lg bg-gray-400 text-white font-semibold hover:bg-gray-500 transition whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                type="button"
                className="px-6 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition whitespace-nowrap"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Sign Up
              </button>
              <a
                href="#"
                className="text-gray-500 text-sm hover:text-gray-700 whitespace-nowrap sm:ml-auto"
                onClick={() => {
                  navigate("/forget_password");
                }}
              >
                Forget Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-lg bg-black text-white font-bold text-lg hover:bg-gray-800 transition mt-4"
            >
              LOG IN
            </button>
            {/* KẾT THÚC THẺ FORM TẠI ĐÂY */}
          </form>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-red-400 to-red-500 p-12">
          <div className="relative">
            <div className="absolute inset-0 bg-red-300 rounded-full blur-3xl opacity-50"></div>
            <img
              src="https://i.postimg.cc/J0TgG6NZ/Thiet-ke-chua-co-ten-(6).png"
              alt="Profile"
              className="relative rounded-full w-80 h-80 object-cover border-8 border-white shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
