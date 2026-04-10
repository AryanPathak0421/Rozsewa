import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ShieldAlert, PhoneIncoming, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

const AdminEmergency = () => {
    const { setTitle } = useOutletContext();
    
    useEffect(() => {
        setTitle("24x7 Emergency");
    }, [setTitle]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-red-50 border border-red-100 p-6 rounded-3xl gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center animate-pulse">
                        <ShieldAlert className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-red-900">24x7 Emergency Control</h1>
                        <p className="text-sm font-bold text-red-600 uppercase tracking-wider">Active Monitoring Live</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-none bg-white border border-red-200 px-5 py-3 rounded-2xl text-center shadow-sm">
                       <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Incoming SOS</p>
                       <h2 className="text-2xl font-black text-red-700">03</h2>
                    </div>
                    <div className="flex-1 md:flex-none bg-white border border-red-200 px-5 py-3 rounded-2xl text-center shadow-sm">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Responders</p>
                       <h2 className="text-2xl font-black text-gray-900">14</h2>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest px-1 text-muted-foreground">CRITICAL SOS QUEUE</h3>
                    {[
                      { id: "SOS-9112", service: "Snake Rescue / Pest", area: "Sector 144", time: "1min ago", user: "Akash M." },
                      { id: "SOS-9111", service: "Plumbing Burst", area: "Vasundhara", time: "5min ago", user: "Ria S." }
                    ].map(sos => (
                      <div key={sos.id} className="p-4 border border-red-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition group overflow-hidden relative">
                         <div className="absolute right-0 top-0 h-full w-1 bg-red-500 opacity-20 group-hover:opacity-100 mt-0"></div>
                         <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                               <div className="h-10 w-10 shrink-0 bg-red-50 text-red-500 flex items-center justify-center rounded-xl font-black text-xs">SOS</div>
                               <div>
                                  <h4 className="font-black text-red-900">{sos.service}</h4>
                                  <p className="text-xs font-bold text-gray-500 mt-0.5">{sos.user} • {sos.area}</p>
                               </div>
                            </div>
                            <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-lg animate-pulse">{sos.time}</span>
                         </div>
                         <div className="mt-4 flex gap-2">
                            <button className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-1.5"><PhoneIncoming className="h-3.5 w-3.5" /> Call User</button>
                            <button className="flex items-center justify-center w-12 bg-gray-100 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition"><CheckCircle className="h-5 w-5" /></button>
                         </div>
                      </div>
                    ))}
                </div>

                <div className="rounded-3xl border border-gray-100 bg-card p-6 h-fit shadow-sm relative overflow-hidden">
                   <div className="relative z-10">
                      <h3 className="font-bold text-foreground mb-4">Responder Status</h3>
                      <div className="space-y-3">
                         {[
                           { name: "Pawan Security", status: "On Duty", jobs: 3, zone: "Noida" },
                           { name: "Shyama Electricals", status: "In Route", jobs: 1, zone: "Delhi" },
                           { name: "Global Guard", status: "Away", jobs: 0, zone: "All" }
                         ].map((rep, i) => (
                           <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-gray-100 group">
                              <div className="flex gap-3 items-center">
                                 <div className={`h-2.5 w-2.5 rounded-full ${rep.status === 'On Duty' ? 'bg-emerald-500' : rep.status === 'Away' ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                                 <div>
                                    <p className="text-sm font-bold text-gray-900 leading-none">{rep.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{rep.zone}</p>
                                 </div>
                              </div>
                              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${rep.status === 'On Duty' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 bg-gray-50'}`}>{rep.status}</span>
                           </div>
                         ))}
                      </div>
                      <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 border-2 border-emerald-600 text-emerald-600 rounded-2xl font-black text-sm hover:bg-emerald-600 hover:text-white transition active:scale-95 transition-all">Broadcast SOS to All <ArrowRight className="h-4 w-4" /></button>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEmergency;
