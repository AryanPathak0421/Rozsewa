import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { BarChart4, AlertTriangle, ShieldCheck, Star, Search, UserCheck } from "lucide-react";

const AdminQuality = () => {
    const { setTitle } = useOutletContext();

    useEffect(() => {
        setTitle("Quality Control");
    }, [setTitle]);

    return (
        <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-black text-foreground">Quality & Disputes</h1>
               <p className="text-sm text-muted-foreground mt-1">Manage vendor scores, user complaints, and payment disputes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><ShieldCheck className="h-6 w-6"/></div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Compliance</p>
                      <h3 className="text-xl font-black text-gray-900">98.2%</h3>
                   </div>
               </div>
               <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><AlertTriangle className="h-6 w-6"/></div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Open Disputes</p>
                      <h3 className="text-xl font-black text-gray-900">14</h3>
                   </div>
               </div>
               <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Star className="h-6 w-6"/></div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Avg. Rating</p>
                      <h3 className="text-xl font-black text-gray-900">4.82</h3>
                   </div>
               </div>
               <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0"><UserCheck className="h-6 w-6"/></div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Blacklisted</p>
                      <h3 className="text-xl font-black text-gray-900">02</h3>
                   </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="rounded-2xl border border-gray-100 bg-card shadow-sm overflow-hidden">
                   <div className="p-4 border-b border-gray-100 bg-muted/20 flex justify-between items-center">
                      <h3 className="font-black text-sm uppercase tracking-wider text-foreground">Open Disputes Queue</h3>
                      <button className="text-[10px] font-bold text-blue-600 uppercase hover:underline">View All</button>
                   </div>
                   <div className="divide-y divide-gray-100">
                      {[
                        { id: "DIS-001", user: "Vikram R.", vendor: "Global Cleaning", concern: "Service not completed fully", urgency: "High" },
                        { id: "DIS-002", user: "Sonia P.", vendor: "Royal Salon", concern: "Double charged by vendor", urgency: "Medium" }
                      ].map(d => (
                        <div key={d.id} className="p-4 hover:bg-muted/10 transition-colors cursor-pointer group">
                           <div className="flex justify-between items-start mb-2">
                              <div className="flex gap-2 items-center">
                                 <span className="text-[10px] font-black px-2 py-0.5 rounded bg-gray-100 text-gray-500 uppercase tracking-tight">{d.id}</span>
                                 <h4 className="font-bold text-sm text-gray-900">{d.user} vs {d.vendor}</h4>
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${d.urgency === 'High' ? 'text-red-700 bg-red-50 border border-red-100' : 'text-blue-700 bg-blue-50 border border-blue-100'}`}>{d.urgency}</span>
                           </div>
                           <p className="text-xs text-muted-foreground leading-relaxed italic">"{d.concern}"</p>
                           <div className="mt-3 flex gap-2">
                              <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold shadow-sm hover:bg-emerald-700 transition">Resolve with Refund</button>
                              <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold shadow-sm hover:bg-gray-200 transition">Contact Vendor</button>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>

                <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                   <div className="p-4 border-b border-gray-100 bg-emerald-50/30 flex justify-between items-center">
                      <h3 className="font-black text-sm uppercase tracking-wider text-emerald-900">Vendor Score Matrix</h3>
                      <div className="flex items-center gap-2">
                         <Search className="h-3.5 w-3.5 text-gray-400" />
                         <input type="text" placeholder="Search provider..." className="text-[10px] bg-white border border-gray-100 px-2 py-1 rounded focus:outline-none focus:border-emerald-500" />
                      </div>
                   </div>
                   <div className="divide-y divide-gray-100">
                      {[
                        { name: "Global Guard Security", score: 98, level: "Platinum", jobs: 412, badge: "text-emerald-500 bg-emerald-100" },
                        { name: "Quick Fix Plumbers", score: 72, level: "Silver", jobs: 89, badge: "text-amber-500 bg-amber-50" },
                        { name: "Elite Salon Spa", score: 91, level: "Gold", jobs: 256, badge: "text-blue-500 bg-blue-100" }
                      ].map((v, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                           <div className="flex gap-3">
                              <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center font-black text-xs text-gray-400 shrink-0">V{i}</div>
                              <div>
                                 <h4 className="text-sm font-bold text-gray-900 leading-tight">{v.name}</h4>
                                 <div className="flex gap-2 mt-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${v.badge}`}>{v.level}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{v.jobs} Successful Jobs</span>
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-xl font-black text-gray-900">{v.score}</p>
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                 <div className="h-full bg-emerald-500" style={{ width: `${v.score}%` }}></div>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                   <button className="w-full py-4 bg-muted hover:bg-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-widest transition">Monitor Behavior & Fraud Detection Layer</button>
                </section>
            </div>
        </div>
    );
};

export default AdminQuality;
