import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { CreditCard, TrendingUp, Users, IndianRupee } from "lucide-react";

const Admin99Card = () => {
    const { setTitle } = useOutletContext();

    useEffect(() => {
        setTitle("Vendor Registration Card");
    }, [setTitle]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-foreground">Vendor Card Management</h1>
                <p className="text-sm text-muted-foreground mt-1">Track mandatory vendor subscription metrics and referral networks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-6 shadow-sm hover:shadow-md transition-all">
                    <CreditCard className="h-8 w-8 text-emerald-600 mb-4" />
                    <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-1">Total Sales</p>
                    <h2 className="text-4xl font-black text-emerald-900">4,289</h2>
                    <p className="text-xs text-emerald-600 font-bold mt-2"><TrendingUp className="h-3 w-3 inline mr-1"/>+12% this month</p>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 shadow-sm hover:shadow-md transition-all">
                    <Users className="h-8 w-8 text-blue-600 mb-4" />
                    <p className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-1">Active Subscribers</p>
                    <h2 className="text-4xl font-black text-blue-900">2,104</h2>
                    <p className="text-xs text-blue-600 font-bold mt-2">Renewing this month: 145</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 shadow-sm hover:shadow-md transition-all">
                    <IndianRupee className="h-8 w-8 text-amber-600 mb-4" />
                    <p className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-1">Card Revenue</p>
                    <h2 className="text-4xl font-black text-amber-900">₹4.2L</h2>
                    <p className="text-xs text-amber-600 font-bold mt-2">All time generated</p>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mt-8">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-900">Recent Card Activations</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold">Transaction ID</th>
                                <th className="px-6 py-4 font-bold">Vendor Name</th>
                                <th className="px-6 py-4 font-bold">Referral Used</th>
                                <th className="px-6 py-4 font-bold">Free Bookings Granted</th>
                                <th className="px-6 py-4 font-bold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { id: "TXN-99A-102", name: "Royal Salon", ref: "RSVND102 (Self)", free: 0, date: "Today" },
                                { id: "TXN-99A-101", name: "Apex Plumbers", ref: "EMP001 (Employee)", free: 3, date: "Yesterday" },
                            ].map((item, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{item.id}</td>
                                    <td className="px-6 py-4 font-bold">{item.name}</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-700">{item.ref}</span></td>
                                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${item.free > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{item.free > 0 ? `+${item.free} Added` : 'None'}</span></td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin99Card;
