import { useState, useEffect } from "react";
import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import EarningsWidget from "@/modules/provider/components/EarningsWidget";
import RecentBookingsList from "@/modules/provider/components/RecentBookingsList";
import { Briefcase, CalendarCheck, FileText, Star, ShieldAlert, CreditCard, Tag, Settings, Headset, Wallet, Clock, Lock, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";

const ProviderDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(user?.isOnline ?? true);
  const [isEmergencyActive, setIsEmergencyActive] = useState(user?.isEmergencyEnabled ?? false);

  useEffect(() => {
    if (user) {
      setIsOnline(user.isOnline);
      setIsEmergencyActive(user.isEmergencyEnabled);
    }
  }, [user]);

  const toggleOnline = async () => {
    const newState = !isOnline;
    try {
      await API.patch("/provider/status", { isOnline: newState });
      setIsOnline(newState);
      toast({
        title: newState ? "You are now ONLINE" : "You are now OFFLINE",
        variant: newState ? "default" : "destructive"
      });
    } catch (err) {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const toggleEmergency = async () => {
    const newState = !isEmergencyActive;
    try {
      await API.patch("/provider/status", { isEmergencyEnabled: newState });
      setIsEmergencyActive(newState);
      toast({ title: newState ? "Emergency Mode ON" : "Emergency Mode OFF" });
    } catch (err) {
      toast({ title: "Failed to update emergency mode", variant: "destructive" });
    }
  };

  // Approval Overlay / Pending Screen
  if (user?.status === 'pending' || user?.status === 'suspended') {
    return (
      <div className="min-h-[100dvh] bg-background">
        <ProviderTopNav />
        <main className="container max-w-lg px-6 py-12 flex flex-col items-center justify-center text-center space-y-8">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-24 w-24 bg-amber-100 rounded-[40px] flex items-center justify-center rotate-12">
            {user?.status === 'suspended' ? <AlertCircle className="h-12 w-12 text-red-600 -rotate-12" /> : <Clock className="h-12 w-12 text-amber-600 -rotate-12 animate-pulse" />}
          </motion.div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tighter">
              {user?.status === 'suspended' ? "Account Suspended" : "Approval Pending"}
            </h1>
            <p className="text-sm font-medium text-muted-foreground px-4">
              {user?.status === 'suspended'
                ? "Your account has been suspended due to policy violations. Please contact support."
                : "Great! Your registration and payment are complete. Our team is currently verifying your documents."}
            </p>
          </div>

          <div className="w-full bg-card border-2 border-dashed border-border p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-60">
              <span>Partner ID</span>
              <span className="text-emerald-600">Secure Protocol</span>
            </div>
            <p className="text-3xl font-black font-mono tracking-widest text-foreground">{user?.vendorCode}</p>
            <div className="pt-4 border-t border-border flex items-center justify-center gap-2 text-xs font-bold text-amber-700">
              <ShieldCheck className="h-4 w-4" /> Final Verification In-Progress
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 w-full">
            <div className="bg-muted p-4 rounded-2xl flex items-center gap-4 text-left">
              <div className="h-10 w-10 bg-background rounded-xl flex items-center justify-center shrink-0"><CheckCircle className="h-5 w-5 text-emerald-600" /></div>
              <div><p className="text-xs font-black">Registration & Payment</p><p className="text-[10px] text-muted-foreground">Successful</p></div>
            </div>
            <div className="bg-muted p-4 rounded-2xl flex items-center gap-4 text-left opacity-60">
              <div className="h-10 w-10 bg-background rounded-xl flex items-center justify-center shrink-0"><Lock className="h-5 w-5 text-amber-600" /></div>
              <div><p className="text-xs font-black">Admin Approval</p><p className="text-[10px] text-muted-foreground">In Queue (24-48 Hours)</p></div>
            </div>
          </div>

          <button onClick={() => window.location.reload()} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Refresh Status</button>
          <p className="text-[10px] font-bold text-muted-foreground">Need help? <Link to="/support" className="text-emerald-600 underline">Contact RozSewa Support</Link></p>
        </main>
        <ProviderBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-20 md:pb-8 relative">
      <ProviderTopNav />
      <main className="container max-w-6xl px-4 py-6 md:py-8 space-y-6 md:space-y-10">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">Welcome back, {user?.shopName || "Partner"} 👋</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 text-balance">Track your daily progress and business insights.</p>
          </div>

          <div className="flex bg-card border border-border rounded-xl md:rounded-2xl p-1.5 md:p-2 gap-2 shadow-sm w-full md:w-auto shrink-0">
            <button onClick={toggleOnline}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all ${isOnline ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200" : "bg-muted text-muted-foreground border border-transparent"
                }`}>
              <div className={`h-2 w-2 md:h-2.5 md:w-2.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} /> {isOnline ? "Online" : "Offline"}
            </button>

            <button onClick={toggleEmergency}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all ${isEmergencyActive ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200" : "bg-muted text-muted-foreground border border-transparent"
                }`}>
              <ShieldAlert className={`h-3.5 w-3.5 md:h-4 md:w-4 ${isEmergencyActive ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`} /> Emergency 24x7
            </button>
          </div>
        </section>

        <section><EarningsWidget /></section>

        <section>
          <div className="mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-black tracking-tight text-foreground">Manage Business</h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Quick access to your platform tools</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {[
              { icon: Briefcase, title: "Services", path: "/provider/services", color: "text-blue-600 bg-blue-50 border-blue-100" },
              { icon: CalendarCheck, title: "Availability", path: "/provider/availability", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
              { icon: Tag, title: "Offers & Deals", path: "/provider/offers", color: "text-pink-600 bg-pink-50 border-pink-100" },
              { icon: Wallet, title: "Wallet", path: "/provider/wallet", color: "text-green-600 bg-green-50 border-green-100" },
              { icon: Star, title: "Reviews", path: "/provider/reviews", color: "text-amber-600 bg-amber-50 border-amber-100" },
              { icon: CreditCard, title: "99 Card Center", path: "/provider/99card", color: "text-emerald-700 bg-emerald-100 border-emerald-200 shadow-emerald-500/20" },
              { icon: FileText, title: "Documents", path: "/provider/documents", color: "text-orange-600 bg-orange-50 border-orange-100" },
              { icon: Headset, title: "Support", path: "/provider/support", color: "text-cyan-600 bg-cyan-50 border-cyan-100" },
              { icon: Settings, title: "Settings", path: "/provider/settings", color: "text-gray-600 bg-gray-100 border-gray-200" }
            ].map((item, idx) => (
              <Link key={idx} to={item.path}>
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all text-center h-full`}>
                  <div className={`p-3 md:p-4 rounded-full border ${item.color} mb-2 md:mb-3`}><item.icon className="h-5 w-5 md:h-6 md:w-6" /></div>
                  <h3 className="font-bold text-foreground text-xs md:text-sm">{item.title}</h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        <section><RecentBookingsList /></section>
      </main>
      <ProviderBottomNav />
    </div>
  );
};

export default ProviderDashboard;
