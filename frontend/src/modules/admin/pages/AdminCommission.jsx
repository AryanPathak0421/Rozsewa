import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Landmark, ArrowRightLeft, CalendarCheck } from "lucide-react";

const AdminCommission = () => {
    const { setTitle } = useOutletContext();

    useEffect(() => {
        setTitle("Commission & Settlements");
    }, [setTitle]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-foreground">Commission & Settlements</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage vendor payouts from bookings and track platform commission.</p>
                </div>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-emerald-700 transition active:scale-95 transition-all">Run Settlement Cycle</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Platform Revenue", value: "₹45,200", subtitle: "This Month (Post-Pmt. G/W)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
                    { title: "Pending Payouts", value: "₹1,12,450", subtitle: "To 14 Vendors", color: "text-amber-700 bg-amber-50 border-amber-200" },
                    { title: "Processed Today", value: "₹24,000", subtitle: "Via IMPS/NEFT", color: "text-blue-700 bg-blue-50 border-blue-200" },
                    { title: "Disputed Hold", value: "₹4,500", subtitle: "2 Bookings under review", color: "text-red-700 bg-red-50 border-red-200" },
                ].map((s, i) => (
                    <div key={i} className={`rounded-xl border p-5 ${s.color}`}>
                        <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">{s.title}</p>
                        <h3 className="text-2xl font-black">{s.value}</h3>
                        <p className="text-[10px] font-bold mt-1 opacity-70 uppercase">{s.subtitle}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><ArrowRightLeft className="h-4 w-4 text-emerald-600"/> Payout Queue (T+1 Cycle)</h3>
                    <button className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-100 hover:bg-emerald-100 transition-colors">Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold">Vendor Bank Ref</th>
                                <th className="px-6 py-4 font-bold">Total Job Value</th>
                                <th className="px-6 py-4 font-bold">RozSewa Cut (10%)</th>
                                <th className="px-6 py-4 font-bold">Payout Amount</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { vendor: "Royal Salon (ICICI •••• 4011)", jobV: "₹5,000", com: "₹500", pay: "₹4,500", status: "Ready to Pay" },
                                { vendor: "Fresh Foods (HDFC •••• 1234)", jobV: "₹1,200", com: "₹0 (Free Trial)", pay: "₹1,200", status: "Processed" },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-900">{row.vendor}</td>
                                    <td className="px-6 py-4 font-medium text-gray-700">{row.jobV}</td>
                                    <td className="px-6 py-4 font-bold text-red-600">-{row.com}</td>
                                    <td className="px-6 py-4 font-black text-emerald-700">{row.pay}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.status === 'Processed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{row.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {row.status === 'Processed' ? <span className="text-xs font-bold text-gray-400">Done</span> : <button className="text-xs font-bold text-emerald-600 hover:underline">Settle Now</button>}
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

export default AdminCommission;
