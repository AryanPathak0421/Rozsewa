import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { CheckCircle, XCircle, Search, FileText, Loader2, MapPin, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import API from "@/lib/api";

const AdminKYC = () => {
    const { setTitle } = useOutletContext();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTitle("KYC Verification");
        fetchKycRequests();
    }, [setTitle]);

    const fetchKycRequests = async () => {
        setLoading(true);
        try {
            const { data } = await API.get("/admin/providers");
            // Show all for now, filter for pending in logic
            setProviders(data);
        } catch (err) {
            toast({ title: "Fetch Failed", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        const newStatus = action === 'approve' ? 'verified' : 'rejected';
        try {
            await API.put(`/admin/providers/${id}/status`, { status: newStatus });
            setProviders(prev => prev.map(p => p._id === id ? { ...p, status: newStatus } : p));
            toast({ title: `KYC ${action === 'approve' ? 'Approved' : 'Rejected'}`, description: `Provider account status updated.` });
        } catch (err) {
            toast({ title: "Action Failed", variant: "destructive" });
        }
    };

    const filteredRequests = (providers || []).filter(p => {
        const s = (searchTerm || "").toLowerCase();
        return p.shopName?.toLowerCase().includes(s) ||
            p.ownerName?.toLowerCase().includes(s) ||
            p.vendorCode?.toLowerCase().includes(s);
    });

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">KYC Verification</h1>
                    <p className="text-sm text-gray-500 font-medium">Approve or reject vendor proof of identity.</p>
                </div>

                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by vendor name, code, or owner..."
                        className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50/50 text-[10px] uppercase font-black tracking-widest text-gray-400 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5">Req Code</th>
                                <th className="px-6 py-5">Vendor Detail</th>
                                <th className="px-6 py-5">KYC Documents</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-gray-400 italic">No KYC requests found.</td>
                                </tr>
                            ) : filteredRequests.map(req => (
                                <tr key={req._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-emerald-700">{req.vendorCode}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <p className="font-extrabold text-gray-900 text-sm">{req.shopName}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {req.mobile}</span>
                                                <span className="flex items-center gap-1 mx-2"><MapPin className="h-3 w-3 text-emerald-500" /> {req.address?.slice(0, 15)}...</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-14 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-gray-300" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-[11px] uppercase tracking-wider">{req.kycAadhaar ? 'Aadhaar Card' : 'No Document'}</p>
                                                <p className="text-[10px] tracking-[0.2em] text-gray-500 font-bold">{req.kycAadhaar || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border ${req.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                req.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {req.status === 'pending' ? (
                                            <div className="flex items-center justify-center gap-2.5">
                                                <button
                                                    onClick={() => handleAction(req._id, 'approve')}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-emerald-600/20"
                                                    title="Approve KYC"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req._id, 'reject')}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-all shadow-sm"
                                                    title="Reject KYC"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-1.5 text-gray-400">
                                                <CheckCircle className="h-3 w-3" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminKYC;
