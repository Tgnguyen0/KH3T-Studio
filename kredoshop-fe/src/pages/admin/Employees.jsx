import React, { useState, useEffect } from "react";
import { Users, Plus, Eye, Edit2, Ban, Check, Video, RefreshCw, Search } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

export default function Employees() {
  const [accounts, setAccounts]             = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetail, setShowDetail]         = useState(false);
  const [showCreate, setShowCreate]         = useState(false);
  const [showMeeting, setShowMeeting]       = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [searchName, setSearchName]         = useState("");
  const [statusFilter, setStatusFilter]     = useState("");
  const [loading, setLoading]               = useState(false);
  const token = localStorage.getItem("accessToken");

  const [form, setForm] = useState({
    username: "", password: "",
    customer: { fullName: "", phoneNumber: "", email: "", gender: "", dateOfBirth: "" },
    role: "", statusLogin: "",
  });

  useEffect(() => { loadEmployees(); }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchName) params.append("name", searchName);
      if (statusFilter) params.append("status", statusFilter);
      params.append("role", "STAFF");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/accounts?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAccounts(data.result);
    } catch { toast.error("Lỗi khi tải danh sách nhân viên"); }
    finally { setLoading(false); }
  };

  const handleChange = (path, value) => {
    setForm(prev => {
      const keys = path.split(".");
      const updated = { ...prev };
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) { obj[keys[i]] = { ...obj[keys[i]] }; obj = obj[keys[i]]; }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const openCreate = () => {
    setEditingAccount(null);
    setForm({ customer: { fullName: "", phoneNumber: "", email: "", gender: "MALE", dateOfBirth: "" }, username: "", password: "", role: "STAFF", statusLogin: "ACTIVE" });
    setShowCreate(true);
  };

  const openEdit = (account) => {
    setEditingAccount(account);
    setForm({
      customer: { fullName: account.customer?.fullName || "", phoneNumber: account.customer?.phoneNumber || "", email: account.customer?.email || "", gender: account.customer?.gender || "", dateOfBirth: (account.customer?.dateOfBirth || "").slice(0, 10) },
      username: account.username || "", password: "", role: account.role || "", statusLogin: account.statusLogin || "",
    });
    setShowCreate(true);
  };

  const submitForm = async () => {
    if (!form.customer.fullName || !form.customer.email) { toast.error("Vui lòng nhập đầy đủ họ tên và email"); return; }
    try {
      setLoading(true);
      const url = editingAccount ? `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/accounts/admin/update/${editingAccount.id}` : `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/accounts/admin/add`;
      const res = await fetch(url, { method: editingAccount ? "PUT" : "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      await loadEmployees(); setShowCreate(false); setEditingAccount(null);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const toggleStatus = async (account) => {
    try {
      setLoading(true);
      const newStatus = account.statusLogin === "ACTIVE" ? "LOCKED" : "ACTIVE";
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/accounts/admin/update/${account.id}`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...account, statusLogin: newStatus, customer: account.customer }),
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      await loadEmployees();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const handleCreateMeeting = async (values) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/accounts/meetings/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) {
        throw new Error(`Lỗi ${res.status}`);
      }

      toast.success("Tạo Google Meet thành công!");
      setShowMeeting(false); // Đóng modal
    } catch (err) {
      toast.error(err.message || "Đã xảy ra lỗi!");
    } finally {
      setLoading(false);
    }
  };

  const MeetingSchema = Yup.object().shape({
    title: Yup.string().required("Tiêu đề không được để trống"),
    description: Yup.string().required("Mô tả không được để trống"),
    startTime: Yup.string().required("Vui lòng chọn thời gian bắt đầu"),
    endTime: Yup.string().required("Vui lòng chọn thời gian kết thúc"),
  });

  const activeCount = accounts.filter(a => a.statusLogin === "ACTIVE").length;
  const inputCls = "w-full bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none border border-primary/5";
  const labelCls = "text-[9px] font-black tracking-widest text-primary/40 uppercase mb-1.5 block";

  return (
    <div className="min-h-screen bg-secondary selection:bg-red-500 selection:text-white pb-16">

      {/* ── Header ── */}
      <div className="bg-[#111111] text-white border-b border-white/10 mb-12">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-red-500 text-[9px] font-black tracking-[0.4em] uppercase">QUẢN LÝ HỆ THỐNG — KREDO STUDIO</span>
            <h1 className="text-3xl lg:text-4xl font-display font-black text-white mt-2 uppercase tracking-tight">Nhân viên</h1>
            <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-2">Quản lý tài khoản nhân viên & cuộc họp</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openCreate} className="flex items-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black tracking-widest uppercase transition-colors">
              <Plus size={14} /> Thêm nhân viên
            </button>
            <button onClick={() => setShowMeeting(true)} className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black tracking-widest uppercase transition-colors border border-white/10">
              <Video size={14} /> Google Meet
            </button>
            <button onClick={loadEmployees} className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black tracking-widest uppercase transition-colors border border-white/10">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Làm mới
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 space-y-12">

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Users, label: "Tổng nhân viên", value: accounts.length, tag: "Toàn bộ" },
            { icon: Check, label: "Đang hoạt động", value: activeCount, tagCls: "text-emerald-700 bg-emerald-50 border-emerald-100", tag: "Active" },
            { icon: Ban, label: "Đã khóa", value: accounts.length - activeCount, tagCls: "text-red-700 bg-red-50 border-red-100", tag: "Locked" },
          ].map(({ icon: Icon, label, value, tag, tagCls }) => (
            <div key={label} className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-secondary p-3 text-red-500"><Icon className="w-5 h-5" /></div>
                <span className={`px-2.5 py-1 border text-[8px] font-black tracking-widest uppercase ${tagCls || "border-primary/15 text-primary/40"}`}>{tag}</span>
              </div>
              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{label}</p>
              <p className="text-xl font-display font-black text-primary mt-1">{value.toLocaleString()}</p>
              <span className="text-[9px] text-red-500 font-semibold tracking-wider block mt-2 uppercase">Kredo Studio</span>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
            <Search className="w-4 h-4 text-red-500" />
            <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">Bộ lọc tìm kiếm</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-1.5">
              <label className={labelCls}>Tên nhân viên</label>
              <input type="text" value={searchName} onChange={e => setSearchName(e.target.value)} placeholder="Tìm kiếm..." className={inputCls} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className={labelCls}>Trạng thái</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={inputCls}>
                <option value="">Tất cả</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="LOCKED">Đã khóa</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className={labelCls}>Thao tác</label>
              <button onClick={loadEmployees} className="w-full bg-[#111111] hover:bg-red-500 text-white p-3 text-[10px] font-black tracking-widest uppercase transition-colors">Áp dụng</button>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-primary/5">
            <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">👥 Danh sách nhân viên</h2>
            <span className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">{accounts.length} nhân viên</span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-16"><p className="text-[10px] font-black tracking-widest uppercase text-primary/30">Không có nhân viên nào</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary/10">
                    {["Họ tên", "Email", "Điện thoại", "Vai trò", "Trạng thái", "Hành động"].map(h => (
                      <th key={h} className="py-4 px-4 text-[9px] font-black text-primary/40 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {accounts.filter(c => c.id !== 1).map(c => (
                    <tr key={c.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-primary text-white flex items-center justify-center font-display font-black text-[10px] flex-shrink-0">{c.customer?.fullName?.charAt(0) ?? c.username?.charAt(0) ?? "?"}</div>
                          <span className="text-[10px] font-black text-primary uppercase tracking-wide">{c.customer?.fullName ?? c.username ?? "—"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[10px] font-bold text-primary/60">{c.customer?.email ?? "—"}</td>
                      <td className="py-4 px-4 text-[10px] font-bold text-primary/60 font-mono">{c.customer?.phoneNumber ?? "—"}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 border border-primary/10 bg-secondary text-[8px] font-black tracking-widest uppercase text-primary/60">{c.role}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 border text-[8px] font-black tracking-widest uppercase ${c.statusLogin === "ACTIVE" ? "text-emerald-700 bg-emerald-50 border-emerald-100" : "text-red-700 bg-red-50 border-red-100"}`}>
                          {c.statusLogin === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSelectedCustomer(c.customer); setShowDetail(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-secondary hover:bg-[#111111] hover:text-white text-primary text-[9px] font-black tracking-widest uppercase transition-all border border-primary/5">
                            <Eye size={12} /> Xem
                          </button>
                          <button onClick={() => openEdit(c)} className="flex items-center gap-1.5 px-3 py-2 bg-secondary hover:bg-[#111111] hover:text-white text-primary text-[9px] font-black tracking-widest uppercase transition-all border border-primary/5">
                            <Edit2 size={12} /> Sửa
                          </button>
                          <button onClick={() => toggleStatus(c)} className={`flex items-center gap-1.5 px-3 py-2 text-[9px] font-black tracking-widest uppercase transition-all ${c.statusLogin === "ACTIVE" ? "bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-100" : "bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-100"}`}>
                            {c.statusLogin === "ACTIVE" ? <><Ban size={12} /> Khóa</> : <><Check size={12} /> Mở</>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {showDetail && selectedCustomer !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full shadow-2xl">
            <div className="bg-[#111111] px-8 py-6 flex justify-between items-center">
              <div>
                <span className="text-red-500 text-[9px] font-black tracking-[0.4em] uppercase">Chi tiết nhân viên</span>
                <h2 className="text-2xl font-display font-black text-white mt-1 uppercase">{selectedCustomer.fullName}</h2>
              </div>
              <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xl">×</button>
            </div>
            <div className="p-8 bg-secondary">
              <div className="bg-white border border-primary/5 p-6 grid grid-cols-2 gap-6">
                {[
                  { label: "Họ tên", value: selectedCustomer.fullName },
                  { label: "Email", value: selectedCustomer.email },
                  { label: "Điện thoại", value: selectedCustomer.phoneNumber },
                  { label: "Giới tính", value: selectedCustomer.gender },
                  { label: "Ngày sinh", value: selectedCustomer.dateOfBirth || "Chưa có" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className={labelCls}>{label}</p>
                    <p className="text-sm font-bold text-primary">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border-t border-primary/5 px-8 py-5 flex justify-end">
              <button onClick={() => setShowDetail(false)} className="px-6 py-3 bg-[#111111] text-white text-[10px] font-black tracking-widest uppercase hover:bg-red-500 transition-colors">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create/Edit Modal ── */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl">
            <div className="bg-[#111111] px-8 py-6 flex justify-between items-center flex-shrink-0">
              <div>
                <span className="text-red-500 text-[9px] font-black tracking-[0.4em] uppercase">{editingAccount ? "Cập nhật" : "Tạo mới"}</span>
                <h2 className="text-2xl font-display font-black text-white mt-1 uppercase">{editingAccount ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}</h2>
              </div>
              <button onClick={() => { setShowCreate(false); setEditingAccount(null); }} className="p-2 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xl">×</button>
            </div>
            <div className="overflow-y-auto flex-1 p-8 bg-secondary">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-primary/5 p-6 space-y-5">
                  <h3 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase pb-3 border-b border-primary/5">Thông tin cá nhân</h3>
                  {[
                    { label: "Họ tên", path: "customer.fullName", value: form.customer.fullName },
                    { label: "Email", path: "customer.email", value: form.customer.email },
                    { label: "Điện thoại", path: "customer.phoneNumber", value: form.customer.phoneNumber },
                  ].map(item => (
                    <div key={item.label}>
                      <label className={labelCls}>{item.label}</label>
                      <input className={inputCls} value={item.value} onChange={e => handleChange(item.path, e.target.value)} />
                    </div>
                  ))}
                  <div>
                    <label className={labelCls}>Giới tính</label>
                    <select className={inputCls} value={form.customer.gender} onChange={e => handleChange("customer.gender", e.target.value)}>
                      <option value="MALE">Nam</option><option value="FEMALE">Nữ</option><option value="OTHER">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Ngày sinh</label>
                    <input type="date" className={inputCls} value={form.customer.dateOfBirth} onChange={e => handleChange("customer.dateOfBirth", e.target.value)} />
                  </div>
                </div>
                <div className="bg-white border border-primary/5 p-6 space-y-5">
                  <h3 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase pb-3 border-b border-primary/5">Thông tin tài khoản</h3>
                  {[
                    { label: "Username", path: "username", value: form.username },
                    { label: "Password", path: "password", value: form.password, type: "password" },
                  ].map(item => (
                    <div key={item.label}>
                      <label className={labelCls}>{item.label}</label>
                      <input type={item.type || "text"} className={inputCls} value={item.value} onChange={e => handleChange(item.path, e.target.value)} />
                    </div>
                  ))}
                  <div>
                    <label className={labelCls}>Vai trò</label>
                    <input className={`${inputCls} opacity-60`} value={form.role} disabled />
                  </div>
                  <div>
                    <label className={labelCls}>Trạng thái</label>
                    <select className={inputCls} value={form.statusLogin} onChange={e => handleChange("statusLogin", e.target.value)}>
                      <option value="ACTIVE">Hoạt động</option><option value="LOCKED">Đã khóa</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border-t border-primary/5 px-8 py-5 flex justify-end gap-3 flex-shrink-0">
              <button onClick={() => { setShowCreate(false); setEditingAccount(null); }} className="px-6 py-3 border border-primary/10 text-primary/60 hover:text-primary text-[10px] font-black tracking-widest uppercase transition-colors">Hủy</button>
              <button onClick={submitForm} disabled={loading} className="px-6 py-3 bg-[#111111] hover:bg-red-500 text-white text-[10px] font-black tracking-widest uppercase transition-colors disabled:opacity-60">
                {editingAccount ? "Lưu thay đổi" : "Tạo nhân viên"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Google Meet Modal ── */}
      {showMeeting && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full shadow-2xl">
            <div className="bg-[#111111] px-8 py-6 flex justify-between items-center">
              <div>
                <span className="text-red-500 text-[9px] font-black tracking-[0.4em] uppercase">Lên lịch họp</span>
                <h2 className="text-2xl font-display font-black text-white mt-1 uppercase">Tạo Google Meet</h2>
              </div>
              <button onClick={() => setShowMeeting(false)} className="p-2 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xl">×</button>
            </div>
            <Formik
              initialValues={{ title: "", description: "", startTime: "", endTime: "" }}
              validationSchema={MeetingSchema}
              onSubmit={handleCreateMeeting}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="p-8 bg-secondary space-y-5">
                    <div className="bg-white border border-primary/5 p-6 space-y-5">
                      <div>
                        <label className={labelCls}>Tiêu đề cuộc họp</label>
                        <Field name="title" className={inputCls} placeholder="Ví dụ: Họp triển khai dự án" />
                        <ErrorMessage name="title" component="p" className="text-[9px] text-red-500 mt-1 font-bold uppercase tracking-wider" />
                      </div>
                      <div>
                        <label className={labelCls}>Mô tả nội dung</label>
                        <Field as="textarea" name="description" rows={3} className={`${inputCls} resize-none`} placeholder="Nội dung chi tiết..." />
                        <ErrorMessage name="description" component="p" className="text-[9px] text-red-500 mt-1 font-bold uppercase tracking-wider" />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className={labelCls}>Thời gian bắt đầu</label>
                          <Field name="startTime" type="datetime-local" className={inputCls} />
                          <ErrorMessage name="startTime" component="p" className="text-[9px] text-red-500 mt-1 font-bold uppercase tracking-wider" />
                        </div>
                        <div>
                          <label className={labelCls}>Thời gian kết thúc</label>
                          <Field name="endTime" type="datetime-local" className={inputCls} />
                          <ErrorMessage name="endTime" component="p" className="text-[9px] text-red-500 mt-1 font-bold uppercase tracking-wider" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border-t border-primary/5 px-8 py-5 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowMeeting(false)} className="px-6 py-3 border border-primary/10 text-primary/60 hover:text-primary text-[10px] font-black tracking-widest uppercase transition-colors">Hủy</button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-[#111111] hover:bg-red-500 text-white text-[10px] font-black tracking-widest uppercase transition-colors disabled:opacity-60">
                      {isSubmitting ? "Đang tạo..." : "Tạo cuộc họp"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}