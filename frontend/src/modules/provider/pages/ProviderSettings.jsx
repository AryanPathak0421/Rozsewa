import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import { Link } from "react-router-dom";
import { User, Building, Landmark, Lock, Bell, HelpCircle, FileText, ChevronRight } from "lucide-react";

const ProviderSettings = () => {
  return (
    <div className="min-h-[100dvh] bg-background pb-20 md:pb-8">
      <ProviderTopNav />
      <main className="container max-w-3xl px-4 py-6 md:py-8 space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">Account Settings</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Manage your business profile, bank details, and app preferences.</p>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <h3 className="bg-muted/30 px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Business Information</h3>
            <div className="divide-y divide-border">
              <Link to="/provider/profile" className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600"><User className="h-5 w-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Profile & Basic Info</h4>
                    <p className="text-xs text-muted-foreground">Owner name, photo, phone</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 transition" />
              </Link>
              <Link to="/provider/profile" className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><Building className="h-5 w-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Business Details</h4>
                    <p className="text-xs text-muted-foreground">Shop name, category, KYC, GST</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 transition" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <h3 className="bg-muted/30 px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Financial</h3>
            <div className="divide-y divide-border">
              <Link to="/provider/wallet" className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600"><Landmark className="h-5 w-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Bank & Payout Details</h4>
                    <p className="text-xs text-muted-foreground">Manage withdrawal methods</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 transition" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <h3 className="bg-muted/30 px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">App Settings & Security</h3>
            <div className="divide-y divide-border">
              <Link to="#" className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600"><Lock className="h-5 w-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Change Password</h4>
                    <p className="text-xs text-muted-foreground">Update security credentials</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 transition" />
              </Link>
              <Link to="#" className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Bell className="h-5 w-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Notification Preferences</h4>
                    <p className="text-xs text-muted-foreground">SMS, Email, and Push alerts</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 transition" />
              </Link>
            </div>
          </div>

          <div className="flex justify-center pt-4 pb-2">
             <button className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline">Request Account Deletion</button>
          </div>
        </div>
      </main>
      <ProviderBottomNav />
    </div>
  );
};

export default ProviderSettings;
