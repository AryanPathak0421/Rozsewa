import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import { CreditCard, ShieldCheck, Gift, CheckCircle, Copy, Share2, Award, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const Provider99Card = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const vendorCode = user?.vendorCode || "RSVND----";
  const commissionRemaining = user?.commissionFreeBookings || 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(vendorCode);
    setCopied(true);
    toast({ title: "Code Copied!", description: "Vendor referral code copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-20 md:pb-8">
      <ProviderTopNav />
      <main className="container max-w-4xl px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">RozSewa 99 Card Center</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Manage your active subscription and referral benefits.</p>
        </div>

        {/* Card Status */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-6 md:p-8 text-white shadow-xl shadow-emerald-600/20">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-32 w-32 rounded-full bg-black/10 blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-50 border border-emerald-400/30 backdrop-blur-sm">
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Pro Member
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Active Plan</h2>
              <p className="text-sm text-emerald-100/90 font-medium">Valid until: <strong className="text-white">Mar 25, 2027</strong></p>
            </div>

            <button className="w-full md:w-auto shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-emerald-700 shadow-sm transition hover:bg-emerald-50">
              Renew Plan
            </button>
          </div>
        </section>

        {/* Referral System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/10 p-5 md:p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-200/50 text-emerald-700 dark:text-emerald-400">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-400">Refer & Earn 100% Commission</h3>
                <p className="text-xs md:text-sm text-emerald-700/80 dark:text-emerald-500/80 mt-1 leading-relaxed">
                  Refer another vendor using your code. If they purchase the 99 Card, you both earn <strong className="text-emerald-800 dark:text-emerald-300">3 Commission-Free bookings!</strong>
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-emerald-200/60 bg-white dark:bg-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Your Referral Code</span>
                <div className="text-2xl font-black font-mono tracking-widest text-emerald-700 dark:text-emerald-400">{vendorCode}</div>
              </div>
              <div className="flex w-full sm:w-auto gap-2">
                <button onClick={handleCopy} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-xs font-bold text-foreground shadow-sm hover:bg-muted transition">
                  {copied ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="mb-3 rounded-full bg-blue-50 dark:bg-blue-900/20 p-4 relative">
              <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white border-2 border-white dark:border-card">{commissionRemaining}</span>
            </div>
            <h3 className="text-lg font-black text-foreground">Zero Commission</h3>
            <p className="text-xs text-muted-foreground mt-1">You have <strong className="text-foreground">{commissionRemaining} orders</strong> left with 0% platform fee!</p>
            <button className="mt-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700">
              View Policy <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Benefits Breakdown */}
        <section>
          <h3 className="text-sm font-bold tracking-wider uppercase text-muted-foreground mb-4">Included in your 99 Card</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {[
              { title: "Verified Vendor Badge", desc: "Gain customer trust with a verified checkmark." },
              { title: "Priority Visibility", desc: "Rank higher in search results." },
              { title: "24/7 Support", desc: "Direct priority line to RozSewa admin." },
              { title: "Business Tools", desc: "Access to advanced analytics and staff management." }
            ].map((item, i) => (
              <div key={i} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <ProviderBottomNav />
    </div>
  );
};

export default Provider99Card;
