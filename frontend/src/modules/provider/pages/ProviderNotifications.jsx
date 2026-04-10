import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import { Bell, CheckCircle, Info, AlertTriangle } from "lucide-react";

const ProviderNotifications = () => {
  const notifications = [
    { id: 1, type: "success", title: "Job Completed Successfully", time: "10 mins ago", desc: "You completed AC Servicing for Rahul. ₹499 added to earnings." },
    { id: 2, type: "info", title: "New Feature Alert", time: "2 hours ago", desc: "You can now assign specific jobs to your staff directly from the booking panel." },
    { id: 3, type: "warning", title: "KYC Pending Verification", time: "1 day ago", desc: "Your Aadhaar copy is blurry. Please re-upload from Documents to avoid listing suspension." }
  ];

  const getIcon = (type) => {
    switch(type) {
      case "success": return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-20 md:pb-8">
      <ProviderTopNav />
      <main className="container max-w-4xl px-0 sm:px-4 py-4 md:py-8">
        <div className="px-4 sm:px-0 mb-4 md:mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">Notifications</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Stay updated with your business activities.</p>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Mark all read</button>
        </div>

        <div className="bg-card sm:rounded-2xl border-y sm:border-x border-border shadow-sm divide-y divide-border">
           {notifications.map(n => (
             <div key={n.id} className="p-4 md:p-6 flex gap-4 hover:bg-muted/20 transition-colors">
               <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${n.type === 'success' ? 'bg-emerald-50' : n.type === 'warning' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                 {getIcon(n.type)}
               </div>
               <div>
                 <div className="flex justify-between items-start mb-1">
                   <h3 className="text-sm font-bold text-foreground">{n.title}</h3>
                   <span className="text-[10px] whitespace-nowrap text-muted-foreground font-semibold ml-2">{n.time}</span>
                 </div>
                 <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{n.desc}</p>
               </div>
             </div>
           ))}
        </div>
      </main>
      <ProviderBottomNav />
    </div>
  );
};

export default ProviderNotifications;
