import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ShieldAlert, PhoneIncoming, AlertTriangle, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import API from "@/lib/api";

const AdminEmergency = () => {
   const { setTitle } = useOutletContext();
   const [data, setData] = useState({
      incomingSOS: "00",
      activeResponders: "00",
      sosQueue: [],
      responderStatus: []
   });
   const [loading, setLoading] = useState(true);
   const [isBroadcasting, setIsBroadcasting] = useState(false);
   const { toast } = useToast();

   useEffect(() => {
      setTitle("24x7 Emergency");
      fetchEmergencyData();
   }, [setTitle]);

   const fetchEmergencyData = async () => {
      try {
         const res = await API.get("/admin/emergency");
         setData(res.data);
      } catch (err) {
         console.error("SOS Sync Error:", err);
      } finally {
         setLoading(false);
      }
   };

   const handleBroadcast = async () => {
      setIsBroadcasting(true);
      try {
         const { data: res } = await API.post("/admin/emergency/broadcast", { message: "Critical SOS Alert in your area" });
         toast({ title: "Broadcast Successful", description: res.message });
      } catch (err) {
         toast({ title: "Broadcast Failed", description: "Network error", variant: "destructive" });
      } finally {
         setIsBroadcasting(false);
      }
   };

   const handleCall = (user) => {
      toast({ title: "Connecting Call", description: `Dialing register number for ${user}...` });
   };

   const getTimeAgo = (date) => {
      const diff = Math.floor((new Date() - new Date(date)) / 60000);
      if (diff < 1) return "Just now";
      if (diff < 60) return `${diff}m ago`;
      return `${Math.floor(diff / 60)}h ago`;
   };

   if (loading) return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
         <Loader2 className="h-10 w-10 animate-spin text-red-600" />
         <p className="text-xs font-black uppercase tracking-widest text-red-400">Syncing SOS Channel...</p>
      </div>
   );

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
                  <h2 className="text-2xl font-black text-red-700">{data.incomingSOS.toString().padStart(2, '0')}</h2>
               </div>
               <div className="flex-1 md:flex-none bg-white border border-red-200 px-5 py-3 rounded-2xl text-center shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Responders</p>
                  <h2 className="text-2xl font-black text-gray-900">{data.activeResponders.toString().padStart(2, '0')}</h2>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
               <h3 className="font-bold text-xs uppercase tracking-widest px-1 text-muted-foreground">CRITICAL SOS QUEUE</h3>
               {data.sosQueue.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
                     <CheckCircle className="h-8 w-8 text-emerald-200 mx-auto mb-2" />
                     <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No Active SOS Alerts</p>
                  </div>
               ) : (
                  data.sosQueue.map(sos => (
                     <div key={sos._id} className="p-4 border border-red-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition group overflow-hidden relative text-left">
                        <div className="absolute right-0 top-0 h-full w-1 bg-red-500 opacity-20 group-hover:opacity-100 mt-0"></div>
                        <div className="flex justify-between items-start">
                           <div className="flex gap-4">
                              <div className="h-10 w-10 shrink-0 bg-red-50 text-red-500 flex items-center justify-center rounded-xl font-black text-xs">SOS</div>
                              <div>
                                 <h4 className="font-black text-red-900">{sos.serviceName}</h4>
                                 <p className="text-xs font-bold text-gray-500 mt-0.5">{sos.userId?.name || 'User'} • {sos.address?.slice(0, 30)}...</p>
                              </div>
                           </div>
                           <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-lg animate-pulse">{getTimeAgo(sos.createdAt)}</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                           <a
                              href={`tel:${sos.userId?.mobile || '#'}`}
                              onClick={() => handleCall(sos.userId?.name)}
                              className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-1.5"
                           >
                              <PhoneIncoming className="h-3.5 w-3.5" /> Call User
                           </a>
                           <button className="flex items-center justify-center w-12 bg-gray-100 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition"><CheckCircle className="h-5 w-5" /></button>
                        </div>
                     </div>
                  ))
               )}
            </div>

            <div className="rounded-3xl border border-gray-100 bg-card p-6 h-fit shadow-sm relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="font-bold text-foreground mb-4">Responder Status</h3>
                  <div className="space-y-3">
                     {data.responderStatus.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No responders in vicinity...</p>
                     ) : (
                        data.responderStatus.map((rep, i) => (
                           <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-gray-100 group">
                              <div className="flex gap-3 items-center">
                                 <div className={`h-2.5 w-2.5 rounded-full ${rep.isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                 <div className="text-left">
                                    <p className="text-sm font-bold text-gray-900 leading-none">{rep.shopName}</p>
                                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{rep.address?.split(',')[0] || 'Unknown'}</p>
                                 </div>
                              </div>
                              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${rep.isOnline ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 bg-gray-50'}`}>
                                 {rep.isOnline ? 'On Duty' : 'Offline'}
                              </span>
                           </div>
                        ))
                     )}
                  </div>
                  <button
                     onClick={handleBroadcast}
                     disabled={isBroadcasting}
                     className="mt-6 w-full flex items-center justify-center gap-2 py-3 border-2 border-emerald-600 text-emerald-600 rounded-2xl font-black text-sm hover:bg-emerald-600 hover:text-white transition active:scale-95 transition-all disabled:opacity-50"
                  >
                     {isBroadcasting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Broadcast SOS to All"}
                     {!isBroadcasting && <ArrowRight className="h-4 w-4" />}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminEmergency;
