import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Plus, Search, Mail, Phone, Trash2,
    UserCircle, BadgeCheck, AlertCircle, Loader2,
    X, Save, IndianRupee, Key, Edit3
} from "lucide-react";
import API from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const AdminHRM = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        registrationCommission: 50
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const { data } = await API.get("/admin/employees");
            setEmployees(data);
        } catch (err) {
            toast({ title: "Failed to fetch employees", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                const { data } = await API.put(`/admin/employees/${editId}`, formData);
                setEmployees(employees.map(emp => emp._id === editId ? data : emp));
                toast({ title: "Employee updated successfully!" });
            } else {
                const { data } = await API.post("/admin/employees", formData);
                setEmployees([data, ...employees]);
                toast({ title: "Employee registered successfully!" });
            }
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            toast({ title: editId ? "Update failed" : "Registration failed", variant: "destructive" });
        }
    };

    const resetForm = () => {
        setFormData({ name: "", email: "", mobile: "", registrationCommission: 50 });
        setEditId(null);
    };

    const openEditModal = (emp) => {
        setFormData({
            name: emp.name,
            email: emp.email,
            mobile: emp.mobile,
            registrationCommission: emp.registrationCommission
        });
        setEditId(emp._id);
        setShowAddModal(true);
    };

    const handleDeleteEmployee = async (id) => {
        if (!window.confirm("Are you sure you want to remove this employee?")) return;
        try {
            await API.delete(`/admin/employees/${id}`);
            setEmployees(employees.filter(e => e._id !== id));
            toast({ title: "Employee removed" });
        } catch (err) {
            toast({ title: "Delete failed", variant: "destructive" });
        }
    };

    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.employeeId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">HRM & Employees</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage network growth and commissions</p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                >
                    <Plus className="h-4 w-4" /> Register Employee
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-emerald-600 mb-2">
                        <Users className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Total Staff</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{employees.length}</p>
                </div>
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-blue-600 mb-2">
                        <BadgeCheck className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Total Referrals</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">
                        {employees.reduce((acc, curr) => acc + (curr.referralCount || 0), 0)}
                    </p>
                </div>
            </div>

            <div className="rounded-[2.5rem] border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3.5 pl-11 pr-4 text-sm font-bold focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Employee</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Referrals</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Commission Rate</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold italic">
                                        No employees found.
                                    </td>
                                </tr>
                            ) : filtered.map((emp) => (
                                <tr key={emp._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black">{emp.name}</p>
                                                <p className="text-[10px] text-emerald-600 uppercase font-black tracking-tighter">{emp.employeeId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-600 flex items-center gap-2"><Mail className="h-3 w-3" /> {emp.email}</p>
                                            <p className="text-xs font-bold text-gray-600 flex items-center gap-2"><Phone className="h-3 w-3" /> {emp.mobile}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black">
                                            {emp.referralCount || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-black text-sm text-gray-900">
                                        ₹{emp.registrationCommission}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(emp)}
                                                className="p-2 text-gray-300 hover:text-blue-500 transition-colors"
                                            >
                                                <Edit3 className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEmployee(emp._id)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Employee Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl p-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase">
                                        {editId ? "Edit Staff Member" : "New Staff Member"}
                                    </h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1 italic">
                                        {editId ? "Update existing employee details" : "Register a new RozSewa employee"}
                                    </p>
                                </div>
                                <button onClick={() => { setShowAddModal(false); resetForm(); }} className="p-2 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddEmployee} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-3.5 text-sm font-bold focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                                            placeholder="e.g. Rahul Verma"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mobile No</label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-3.5 text-sm font-bold focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                                            placeholder="91XXXXXXXXXX"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-3.5 text-sm font-bold focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                                        placeholder="email@rozsewa.com"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Reg. Commission (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            required
                                            type="number"
                                            value={formData.registrationCommission}
                                            onChange={(e) => setFormData({ ...formData, registrationCommission: e.target.value })}
                                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 pl-11 pr-4 py-3.5 text-sm font-bold focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} className="flex-1 rounded-2xl border border-gray-100 bg-white py-4 text-sm font-black text-gray-500 hover:bg-gray-50 transition-all uppercase tracking-widest">Cancel</button>
                                    <button type="submit" className="flex-1 rounded-2xl bg-emerald-600 py-4 text-sm font-black text-white shadow-xl shadow-emerald-600/20 hover:shadow-2xl transition-all uppercase tracking-widest">
                                        {editId ? "Update Employee" : "Save Employee"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminHRM;
