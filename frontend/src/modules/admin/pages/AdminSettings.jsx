import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Settings2, Save, LogOut, ShieldCheck, Mail, IndianRupee, BellRing, Phone, ShieldX } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const AdminSettings = () => {
  const { setTitle } = useOutletContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [platformSettings, setPlatformSettings] = useState(() => {
    const saved = localStorage.getItem("rozsewa_platform_settings");
    const defaultSettings = {
      commissionRate: 10,
      minBookingAmount: 199,
      emergencyEnabled: true,
      autoAssign: true,
      vendorCardEnabled: true,
      vendorCardPrice: 99,
    };
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const [adminProfile, setAdminProfile] = useState(() => {
    const saved = localStorage.getItem("rozsewa_admin_profile");
    return saved ? JSON.parse(saved) : {
      name: "System Admin",
      email: "admin@rozsewa.com",
      phone: "+91 90000 00000"
    };
  });

  const [policySettings, setPolicySettings] = useState(() => {
    const saved = localStorage.getItem("rozsewa_policy_settings");
    return saved ? JSON.parse(saved) : {
      terms: "Welcome to RozSewa. By using our services, you agree to our terms...",
      privacy: "Your privacy is important to us. We collect data to improve your experience...",
      cancellation: "Cancellations made 24 hours before the service are fully refundable..."
    };
  });

  useEffect(() => {
    setTitle("Platform Settings");
  }, [setTitle]);

  const handleSaveSettings = () => {
    localStorage.setItem("rozsewa_platform_settings", JSON.stringify(platformSettings));
    toast({ title: "Settings Saved", description: "Platform configurations updated successfully." });
  };

  const handleSavePolicies = () => {
    localStorage.setItem("rozsewa_policy_settings", JSON.stringify(policySettings));
    toast({ title: "Policies Updated", description: "Legal documents have been updated successfully." });
  };

  const handleSaveProfile = () => {
    localStorage.setItem("rozsewa_admin_profile", JSON.stringify(adminProfile));
    toast({ title: "Profile Updated", description: "Admin details updated successfully." });
  };

  const handleLogout = () => {
    localStorage.removeItem("rozsewa_admin_token");
    toast({ title: "Logged Out", description: "You have been securely signed out." });
    navigate("/admin/login");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 lg:space-y-8">
      {/* Header Options */}
      <div className="border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Settings2 className="h-6 w-6 text-emerald-600" /> Settings & Configuration
        </h2>
        <p className="mt-1 text-sm text-gray-500">Manage your administrative profile, policies and core platform behaviors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Layout Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Platform Settings Box */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">Global Rules</h3>
              <button onClick={handleSaveSettings} className="flex items-center gap-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700 transition-colors border border-emerald-200 shadow-sm">
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5" /> Commission Rate (%)</label>
                <div className="relative">
                  <input type="number" value={platformSettings.commissionRate} onChange={e => setPlatformSettings({...platformSettings, commissionRate: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-bold placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 font-bold">%</span>
                </div>
                <p className="mt-1.5 text-xs text-gray-400 font-medium">Platform's cut from each booking.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5" /> Min. Order Amount</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-gray-500 font-bold">₹</span>
                  <input type="number" value={platformSettings.minBookingAmount} onChange={e => setPlatformSettings({...platformSettings, minBookingAmount: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-8 pr-4 text-sm font-bold placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <p className="mt-1.5 text-xs text-gray-400 font-medium">Lowest possible cart checkout value.</p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6 space-y-5">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-100">
                 <div>
                   <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2"><BellRing className="h-4 w-4 text-amber-500" /> Emergency Service Module</h4>
                   <p className="text-xs text-gray-500 mt-0.5">Allow users to book 24x7 instant services.</p>
                 </div>
                 <button onClick={() => setPlatformSettings({...platformSettings, emergencyEnabled: !platformSettings.emergencyEnabled})} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${platformSettings.emergencyEnabled ? 'bg-emerald-600' : 'bg-gray-200'}`} role="switch" aria-checked={platformSettings.emergencyEnabled}>
                   <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${platformSettings.emergencyEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                 </button>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-100">
                 <div>
                   <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-500" /> Auto-assign Providers</h4>
                   <p className="text-xs text-gray-500 mt-0.5">Automatically route bookings to closest available provider.</p>
                 </div>
                 <button onClick={() => setPlatformSettings({...platformSettings, autoAssign: !platformSettings.autoAssign})} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${platformSettings.autoAssign ? 'bg-emerald-600' : 'bg-gray-200'}`} role="switch" aria-checked={platformSettings.autoAssign}>
                   <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${platformSettings.autoAssign ? 'translate-x-5' : 'translate-x-0'}`} />
                 </button>
              </div>

              <div className="rounded-xl border border-gray-100 p-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div>
                   <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">Vendor Verification Card</h4>
                   <p className="text-xs text-gray-500 mt-0.5">Mandatory subscription card during provider onboarding.</p>
                 </div>
                 <div className="flex items-center gap-4">
                    {platformSettings.vendorCardEnabled && (
                       <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-700">₹</span>
                          <input type="number" value={platformSettings.vendorCardPrice} onChange={(e) => setPlatformSettings({...platformSettings, vendorCardPrice: parseInt(e.target.value) || 0})} className="w-16 rounded-lg border border-gray-200 py-1.5 px-2 text-sm text-center font-bold focus:border-emerald-500 focus:outline-none" />
                       </div>
                    )}
                    <button onClick={() => setPlatformSettings({...platformSettings, vendorCardEnabled: !platformSettings.vendorCardEnabled})} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${platformSettings.vendorCardEnabled ? 'bg-emerald-600' : 'bg-gray-200'}`} role="switch" aria-checked={platformSettings.vendorCardEnabled}>
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${platformSettings.vendorCardEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                 </div>
              </div>
            </div>
          </div>

          {/* Legal Policies Box */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 border-l-4 border-blue-500 pl-3">Legal Policies</h3>
              <button onClick={handleSavePolicies} className="flex items-center gap-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700 transition-colors border border-blue-200 shadow-sm">
                <Save className="h-4 w-4" /> Save Policies
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Terms of Service</label>
                <textarea 
                  rows={4}
                  value={policySettings.terms}
                  onChange={e => setPolicySettings({...policySettings, terms: e.target.value})}
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-medium focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter Terms of Service..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Privacy Policy</label>
                <textarea 
                  rows={4}
                  value={policySettings.privacy}
                  onChange={e => setPolicySettings({...policySettings, privacy: e.target.value})}
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-medium focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter Privacy Policy..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Cancellation & Refund Policy</label>
                <textarea 
                  rows={4}
                  value={policySettings.cancellation}
                  onChange={e => setPolicySettings({...policySettings, cancellation: e.target.value})}
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-medium focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter Cancellation Policy..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Area - Profile */}
        <div className="col-span-1 space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden mb-4">
              <span className="text-2xl font-black text-emerald-700">AD</span>
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">{adminProfile.name}</h3>
            <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 mt-1 text-[10px] font-black uppercase tracking-widest text-amber-800">Super Admin</span>
            
            <div className="w-full mt-8 space-y-4">
               <div>
                 <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Full Name</label>
                 <input type="text" value={adminProfile.name} onChange={e => setAdminProfile({...adminProfile, name: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm font-semibold focus:border-emerald-500 focus:bg-white focus:outline-none transition-all" />
               </div>
               <div>
                 <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Mail className="h-3 w-3" /> Email</label>
                 <input type="email" value={adminProfile.email} onChange={e => setAdminProfile({...adminProfile, email: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm font-semibold focus:border-emerald-500 focus:bg-white focus:outline-none transition-all" />
               </div>
               <div>
                 <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Phone className="h-3 w-3" /> Phone</label>
                 <input type="text" value={adminProfile.phone} onChange={e => setAdminProfile({...adminProfile, phone: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm font-semibold focus:border-emerald-500 focus:bg-white focus:outline-none transition-all" />
               </div>
               <button onClick={handleSaveProfile} className="w-full rounded-xl bg-white border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm mt-2 active:scale-95 transition-all">
                 Update Profile
               </button>
            </div>
          </div>

          <motion.button onClick={handleLogout} whileTap={{ scale: 0.98 }} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-200 bg-red-50 py-4 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 shadow-sm">
            <LogOut className="h-5 w-5" /> Sign Out Securely
          </motion.button>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
