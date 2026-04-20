// File: src/pages/Profile.jsx

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ChatBot from "../components/ChatBot";
import  Contact  from "../components/Contact";

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

    // Hàm delete cho API client
    async delete(url) {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}${url}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        // Chỉ kiểm tra res.ok cho DELETE
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
            toast.error("Failed to load addresses");
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
        setCurrentActionId(null); // FIX: Ensure currentActionId is null when starting edit

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

        // Validation for Edit Address Form (optional but recommended)
        if (!editForm.delivery_address.trim() || !editForm.province.trim()) {
            toast.error("Address and Province are required.");
            return;
        }

        setCurrentActionId(editForm.id);

        try {
            await api.put("/addresses/update", editForm);

            toast.success("Address updated successfully!");
            handleCancelEdit();
            await fetchAddresses();

        } catch (error) {
            console.error("Error updating address:", error);
            toast.error("Failed to update address: " + (error.message || "Unknown error"));
        } finally {
            // Reset loading state
            setCurrentActionId(null);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        // Validation for Add Address Form
        if (!newAddress.delivery_address.trim() || !newAddress.province.trim()) {
            toast.error("Address and Province are required.");
            return;
        }

        setCurrentActionId("ADD_NEW");
        try {
            await api.post("/addresses/add", newAddress);
            toast.success("Address added!");
            setShowAddForm(false);

            setNewAddress({
                delivery_address: "",
                delivery_note: "",
                province: "",
                accountId,
            });

            fetchAddresses();
        } catch {
            toast.error("Failed to add address");
        } finally {
            setCurrentActionId(null);
        }
    };

    const handleDeleteAddress = async (id) => {
        // BƯỚC FIX: Ép kiểu ID thành số nguyên rõ ràng
        const addressId = parseInt(id, 10);

        if (isNaN(addressId) || addressId <= 0) {
            toast.error("Error: Invalid Address ID.");
            console.error("Attempted to delete address with invalid ID:", id);
            return;
        }

        if (!window.confirm("Are you sure you want to delete this address?")) return;

        // SỬ DỤNG addressId đã được xác thực
        setCurrentActionId(addressId);
        try {
            // DÙNG addressId (số nguyên) để gọi API
            await api.delete(`/addresses/${addressId}`);
            toast.success("Address deleted successfully!");
            fetchAddresses();
        } catch (err) {
            // Lỗi từ Backend (ví dụ: "Address not found") sẽ được hiển thị
            toast.error(err.message);
        } finally {
            setCurrentActionId(null);
        }
    };
    const isAddressLoading = (id) => currentActionId === id;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Shipping Addresses</h2>

                {isCustomerProfile && (
                    <button
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            handleCancelEdit();
                        }}
                        className="text-red-600 hover:text-red-800 font-medium"
                    >
                        {showAddForm ? "Cancel Add" : "Add New"}
                    </button>
                )}
            </div>

            {addressLoading && !editingAddress ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : addresses.length === 0 && !showAddForm ? (
                <p className="text-center text-gray-500 py-8">No saved addresses yet.</p>
            ) : (
                <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                    {addresses.map((addr) => (
                        <div key={addr.id}>
                            {editingAddress === addr.id ? (
                                // --- FORM EDIT ---
                                <form
                                    onSubmit={handleEditAddress}
                                    className="bg-red-100 rounded-lg p-4 border-2 border-red-500"
                                >
                                    <h4 className="font-bold mb-3 text-red-700">
                                        Edit Address
                                    </h4>

                                    <input
                                        name="delivery_address"
                                        value={editForm.delivery_address}
                                        onChange={handleEditFormChange}
                                        placeholder="Street address..."
                                        required
                                        className="w-full p-2 mb-2 border border-red-300 rounded"
                                    />

                                    <input
                                        name="province"
                                        value={editForm.province}
                                        onChange={handleEditFormChange}
                                        placeholder="Province"
                                        required
                                        className="w-full p-2 mb-2 border border-red-300 rounded"
                                    />

                                    <input
                                        name="delivery_note"
                                        value={editForm.delivery_note}
                                        onChange={handleEditFormChange}
                                        placeholder="Delivery note..."
                                        className="w-full p-2 mb-3 border border-red-300 rounded"
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={isAddressLoading(editForm.id)}
                                            className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {isAddressLoading(editForm.id)
                                                ? "Updating..."
                                                : "Save Changes"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // --- CARD ADDRESS ---
                                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md flex justify-between">
                                    <div>
                                        {/* BỔ SUNG: Hiển thị địa chỉ chi tiết */}
                                        <p className="font-semibold text-black mb-1">
                                            {addr.delivery_address}
                                        </p>

                                        <p className="text-sm text-gray-600 mb-1">
                                            {addr.province}
                                        </p>

                                        <p className="text-sm text-gray-500 italic">
                                            Note: {addr.delivery_note || "None"}
                                        </p>
                                    </div>

                                    {isCustomerProfile && addr.id > 0 && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleStartEdit(addr)}
                                                disabled={currentActionId !== null}
                                                className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                onClick={() => handleDeleteAddress(addr.id)}
                                                disabled={currentActionId !== null}
                                                className="text-red-600 hover:bg-red-100 p-1 rounded"
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
                    className="mt-6 bg-red-50 rounded-lg p-4"
                >
                    <h4 className="font-bold mb-3 text-red-700">Add New Address</h4>

                    <input
                        name="delivery_address"
                        value={newAddress.delivery_address}
                        onChange={handleNewAddressChange}
                        placeholder="Street address..."
                        required
                        className="w-full p-3 mb-3 border border-gray-300 rounded"
                    />


                    <input
                        name="province"
                        value={newAddress.province}
                        onChange={handleNewAddressChange}
                        placeholder="Province"
                        required
                        className="w-full p-3 mb-3 border border-gray-300 rounded"
                    />

                    <input
                        name="delivery_note"
                        value={newAddress.delivery_note}
                        onChange={handleNewAddressChange}
                        placeholder="Delivery note"
                        className="w-full p-3 mb-4 border border-gray-300 rounded"
                    />

                    <button
                        disabled={isAddressLoading("ADD_NEW")}
                        className="w-full bg-red-600 text-white p-3 rounded font-semibold hover:bg-red-700 disabled:opacity-50"
                    >
                        {isAddressLoading("ADD_NEW") ? "Saving..." : "Save Address"}
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
    const [errors, setErrors] = useState({}); // <--- THÊM: State để lưu lỗi

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
                throw new Error("Customer profile not found"); // Đổi sang Tiếng Anh
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
            console.error("Error fetching profile:", err);
            toast.error("Failed to load personal information. Please log in again."); // Đổi sang Tiếng Anh
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // --- VALIDATION LOGIC ---
    const NAME_REGEX = /^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ\s]+$/;
    // Regex cho SĐT VN: Bắt đầu bằng 0 hoặc +84, theo sau là 9-10 chữ số (vd: 0901234567 hoặc +84901234567)
    const PHONE_REGEX = /^(0|\+84)[3|5|7|8|9][0-9]{8,9}$/;

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // 1. Full Name
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full Name is required.";
            isValid = false;
        } else if (!NAME_REGEX.test(formData.fullName)) {
            newErrors.fullName = "Full Name must contain only letters and spaces.";
            isValid = false;
        }

        // 2. Phone Number
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone Number is required.";
            isValid = false;
        } else if (!PHONE_REGEX.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Invalid phone number format (e.g., 0901234567 or +84901234567).";
            isValid = false;
        }

        // 3. Date of Birth
        if (formData.dateOfBirth) {
            const today = new Date().toISOString().split('T')[0];
            if (formData.dateOfBirth >= today) {
                newErrors.dateOfBirth = "Date of Birth cannot be in the future.";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };
    // --- END VALIDATION LOGIC ---


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setProfile((prev) => ({ ...prev, [name]: value }));

        // Xóa lỗi khi người dùng bắt đầu gõ lại
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Kiểm tra Validation
        if (!validateForm()) {
            toast.error("Please review the information entered.");
            return;
        }

        if (!formData.id) {
            toast.error("Customer ID could not be determined.");
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

            toast.success("Profile updated successfully!");
            // Cập nhật lại initialProfile để reset trạng thái hasChanged
            await fetchProfile();
        } catch (err) {
            toast.error(err.message || "Profile Update Failed.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div></div>;

    const hasChanged = isProfileChanged(profile, initialProfile);

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-red-50 min-h-screen">
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-black">
                        My Profile
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
                        <div className="space-y-6">
                            {/* Username / Email */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Username / Email</label>
                                <input
                                    value={profile.email}
                                    readOnly
                                    className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                                />
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={`w-full p-3 border rounded-lg focus:ring-2 transition ${
                                        errors.fullName
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                            : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                                    }`}
                                />
                                {errors.fullName && ( // <-- HIỂN THỊ LỖI
                                    <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    className={`w-full p-3 border rounded-lg focus:ring-2 transition ${
                                        errors.phoneNumber
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                            : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                                    }`}
                                />
                                {errors.phoneNumber && ( // <-- HIỂN THỊ LỖI
                                    <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 transition ${
                                        errors.dateOfBirth
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                            : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                                    }`}
                                />
                                {errors.dateOfBirth && ( // <-- HIỂN THỊ LỖI
                                    <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
                                )}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            {/* Save Button */}
                            <button
                                disabled={!hasChanged || saving}
                                className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>

                    <AddressSection accountId={formData.accountId} isCustomerProfile={true} />
                </div>
            </div>
            <ChatBot/>
            <Contact/>
        </div>
    );
};

export default Profile;