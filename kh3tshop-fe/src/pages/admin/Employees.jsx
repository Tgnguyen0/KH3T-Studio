import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEdit,
  FaPlus,
  FaTrash,
  FaEnvelope,
  FaStar,
  FaEye,
  FaMailBulk,
  FaBan,
  FaCheck,
} from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Employees() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "", ACTIVE, LOCKED
  const [openModal, setOpenModal] = useState(false);  // mở đóng modal tạo cuộc họp 
  // Create / Edit state
  const [showCreate, setShowCreate] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);


  const [form, setForm] = useState(
    {
      username: "",
      password: "",
      customer: {
        fullName: "",
        phoneNumber: "",
        email: "",
        gender: "",

        dateOfBirth: ""
      },
      role: "",
      statusLogin: ""
    }
  );

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
      params.append("role", "STAFF")
      const res = await fetch(
        `http://localhost:8080/accounts?${params.toString()}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
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
        dateOfBirth: ""
      },
      username: "",
      password: "",
      role: "STAFF",
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
        dateOfBirth: formattedDate
      },
      username: account.username || "",
      password: "",
      role: account.role || "",
      statusLogin: account.statusLogin || "",
    });
    setShowCreate(true);
  };

  const handleChange = (path, value) => {
    setForm(prev => {
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
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
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
          statusLogin: form.statusLogin
        })
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

      const res = await fetch(`http://localhost:8080/accounts/admin/update/${editingAccount.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
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
          statusLogin: form.statusLogin
        })
      });

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

  const toggleAccountStatus = async (account) => {
    try {
      setLoading(true);

      const newStatus = account.statusLogin === "ACTIVE" ? "LOCKED" : "ACTIVE";

      const res = await fetch(
        `http://localhost:8080/accounts/admin/update/${account.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: account.username,
            role: account.role,
            statusLogin: newStatus,

            customer: {
              fullName: account.customer.fullName,
              phoneNumber: account.customer.phoneNumber,
              email: account.customer.email,
              gender: account.customer.gender,
              dateOfBirth: account.customer.dateOfBirth,
            },
          }),
        },
      );

      if (!res.ok) {
        throw new Error(`Update failed: ${res.status}`);
      }

      await loadCustomers();
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi khi cập nhật trạng thái");
    } finally {
      setLoading(false);
    }
  };

  // handle creat meeting modal 
  const openCreateMeetingModal = () => {
    setOpenModal(true)
  }

  const MeetingSchema = Yup.object().shape({
    title: Yup.string().required("Tiêu đề không được để trống"),
    description: Yup.string().required("Mô tả không được để trống"),
    startTime: Yup.string().required("Vui lòng chọn thời gian bắt đầu"),
    endTime: Yup.string().required("Vui lòng chọn thời gian kết thúc"),
  });

  const handleCreateMeeting = async (meetingData) => {
    try {
      setLoading(true);

      // Payload gửi đi (gán attendees là mảng rỗng cho an toàn)

      console.log("Meeting Request:", meetingData);

      const res = await fetch("http://localhost:8080/accounts/meetings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(
          meetingData
        )
      });

      if (res.ok) {
        // const data = await res.json(); // Có thể uncomment nếu cần dùng data
        alert("Tạo cuộc họp thành công!");
        setOpenModal(false);
      } else {
        const errorText = await res.text();
        throw new Error(`Lỗi ${res.status}: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi khi tạo cuộc họp");
    } finally {
      setLoading(false);
    }
  };


  const submitForm = () => {
    if (editingAccount) updateCustomer();
    else createCustomer();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ================= HEADER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-white/40">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-500/10 to-blue-500/10" />
          <div className="relative p-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                <FaUser className="text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold font-black bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 bg-clip-text text-transparent">
                  Quản Lý Nhân Viên
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                  Quản lý nhân viên, cuộc họp và trạng thái tài khoản
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={openCreate}
                className="group px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-lg hover:shadow-emerald-300/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
              >
                <FaPlus className="group-hover:rotate-90 transition duration-300" />
                Thêm Nhân Viên
              </button>

              <button
                onClick={() => openCreateMeetingModal()}
                className="group px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-indigo-300/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
              >
                <FaMailBulk />
                Tạo Google Meet
              </button>
            </div>
          </div>
        </div>

        {/* ================= FILTER ================= */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50 px-5 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>

            <div className="w-full lg:w-56">
              <select
                className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50 px-4 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">HOẠT ĐỘNG</option>
                <option value="LOCKED">ĐÃ KHÓA</option>
              </select>
            </div>

            <button
              onClick={loadCustomers}
              className="h-12 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-purple-300/50 transition-all duration-300 hover:-translate-y-1"
            >
              Lọc
            </button>
          </div>
        </div>

        {/* ================= ALERTS ================= */}
        {loading && (
          <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 text-blue-700 font-medium">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Đang tải dữ liệu...
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700 font-medium shadow-sm">
            {error}
          </div>
        )}

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Danh Sách Nhân Viên
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Quản lý tất cả tài khoản nhân viên
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 font-bold text-sm">
              {accounts.length} Nhân Viên
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r  from-slate-50 to-purple-50">
                <tr>
                  {[
                    "Họ Tên",
                    "Email",
                    "Số Điện Thoại",
                    "Vai Trò",
                    "Trạng Thái",
                    "Hành Động",
                  ].map((item, idx) => (
                    <th
                      key={idx}
                      className={`px-6 py-4 font-bold text-sm font-black uppercase tracking-wider text-gray-700 ${
                        item === "Hành Động" ? "text-right" : "text-left"
                      }`}
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {accounts
                  .filter((c) => c.id !== 1)
                  .map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-purple-50/40 transition duration-300"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-bold text-gray-800">
                              {c.customer.fullName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-gray-700">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400" />
                          {c.customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-gray-700 font-medium">
                        {c.customer.phoneNumber}
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                          {c.role}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                            c.statusLogin === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {c.statusLogin === "ACTIVE" ? "HOẠT ĐỘNG" : "ĐÃ KHÓA"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2 flex-wrap">
                          <button
                            onClick={() => openDetail(c)}
                            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 transition-all flex items-center gap-2"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => openEdit(c)}
                            className="px-3 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 transition-all flex items-center gap-2"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => toggleAccountStatus(c)}
                            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2
    ${
      c.statusLogin === "ACTIVE"
        ? "bg-red-100 hover:bg-red-200 text-red-700"
        : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
    }
  `}
                          >
                            {c.statusLogin === "ACTIVE" ? (
                              <FaBan />
                            ) : (
                              <FaCheck />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {accounts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 text-3xl mb-4">
                          <FaUser />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700">
                          Không tìm thấy nhân viên
                        </h3>
                        <p className="text-gray-500 mt-1">
                          Vui lòng thử thay đổi bộ lọc tìm kiếm
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Hiển thị{" "}
              <span className="font-bold text-gray-700">{accounts.length}</span>{" "}
              nhân viên
            </p>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-100 transition">
                ←
              </button>
              <button className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold shadow">
                1
              </button>
              <button className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-100 transition">
                →
              </button>
            </div>
          </div>
        </div>

        {/* ================= DETAIL MODAL ================= */}
        {showDetail && selectedCustomer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center p-4 z-50">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Chi Tiết Nhân Viên
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Thông tin đầy đủ
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetail(false)}
                    className="text-3xl text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></span>
                      Thông Tin Nhân Viên
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between">
                        <strong>Họ tên:</strong>{" "}
                        <span>{selectedCustomer.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Email:</strong>{" "}
                        <span>{selectedCustomer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Số điện thoại:</strong>{" "}
                        <span>{selectedCustomer.phoneNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Giới tính:</strong>{" "}
                        <span className="capitalize">
                          {selectedCustomer.gender}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Ngày sinh:</strong>{" "}
                        <span>{selectedCustomer.dateOfBirth}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></span>
                      Thông Tin Khác
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-5 h-full flex items-center justify-center">
                      <p className="text-gray-500 italic">
                        Không có thông tin bổ sung
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 rounded-b-3xl flex justify-end">
                <button
                  onClick={() => setShowDetail(false)}
                  className="px-8 py-3 bg-gray-800 text-white rounded-2xl font-semibold hover:bg-gray-900"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= CREATE / EDIT MODAL ================= */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center p-4 z-50">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-3xl sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingAccount
                        ? "Cập Nhật Nhân Viên"
                        : "Thêm Nhân Viên Mới"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {editingAccount
                        ? "Cập nhật thông tin nhân viên"
                        : "Điền thông tin để tạo nhân viên mới"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCreate(false);
                      setEditingAccount(null);
                    }}
                    className="text-3xl text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Cột trái */}
                  <div className="space-y-5">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></span>
                      Thông Tin Cá Nhân
                    </h3>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Họ và Tên
                      </label>
                      <input
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500"
                        value={form.customer.fullName}
                        onChange={(e) =>
                          handleChange("customer.fullName", e.target.value)
                        }
                        placeholder="Nhập họ tên"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Email
                      </label>
                      <input
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500"
                        value={form.customer.email}
                        onChange={(e) =>
                          handleChange("customer.email", e.target.value)
                        }
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Số Điện Thoại
                      </label>
                      <input
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500"
                        value={form.customer.phoneNumber}
                        onChange={(e) =>
                          handleChange("customer.phoneNumber", e.target.value)
                        }
                        placeholder="+84 xxx xxx xxx"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Giới Tính
                      </label>
                      <select
                        className="border-2 border-gray-200 p-3 rounded-xl w-full"
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
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Ngày Sinh
                      </label>
                      <input
                        type="date"
                        className="border-2 border-gray-200 p-3 rounded-xl w-full"
                        value={form.customer.dateOfBirth}
                        onChange={(e) =>
                          handleChange("customer.dateOfBirth", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Cột phải */}
                  <div className="space-y-5">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                      Thông Tin Tài Khoản
                    </h3>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Tên Đăng Nhập
                      </label>
                      <input
                        className="border-2 border-gray-200 p-3 rounded-xl w-full"
                        value={form.username}
                        onChange={(e) =>
                          handleChange("username", e.target.value)
                        }
                        placeholder="Nhập tên đăng nhập"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Mật Khẩu
                      </label>
                      <input
                        type="password"
                        className="border-2 border-gray-200 p-3 rounded-xl w-full"
                        value={form.password}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                        placeholder={
                          editingAccount
                            ? "Mật khẩu mới (nếu thay đổi)"
                            : "Nhập mật khẩu"
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Vai Trò
                      </label>
                      <input
                        className="border-2 border-gray-200 p-3 rounded-xl w-full"
                        value={form.role}
                        onChange={(e) => handleChange("role", e.target.value)}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Trạng Thái
                      </label>
                      <select
                        className="border-2 border-gray-200 p-3 rounded-xl w-full"
                        value={form.statusLogin}
                        onChange={(e) =>
                          handleChange("statusLogin", e.target.value)
                        }
                      >
                        <option value="ACTIVE">Hoạt Động</option>
                        <option value="LOCKED">Đã Khóa</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4 rounded-b-3xl">
                <button
                  onClick={() => {
                    setShowCreate(false);
                    setEditingAccount(null);
                  }}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-2xl font-semibold hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={submitForm}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-indigo-700"
                >
                  {editingAccount ? "Lưu Thay Đổi" : "Tạo Nhân Viên"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= GOOGLE MEET MODAL ================= */}
        {openModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center p-4 z-50">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      Tạo Cuộc Họp Google Meet
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Lên lịch cuộc họp trực tuyến
                    </p>
                  </div>
                  <button
                    onClick={() => setOpenModal(false)}
                    className="text-3xl text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                </div>
              </div>

              <Formik
                initialValues={{
                  title: "",
                  description: "",
                  startTime: "",
                  endTime: "",
                }}
                validationSchema={MeetingSchema}
                onSubmit={(values) => handleCreateMeeting(values)}
              >
                {({ isSubmitting }) => (
                  <Form className="p-8 space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Tiêu đề cuộc họp
                      </label>
                      <Field
                        name="title"
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500"
                        placeholder="Ví dụ: Họp triển khai dự án tháng 5"
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Mô tả nội dung
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        rows={4}
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500"
                        placeholder="Nhập nội dung chi tiết cuộc họp..."
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Thời gian bắt đầu
                        </label>
                        <Field
                          name="startTime"
                          type="datetime-local"
                          className="border-2 border-gray-200 p-3 rounded-xl w-full"
                        />
                        <ErrorMessage
                          name="startTime"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Thời gian kết thúc
                        </label>
                        <Field
                          name="endTime"
                          type="datetime-local"
                          className="border-2 border-gray-200 p-3 rounded-xl w-full"
                        />
                        <ErrorMessage
                          name="endTime"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="px-6 py-3 border border-gray-300 rounded-2xl font-semibold"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-semibold disabled:opacity-70"
                      >
                        {isSubmitting ? "Đang tạo..." : "Tạo Cuộc Họp"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
