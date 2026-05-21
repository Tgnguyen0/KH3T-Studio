// File: src/pages/Profile.jsx

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";

const API_BASE = "http://localhost:8080";

// --- API CLIENT ---
const api = {
    async get(url) {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}${url}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Network error");

        return data?.result ?? data;
    },

    async put(url, body) {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}${url}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Update failed");
        return data?.result ?? data;
    },

    async post(url, body) {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Create failed");
        return data?.result ?? data;
    },

    async delete(url) {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}${url}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Delete failed");
        }
        return true;
    },
};

// --- UTILS ---
const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const isProfileChanged = (profile, initialProfile) => {
    if (!profile || !initialProfile) return false;
    return (
        profile.fullName !== initialProfile.fullName ||
        profile.phoneNumber !== initialProfile.phoneNumber ||
        profile.gender !== initialProfile.gender ||
        formatDateForInput(profile.dateOfBirth) !==
        formatDateForInput(initialProfile.dateOfBirth)
    );
};

// --- ADDRESS SECTION ---
const AddressSection = ({ accountId, isCustomerProfile }) => {
    const [addresses, setAddresses] = useState([]);
    const [addressLoading, setAddressLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const [editingAddress, setEditingAddress] = useState(null);

    const [editForm, setEditForm] = useState({
        id: null,
        delivery_address: "",
        province: "",
        delivery_note: "",
        accountId: accountId
    });

    const [currentActionId, setCurrentActionId] = useState(null);

    const [newAddress, setNewAddress] = useState({
        delivery_address: "",
        delivery_note: "",
        province: "",
        accountId: accountId,
    });

    const fetchAddresses = async () => {
        if (!accountId) return;

        setAddressLoading(true);
        try {
            const data = await api.get(`/addresses/${accountId}`);
            const list = Array.isArray(data) ? data : [];

            setAddresses(list);
        } catch {
            toast.error("Không thể tải địa chỉ");
            setAddresses([]);
        } finally {
            setAddressLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [accountId]);

    const handleNewAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleStartEdit = (address) => {
        setShowAddForm(false);

        setEditingAddress(address.id);
        setCurrentActionId(null);

        setEditForm({
            id: address.id,
            delivery_address: address.delivery_address || "",
            province: address.province || "",
            delivery_note: address.delivery_note || "",
            accountId: accountId
        });
    };

    const handleCancelEdit = () => {
        setEditingAddress(null);
        setEditForm({
            id: null,
            delivery_address: "",
            province: "",
            delivery_note: "",
            accountId: accountId
        });
        setCurrentActionId(null);
    };

    const handleEditAddress = async (e) => {
        e.preventDefault();

        if (!editForm.id) return;

        if (!editForm.delivery_address.trim() || !editForm.province.trim()) {
            toast.error("Vui lòng nhập địa chỉ và Tỉnh/Thành phố.");
            return;
        }

        setCurrentActionId(editForm.id);

        try {
            await api.put("/addresses/update", editForm);

            toast.success("Cập nhật địa chỉ thành công!");
            handleCancelEdit();
            await fetchAddresses();

        } catch (error) {
            console.error("Lỗi cập nhật địa chỉ:", error);
            toast.error("Cập nhật địa chỉ thất bại: " + (error.message || "Lỗi không xác định"));
        } finally {
            setCurrentActionId(null);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        if (!newAddress.delivery_address.trim() || !newAddress.province.trim()) {
            toast.error("Vui lòng nhập địa chỉ và Tỉnh/Thành phố.");
            return;
        }

        setCurrentActionId("ADD_NEW");
        try {
            await api.post("/addresses/add", newAddress);
            toast.success("Đã thêm địa chỉ!");
            setShowAddForm(false);

            setNewAddress({
                delivery_address: "",
                delivery_note: "",
                province: "",
                accountId,
            });

            fetchAddresses();
        } catch {
            toast.error("Thêm địa chỉ thất bại");
        } finally {
            setCurrentActionId(null);
        }
    };

    const handleDeleteAddress = async (id) => {
        const addressId = parseInt(id, 10);

        if (isNaN(addressId) || addressId <= 0) {
            toast.error("Lỗi: ID địa chỉ không hợp lệ.");
            return;
        }

        if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;

        setCurrentActionId(addressId);
        try {
            await api.delete(`/addresses/${addressId}`);
            toast.success("Xóa địa chỉ thành công!");
            fetchAddresses();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setCurrentActionId(null);
        }
    };
    const isAddressLoading = (id) => currentActionId === id;

    return (
        <div className="bg-white border border-primary/5 p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-primary/5">
                <h2 className="text-sm font-display font-black uppercase tracking-[0.2em] text-primary">Địa chỉ giao hàng</h2>

                {isCustomerProfile && (
                    <button
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            handleCancelEdit();
                        }}
                        className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline"
                    >
                        {showAddForm ? "Hủy" : "+ Thêm mới"}
                    </button>
                )}
            </div>

            {addressLoading && !editingAddress ? (
                <p className="text-center text-xs text-primary/30 uppercase tracking-widest py-8">Đang tải...</p>
            ) : addresses.length === 0 && !showAddForm ? (
                <p className="text-center text-xs text-primary/30 uppercase tracking-widest py-8">Chưa có địa chỉ nào được lưu.</p>
            ) : (
                <div className="flex-grow space-y-4 pr-2">
                    {addresses.map((addr) => (
                        <div key={addr.id}>
                            {editingAddress === addr.id ? (
                                // --- FORM EDIT ---
                                <form
                                    onSubmit={handleEditAddress}
                                    className="bg-secondary p-6 border border-primary/10 space-y-4"
                                >
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500">
                                        Chỉnh sửa địa chỉ
                                    </h4>

                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Địa chỉ chi tiết</label>
                                        <input
                                            name="delivery_address"
                                            value={editForm.delivery_address}
                                            onChange={handleEditFormChange}
                                            placeholder="Số nhà, tên đường..."
                                            required
                                            className="w-full bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-primary/20"
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Tỉnh/Thành phố</label>
                                        <input
                                            name="province"
                                            value={editForm.province}
                                            onChange={handleEditFormChange}
                                            placeholder="Tỉnh/Thành phố"
                                            required
                                            className="w-full bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-primary/20"
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Ghi chú giao hàng</label>
                                        <input
                                            name="delivery_note"
                                            value={editForm.delivery_note}
                                            onChange={handleEditFormChange}
                                            placeholder="Ghi chú giao hàng..."
                                            className="w-full bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-primary/20"
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-2">
                                        <button
                                            type="submit"
                                            disabled={isAddressLoading(editForm.id)}
                                            className="flex-1 py-3 bg-[#111111] hover:bg-accent text-white text-[9px] font-black tracking-widest uppercase transition-colors disabled:opacity-50"
                                        >
                                            {isAddressLoading(editForm.id) ? "Đang lưu..." : "Lưu thay đổi"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="px-4 py-3 border border-primary/10 text-[9px] font-black tracking-widest uppercase hover:bg-primary/5 transition-colors bg-white"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // --- CARD ADDRESS ---
                                <div className="bg-secondary border border-primary/5 p-5 hover:border-primary/15 transition-all flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <p className="font-display font-black text-xs uppercase tracking-tight text-primary">
                                            {addr.delivery_address}
                                        </p>
                                        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                                            {addr.province}
                                        </p>
                                        {addr.delivery_note && (
                                            <p className="text-[10px] text-red-500 font-semibold italic">
                                                Ghi chú: {addr.delivery_note}
                                            </p>
                                        )}
                                    </div>

                                    {isCustomerProfile && addr.id > 0 && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleStartEdit(addr)}
                                                disabled={currentActionId !== null}
                                                className="w-8 h-8 flex items-center justify-center border border-primary/10 bg-white hover:border-primary transition-colors text-[10px]"
                                                title="Sửa"
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                onClick={() => handleDeleteAddress(addr.id)}
                                                disabled={currentActionId !== null}
                                                className="w-8 h-8 flex items-center justify-center border border-primary/10 bg-white hover:border-accent hover:text-accent transition-colors text-[10px]"
                                                title="Xóa"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ADD FORM */}
            {showAddForm && (
                <form
                    onSubmit={handleAddAddress}
                    className="mt-8 bg-secondary p-6 border border-primary/10 space-y-4"
                >
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500">Thêm địa chỉ mới</h4>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Địa chỉ chi tiết</label>
                        <input
                            name="delivery_address"
                            value={newAddress.delivery_address}
                            onChange={handleNewAddressChange}
                            placeholder="Số nhà, tên đường..."
                            required
                            className="w-full bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-primary/20"
                        />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Tỉnh/Thành phố</label>
                        <input
                            name="province"
                            value={newAddress.province}
                            onChange={handleNewAddressChange}
                            placeholder="Tỉnh/Thành phố"
                            required
                            className="w-full bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-primary/20"
                        />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Ghi chú giao hàng</label>
                        <input
                            name="delivery_note"
                            value={newAddress.delivery_note}
                            onChange={handleNewAddressChange}
                            placeholder="Ghi chú giao hàng..."
                            className="w-full bg-white p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-primary/20"
                        />
                    </div>

                    <button
                        disabled={isAddressLoading("ADD_NEW")}
                        className="w-full py-4 bg-[#111111] hover:bg-accent text-white text-[10px] font-black tracking-[0.2em] uppercase transition-colors shadow-md disabled:opacity-50"
                    >
                        {isAddressLoading("ADD_NEW") ? "Đang lưu..." : "Lưu địa chỉ"}
                    </button>
                </form>
            )}
        </div>
    );
};

// --- PROFILE PAGE ---
const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [initialProfile, setInitialProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        id: null,
        accountId: null,
        fullName: "",
        phoneNumber: "",
        gender: "MALE",
        dateOfBirth: "",
    });

    const fetchProfile = async () => {
        setLoading(true);

        try {
            const customerData = await api.get("/customers/profile");

            if (!customerData) {
                throw new Error("Không tìm thấy thông tin khách hàng");
            }

            const newProfile = {
                id: customerData.id,
                accountId: customerData.accountId || null,
                fullName: customerData.fullName || "",
                phoneNumber: customerData.phoneNumber || "",
                email: customerData.email || "",
                gender: customerData.gender || "MALE",
                dateOfBirth: customerData.dateOfBirth || null,
            };

            setProfile(newProfile);
            setInitialProfile(newProfile);

            setFormData({
                id: newProfile.id,
                accountId: newProfile.accountId,
                fullName: newProfile.fullName,
                phoneNumber: newProfile.phoneNumber,
                email: newProfile.email,
                gender: newProfile.gender,
                dateOfBirth: formatDateForInput(newProfile.dateOfBirth),
            });

        } catch (err) {
            console.error("Lỗi khi tải hồ sơ:", err);
            toast.error("Không thể tải thông tin cá nhân. Vui lòng đăng nhập lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // --- VALIDATION LOGIC ---
    const NAME_REGEX = /^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ\s]+$/;
    const PHONE_REGEX = /^(0|\+84)[3|5|7|8|9][0-9]{8,9}$/;

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Vui lòng nhập Họ và tên.";
            isValid = false;
        } else if (!NAME_REGEX.test(formData.fullName)) {
            newErrors.fullName = "Họ và tên chỉ được chứa chữ cái và khoảng trắng.";
            isValid = false;
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Vui lòng nhập Số điện thoại.";
            isValid = false;
        } else if (!PHONE_REGEX.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Định dạng số điện thoại không hợp lệ.";
            isValid = false;
        }

        if (formData.dateOfBirth) {
            const today = new Date().toISOString().split('T')[0];
            if (formData.dateOfBirth >= today) {
                newErrors.dateOfBirth = "Ngày sinh không thể ở tương lai.";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setProfile((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin đã nhập.");
            return;
        }

        if (!formData.id) {
            toast.error("Không thể xác định ID khách hàng.");
            return;
        }

        setSaving(true);
        try {
            await api.put("/customers/update-profile", {
                id: formData.id,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth || null,
            });

            toast.success("Cập nhật thông tin thành công!");
            await fetchProfile();
        } catch (err) {
            toast.error(err.message || "Cập nhật thông tin thất bại.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh] bg-secondary">
                <div className="w-10 h-10 border-2 border-red-500 border-t-transparent animate-spin"></div>
            </div>
        );
    }

    const hasChanged = isProfileChanged(profile, initialProfile);

    return (
        <div className="min-h-screen bg-secondary py-16 selection:bg-accent selection:text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="flex justify-between items-end mb-12 pb-6 border-b border-primary/5">
                    <h1 className="text-3xl lg:text-4xl font-display font-black uppercase tracking-tight text-primary">Hồ sơ cá nhân</h1>
                    <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">
                        KREDO MEMBER ID: #{formData.id}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                    
                    {/* LEFT COLUMN - GENERAL PROFILE */}
                    <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-primary/5 p-8 space-y-6">
                        <h2 className="text-sm font-display font-black uppercase tracking-[0.2em] text-primary pb-3 border-b border-primary/5 mb-2">Thông tin tài khoản</h2>

                        {/* Username / Email */}
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">TÊN ĐĂNG NHẬP / EMAIL</label>
                            <input
                                value={profile.email}
                                readOnly
                                className="w-full bg-secondary p-3 text-xs font-semibold text-primary/50 cursor-not-allowed border border-primary/5 focus:outline-none"
                            />
                        </div>

                        {/* Full Name */}
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">HỌ VÀ TÊN</label>
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Họ và tên của bạn"
                                className={`w-full bg-secondary p-3 text-xs font-semibold focus:outline-none transition-all placeholder-primary/20 ${
                                    errors.fullName ? 'ring-1 ring-accent' : 'focus:ring-1 focus:ring-red-500'
                                }`}
                            />
                            {errors.fullName && (
                                <p className="text-[10px] text-accent font-black tracking-wide mt-1 uppercase">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">SỐ ĐIỆN THOẠI</label>
                            <input
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Số điện thoại của bạn"
                                className={`w-full bg-secondary p-3 text-xs font-semibold focus:outline-none transition-all placeholder-primary/20 ${
                                    errors.phoneNumber ? 'ring-1 ring-accent' : 'focus:ring-1 focus:ring-red-500'
                                }`}
                            />
                            {errors.phoneNumber && (
                                <p className="text-[10px] text-accent font-black tracking-wide mt-1 uppercase">{errors.phoneNumber}</p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">NGÀY SINH</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className={`w-full bg-secondary p-3 text-xs font-semibold focus:outline-none transition-all ${
                                    errors.dateOfBirth ? 'ring-1 ring-accent' : 'focus:ring-1 focus:ring-red-500'
                                }`}
                            />
                            {errors.dateOfBirth && (
                                <p className="text-[10px] text-accent font-black tracking-wide mt-1 uppercase">{errors.dateOfBirth}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">GIỚI TÍNH</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full bg-secondary p-3 text-xs font-semibold focus:outline-none transition-all cursor-pointer focus:ring-1 focus:ring-red-500"
                            >
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>
                        </div>

                        {/* Save Button */}
                        <button
                            disabled={!hasChanged || saving}
                            className="w-full mt-4 py-4 bg-[#111111] hover:bg-accent text-white text-[10px] font-black tracking-[0.2em] uppercase transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </form>

                    {/* RIGHT COLUMN - ADDRESS LIST */}
                    <div className="lg:col-span-5">
                        <AddressSection accountId={formData.accountId} isCustomerProfile={true} />
                    </div>
                </div>
            </div>
            <ChatBot />
            <Contact />
        </div>
    );
};

export default Profile;
