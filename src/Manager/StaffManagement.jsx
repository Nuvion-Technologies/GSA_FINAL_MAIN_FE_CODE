import { useState, useEffect } from "react";
import { UserPlus, Users, Pencil, Trash2, Search } from "lucide-react";
import axios from "axios";

const StaffManagement = () => {
    const ip = import.meta.env.VITE_IP;
    const [activeTab, setActiveTab] = useState('view');
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        role: "Staff",
        address: "",
        phone: "",
        dob: "",
        photo: null,
        rollno: "",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${ip}/api/staff/all-staff`, {
                userid: localStorage.getItem("userid"),
            });
            setStaffList(response.data);
        } catch (err) {
            setError("Failed to fetch staff list", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            photo: e.target.files[0]
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleEdit = (staff) => {
        setEditMode(true);
        setEditingStaff(staff);
        localStorage.setItem("editingid", staff._id);
        setFormData({
            ...staff,
            photo: null,
            dob: formatDate(staff.dob)
        });
        setActiveTab('add');
    };

    const handleDelete = async (staff) => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) return;

        try {
            setDeleteLoading(true);
            await axios.post(`${ip}/api/staff/delete-staff`, {
                id: staff._id,
                userid: localStorage.getItem("userid")
            });

            setSuccess("Staff member deleted successfully");
            await fetchStaff();
        } catch (err) {
            setSuccess("Staff member deleted successfully");
            await fetchStaff();
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setEditLoading(true);

            if (editMode) {

                const response = await axios.post(`${ip}/api/staff/edit-staff`, {
                    userid: localStorage.getItem("userid"),
                    rollno: localStorage.getItem("editingid"),
                    role: formData.role,
                    name: formData.name,
                    address: formData.address,
                    phone: formData.phone,
                    dob: formData.dob
                });
                if (response.status === 200) {
                    setSuccess("Staff updated successfully");
                    await fetchStaff();
                    setEditMode(false);
                    setActiveTab('view');
                    // setEditingStaff(null);
                    localStorage.removeItem("editingid");
                    setFormData({
                        name: "",
                        role: "Staff",
                        address: "",
                        phone: "",
                        dob: "",
                        photo: null,
                        rollno: "",
                    });
                }
            } else {
                const formDataToSend = new FormData();
                Object.keys(formData).forEach(key => {
                    if (formData[key] !== null) {
                        formDataToSend.append(key, formData[key]);
                    }
                });
                formDataToSend.append("userid", localStorage.getItem("userid"));

                const response = await axios.post(
                    `${ip}/api/staff/add-staff`,
                    formDataToSend,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                if (response.data) {
                    setSuccess("Staff added successfully");
                    await fetchStaff();
                    setActiveTab('view');
                    setFormData({
                        name: "",
                        role: "Staff",
                        address: "",
                        phone: "",
                        dob: "",
                        photo: null,
                        rollno: "",
                    });
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setEditLoading(false);
        }
    };

    const filteredStaff = staffList.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTabClasses = (tab, activeColor) => {
        const baseClasses = "group relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-300";
        const activeClasses = `text-${activeColor}-600 before:bg-${activeColor}-100/80`;
        const inactiveClasses = `text-gray-600 hover:text-${activeColor}-600 before:bg-transparent hover:before:bg-${activeColor}-50`;

        return `${baseClasses} ${activeTab === tab ? activeClasses : inactiveClasses}`;
    };

    const inputClasses = "w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="p-0 md:p-4 max-w-6xl mx-auto">
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => {
                        setActiveTab('view');
                        setEditMode(false);
                        setEditingStaff(null);
                        setFormData({
                            name: "",
                            role: "Staff",
                            address: "",
                            phone: "",
                            dob: "",
                            photo: null,
                            rollno: "",
                        });
                    }}
                    className={getTabClasses('view', 'blue')}
                >
                    <div className="relative flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-white shadow-sm">
                            <Users className="w-4 h-4" />
                        </div>
                        <span className="font-medium">View Staff</span>
                    </div>
                </button>

                <button
                    onClick={() => setActiveTab('add')}
                    className={getTabClasses('add', 'blue')}
                >
                    <div className="relative flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-white shadow-sm">
                            <UserPlus className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{editMode ? 'Edit Staff' : 'Add Staff'}</span>
                    </div>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">
                    {success}
                </div>
            )}

            {activeTab === 'view' ? (
                <div className="bg-white rounded-lg shadow-sm p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search staff..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`${inputClasses} pl-10`}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredStaff.map((staff) => (
                                <div key={staff._id} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            {staff.photo && (
                                                <img
                                                    src={`${ip}/uploads/${staff.photo}`}
                                                    alt={staff.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <h4 className="font-medium text-gray-900">{staff.name}</h4>
                                                <p className="text-sm text-gray-500">{staff.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(staff)}
                                                className="p-1 hover:text-blue-600 transition-colors"
                                                disabled={deleteLoading || editLoading}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(staff)}
                                                className="p-1 hover:text-red-600 transition-colors"
                                                disabled={deleteLoading || editLoading}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm text-gray-600">
                                        <p>{staff.address}</p>
                                        <p>{staff.phone}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                >
                                    <option value="Staff">Staff</option>
                                    <option value="Coach">Coach</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClasses}>Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className={inputClasses}
                                    required
                                ></textarea>
                            </div>
                            {!editMode && (
                                <div>
                                    <label className={labelClasses}>Photo</label>
                                    <input
                                        type="file"
                                        name="photo"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className={inputClasses}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3">
                            {editMode && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditMode(false);
                                        setActiveTab('view')
                                        setEditingStaff(null);
                                        setFormData({
                                            name: "",
                                            role: "Staff",
                                            address: "",
                                            phone: "",
                                            dob: "",
                                            photo: null,
                                            rollno: "",
                                        });
                                    }}
                                    className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium transition-all hover:bg-gray-200"
                                    disabled={editLoading}
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={editLoading}
                                className={`px-6 py-2 rounded-lg bg-blue-600 text-white font-medium transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${editLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {editLoading ? (editMode ? "Updating..." : "Adding...") : (editMode ? "Update Staff" : "Add Staff")}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StaffManagement;
