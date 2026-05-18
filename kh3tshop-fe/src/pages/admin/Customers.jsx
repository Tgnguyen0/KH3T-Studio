import React, { useState, useEffect } from "react";
import { FaUser, FaEdit, FaPlus, FaTrash, FaEnvelope, FaStar, FaEye, FaMailBulk, FaBan } from "react-icons/fa";
import AdminChatBot from '../../components/AdminChatBot';
export default function Customers() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "", ACTIVE, LOCKED
  // Create / Edit state
  const [showCreate, setShowCreate] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
    customer: {
      fullName: "",
      phoneNumber: "",
      email: "",
      gender: "",

      dateOfBirth: "",
    },
    role: "",
    statusLogin: "",
  });

  // Loading / error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");
  // Load customer list
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      // tạo query string
      const params = new URLSearchParams();
      if (searchName) params.append("name", searchName);
      if (statusFilter) params.append("status", statusFilter);
      params.append("role", "USER");
      const res = await fetch(
        `http://localhost:8080/accounts?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) throw new Error("Failed to load accounts");
      const data = await res.json();

      setAccounts(data.result); // nếu response dạng ApiResponse
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (account) => {
    setSelectedCustomer(account.customer);
    setShowDetail(true);
  };

  const openCreate = () => {
    setEditingAccount(null);
    setForm({
      customer: {
        fullName: "",
        phoneNumber: "",
        email: "",
        gender: "MALE",
        dateOfBirth: "",
      },
      username: "",
      password: "",
      role: "USER",
      statusLogin: "ACTIVE",
    });
    setShowCreate(true);
  };

  const openEdit = (account) => {
    const rawDate = account.customer.dateOfBirth || "";
    const formattedDate = rawDate ? rawDate.slice(0, 10) : ""; // lấy yyyy-mm-dd

    setEditingAccount(account);
    setForm({
      customer: {
        fullName: account.customer.fullName || "",
        phoneNumber: account.customer.phoneNumber || "",
        email: account.customer.email || "",
        gender: account.customer.gender || "",
        dateOfBirth: formattedDate,
      },
      username: account.username || "",
      password: "",
      role: account.role || "",
      statusLogin: account.statusLogin || "",
    });
    setShowCreate(true);
  };

  const handleChange = (path, value) => {
    setForm((prev) => {
      const keys = path.split(".");
      const updated = { ...prev };

      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;

      return updated;
    });
  };

  const createCustomer = async () => {
    // Validate cơ bản
    if (!form.customer.fullName || !form.customer.email) {
      alert("Vui lòng nhập đầy đủ họ tên và email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`http://localhost:8080/accounts/admin/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          customer: {
            fullName: form.customer.fullName,
            phoneNumber: form.customer.phoneNumber,
            email: form.customer.email,
            gender: form.customer.gender,
            dateOfBirth: form.customer.dateOfBirth, // yyyy-mm-dd
          },
          role: form.role,
          statusLogin: form.statusLogin,
        }),
      });

      if (!res.ok) throw new Error(`Create failed: ${res.status}`);

      await loadCustomers();
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi khi tạo khách hàng");
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async () => {
    if (!editingAccount) return;

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/accounts/admin/update/${editingAccount.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.username,
            password: form.password || undefined, // nếu bỏ trống thì không gửi password
            customer: {
              fullName: form.customer.fullName,
              phoneNumber: form.customer.phoneNumber,
              email: form.customer.email,
              gender: form.customer.gender,
              dateOfBirth: form.customer.dateOfBirth, // yyyy-mm-dd
            },
            role: form.role,
            statusLogin: form.statusLogin,
          }),
        },
      );

      if (!res.ok) throw new Error(`Update failed: ${res.status}`);

      await loadCustomers();
      setShowCreate(false);
      setEditingAccount(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi khi cập nhật tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const blockAccount = async (account) => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/accounts/admin/delete/${account.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) throw new Error(`Block failed: ${res.status}`);

      await loadCustomers(); // <-- thêm để refresh UI
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi khi block tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const submitForm = () => {
    if (editingAccount) updateCustomer();
    else createCustomer();
  };

  const sendEmail = async () => {
    try {
      // KHÔNG thêm Content-Type, KHÔNG thêm body
      const res = await fetch(
        `http://localhost:8080/customers/email/sale/all`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        const data = await res.json();
        alert(data.result); // Thông báo thành công
      } else {
        alert("Lỗi khi gọi API: " + res.status);
      }
    } catch (error) {
      alert("Lỗi kết nối hoặc timeout: " + error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="max-w-[1600px] mx-auto px-3 py-7 space-y-5">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#9333ea] p-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                <FaUser className="text-white text-4xl" />
              </div>

              <div>
                <h1 className="text-4xl font-bold font-black text-white tracking-tight">
                  Quản lý khách hàng
                </h1>

                <p className="text-white/80 text-base mt-2">
                  Quản lý khách hàng hiện đại & chuyên nghiệp
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={openCreate}
                className="w-[220px] h-[56px] rounded-2xl bg-white text-[#5b21b6] text-sm font-semibold flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-all duration-300"
              >
                <FaPlus className="text-sm" />
                Thêm Khách Hàng
              </button>

              <button
                onClick={sendEmail}
                className="w-[220px] h-[56px] rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 text-white text-sm font-semibold flex items-center justify-center gap-3 hover:bg-black/30 transition-all duration-300"
              >
                <FaMailBulk className="text-sm" />
                Gửi Email
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-[30px] p-6 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px_170px] gap-5">
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              className="w-full h-13 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-500 transition-all text-sm text-gray-700 font-medium"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />

            <select
              className="h-13 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-500 bg-white text-sm font-medium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="LOCKED">Đã khóa</option>
            </select>

            <button
              onClick={loadCustomers}
              className="h-13 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg hover:scale-[1.03] transition-all duration-300"
            >
              Áp dụng
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="bg-white rounded-3xl shadow-lg p-5 border border-gray-100 flex items-center gap-4">
            <div className="w-5 h-5 border-[3px] border-violet-500 border-t-transparent rounded-full animate-spin"></div>

            <span className="font-medium text-gray-700 text-sm">
              Đang tải dữ liệu...
            </span>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-5 text-red-600 font-medium text-sm">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden">
          {/* TABLE HEADER */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[24px] font-black text-gray-800">
              Danh Sách Khách Hàng
            </h2>

            <div className="min-w-[140px] px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg text-center">
              <p className="text-[11px] font-medium text-white/80 uppercase tracking-wider">
                Tổng số khách hàng
              </p>

              <h3 className="text-2xl font-black text-white leading-none mt-1">
                {accounts.length}
              </h3>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* THEAD */}
              <thead className="bg-[#f8fafc] border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4 text-left text-[12px] whitespace-nowrap font-bold text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>

                  <th className="px-8 py-4 text-left text-[12px] whitespace-nowrap font-bold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>

                  <th className="px-8 py-4 text-left text-[12px] whitespace-nowrap font-bold text-gray-500 uppercase tracking-wider">
                    Điện thoại
                  </th>

                  <th className="px-8 py-4 text-left text-[12px] whitespace-nowrap font-bold text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>

                  <th className="px-8 py-4 text-center text-[12px] whitespace-nowrap font-bold text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {accounts
                  .filter((c) => c.id !== 1)
                  .map((c) => (
                    <tr
                      key={c.id}
                      className="border-t border-gray-100 hover:bg-violet-50/50 transition-all duration-300"
                    >
                      {/* USER */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          
                          <h3 className="font-semibold text-gray-800 text-sm">
                            {c.customer.fullName}
                          </h3>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="px-8 py-5">
                        <span className="font-medium text-gray-700 text-sm">
                          {c.customer.email}
                        </span>
                      </td>

                      {/* PHONE */}
                      <td className="px-8 py-5">
                        <span className="font-medium text-gray-700 text-sm">
                          {c.customer.phoneNumber}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-5">
                        <span
                          className={`px-4 py-1.5 rounded-xl text-[11px] font-bold ${
                            c.statusLogin === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {c.statusLogin === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => openDetail(c)}
                            className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white transition-all duration-300 flex items-center justify-center"
                          >
                            <FaEye size={15} />
                          </button>

                          <button
                            onClick={() => openEdit(c)}
                            className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                          >
                            <FaEdit size={15} />
                          </button>

                          <button
                            onClick={() => blockAccount(c)}
                            className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center"
                          >
                            <FaBan size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* EMPTY */}
            {accounts.length === 0 && !loading && (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center mb-6">
                  <FaUser className="text-violet-500 text-4xl" />
                </div>

                <h3 className="text-2xl font-black text-gray-700">
                  Không có khách hàng
                </h3>

                <p className="text-gray-500 mt-2 text-sm">
                  Không tìm thấy dữ liệu phù hợp
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {showDetail && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="w-full max-w-3xl rounded-[32px] overflow-hidden bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-6 flex items-center justify-between">
              <h2 className="text-3xl font-black text-white">
                Chi Tiết Khách Hàng
              </h2>

              <button
                onClick={() => setShowDetail(false)}
                className="w-12 h-12 rounded-2xl bg-white/20 text-white text-2xl hover:bg-white/30 transition"
              >
                ×
              </button>
            </div>

            <div className="p-10">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center text-4xl font-black shadow-xl">
                  {selectedCustomer.fullName?.charAt(0)}
                </div>

                <div>
                  <h3 className="text-3xl font-black text-gray-800">
                    {selectedCustomer.fullName}
                  </h3>

                  <p className="text-gray-500 mt-1">Customer Information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-3xl p-6">
                  <p className="text-gray-500 mb-2">Email</p>
                  <h4 className="font-bold text-lg text-gray-800">
                    {selectedCustomer.email}
                  </h4>
                </div>

                <div className="bg-gray-50 rounded-3xl p-6">
                  <p className="text-gray-500 mb-2">Số điện thoại</p>
                  <h4 className="font-bold text-lg text-gray-800">
                    {selectedCustomer.phoneNumber}
                  </h4>
                </div>

                <div className="bg-gray-50 rounded-3xl p-6">
                  <p className="text-gray-500 mb-2">Giới tính</p>
                  <h4 className="font-bold text-lg text-gray-800">
                    {selectedCustomer.gender}
                  </h4>
                </div>

                <div className="bg-gray-50 rounded-3xl p-6">
                  <p className="text-gray-500 mb-2">Ngày sinh</p>
                  <h4 className="font-bold text-lg text-gray-800">
                    {selectedCustomer.dateOfBirth || "Chưa có"}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-white w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 z-20 bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-6 flex items-center justify-between">
              <h2 className="text-3xl font-black text-white">
                {editingAccount ? "Cập Nhật Khách Hàng" : "Tạo Khách Hàng"}
              </h2>

              <button
                onClick={() => {
                  setShowCreate(false);
                  setEditingAccount(null);
                }}
                className="w-12 h-12 rounded-2xl bg-white/20 text-white text-2xl hover:bg-white/30 transition"
              >
                ×
              </button>
            </div>

            <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT */}
              <div className="space-y-5">
                <h3 className="text-2xl font-black text-gray-800 mb-6">
                  Thông Tin Cá Nhân
                </h3>

                {[
                  {
                    label: "Họ tên",
                    value: form.customer.fullName,
                    path: "customer.fullName",
                  },
                  {
                    label: "Email",
                    value: form.customer.email,
                    path: "customer.email",
                  },
                  {
                    label: "Số điện thoại",
                    value: form.customer.phoneNumber,
                    path: "customer.phoneNumber",
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <label className="block mb-2 font-bold text-gray-700">
                      {item.label}
                    </label>

                    <input
                      className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-500"
                      value={item.value}
                      onChange={(e) => handleChange(item.path, e.target.value)}
                    />
                  </div>
                ))}

                <div>
                  <label className="block mb-2 font-bold text-gray-700">
                    Giới tính
                  </label>

                  <select
                    className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-500"
                    value={form.customer.gender}
                    onChange={(e) =>
                      handleChange("customer.gender", e.target.value)
                    }
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-bold text-gray-700">
                    Ngày sinh
                  </label>

                  <input
                    type="date"
                    className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-500"
                    value={form.customer.dateOfBirth}
                    onChange={(e) =>
                      handleChange("customer.dateOfBirth", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-5">
                <h3 className="text-2xl font-black text-gray-800 mb-6">
                  Thông Tin Tài Khoản
                </h3>

                {[
                  {
                    label: "Username",
                    value: form.username,
                    path: "username",
                  },
                  {
                    label: "Password",
                    value: form.password,
                    path: "password",
                    type: "password",
                  },
                  {
                    label: "Role",
                    value: form.role,
                    path: "role",
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <label className="block mb-2 font-bold text-gray-700">
                      {item.label}
                    </label>

                    <input
                      type={item.type || "text"}
                      className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-500"
                      value={item.value}
                      onChange={(e) => handleChange(item.path, e.target.value)}
                    />
                  </div>
                ))}

                <div>
                  <label className="block mb-2 font-bold text-gray-700">
                    Trạng thái
                  </label>

                  <select
                    className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-500"
                    value={form.statusLogin}
                    onChange={(e) =>
                      handleChange("statusLogin", e.target.value)
                    }
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="LOCKED">Khóa</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-10 py-7 bg-gray-50 border-t flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowCreate(false);
                  setEditingAccount(null);
                }}
                className="px-8 py-4 rounded-2xl border border-gray-300 font-bold hover:bg-gray-100 transition"
              >
                Hủy
              </button>

              <button
                onClick={submitForm}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black shadow-xl hover:scale-105 transition-all duration-300"
              >
                {editingAccount ? "Lưu Thay Đổi" : "Tạo Mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
