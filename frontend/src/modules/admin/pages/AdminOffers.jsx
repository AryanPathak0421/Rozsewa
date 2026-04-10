import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CheckCircle, XCircle, Percent, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminOffers = () => {
    const { setTitle } = useOutletContext();
    const { toast } = useToast();
    
    const [offers, setOffers] = useState([
        { id: "OFR-01", vendor: "Royal Salon", title: "Summer Special Combo", discount: "20% Off", validTill: "2026-05-01", status: "pending" },
        { id: "OFR-02", vendor: "Apex Delivery", title: "First Free Delivery", discount: "100% Off up to ₹50", validTill: "2026-06-30", status: "rejected" },
        { id: "OFR-03", vendor: "Rahul Plumber", title: "Monsoon Fix", discount: "Flat ₹100 Off", validTill: "2026-08-15", status: "approved" },
    ]);

    useEffect(() => {
        setTitle("Offer Approvals");
    }, [setTitle]);

    const handleAction = (id, action) => {
        setOffers(prev => prev.map(o => o.id === id ? { ...o, status: action } : o));
        toast({ title: `Offer ${action}`, description: `Offer ${id} marked as ${action} on the platform.` });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-foreground">Offer Approvals</h1>
                <p className="text-sm text-muted-foreground mt-1">Review discount campaigns proposed by vendors for the customer app.</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold">Offer details</th>
                                <th className="px-6 py-4 font-bold">Vendor</th>
                                <th className="px-6 py-4 font-bold">Discount</th>
                                <th className="px-6 py-4 font-bold">Validity</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {offers.map(offer => (
                                <tr key={offer.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 flex items-center gap-1.5"><Percent className="h-4 w-4 text-emerald-600"/> {offer.title}</p>
                                        <p className="text-xs text-gray-500 font-mono mt-0.5">{offer.id}</p>
                                    </td>
                                    <td className="px-6 py-4 font-bold">{offer.vendor}</td>
                                    <td className="px-6 py-4 font-black text-emerald-700">{offer.discount}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-600">{offer.validTill}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                            offer.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                                            offer.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                                        }`}>
                                            {offer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {offer.status === 'pending' ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleAction(offer.id, 'approved')} className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition shadow-sm" title="Approve">
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleAction(offer.id, 'rejected')} className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm" title="Reject">
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm" title="View details">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <button className="text-xs font-bold text-blue-600 hover:underline">View details</button>
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

export default AdminOffers;
