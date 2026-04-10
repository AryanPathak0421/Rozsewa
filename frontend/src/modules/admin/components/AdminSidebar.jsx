import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, UserCheck, CalendarDays, IndianRupee, Tag, 
  MessageSquare, Briefcase, Settings, Image, ShieldCheck, CreditCard, 
  Percent, Landmark, Map, Zap, Wallet, BarChart4, ShieldAlert,
  Database, HelpCircle, Megaphone, Terminal
} from "lucide-react";

const links = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/providers", label: "Providers", icon: UserCheck },
  { path: "/admin/kyc", label: "KYC Verification", icon: ShieldCheck },
  { path: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { path: "/admin/dispatch", label: "Job Dispatching", icon: Zap },
  { path: "/admin/emergency", label: "24x7 Emergency", icon: ShieldAlert },
  { path: "/admin/99cards", label: "Vendor Card Sales", icon: CreditCard },
  { path: "/admin/commission", label: "Settlements", icon: Landmark },
  { path: "/admin/finance", label: "Finance & GST", icon: Wallet },
  { path: "/admin/earnings", label: "Earnings", icon: IndianRupee },
  { path: "/admin/offers", label: "Offers Approval", icon: Percent },
  { path: "/admin/coupons", label: "Coupons", icon: Tag },
  { path: "/admin/quality", label: "Quality & Disputes", icon: BarChart4 },
  { path: "/admin/zones", label: "Zones & Cities", icon: Map },
  { path: "/admin/promotions", label: "Global Promotions", icon: Megaphone },
  { path: "/admin/master-data", label: "Master Data", icon: Database },
  { path: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { path: "/admin/services", label: "Services Catalog", icon: Briefcase },
  { path: "/admin/banners", label: "App Banners", icon: Image },
  { path: "/admin/help-training", label: "Help & Training", icon: HelpCircle },
  { path: "/admin/activity-log", label: "System Logs", icon: Terminal },
  { path: "/admin/settings", label: "Global Settings", icon: Settings },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex h-screen w-68 flex-col border-r border-gray-200 bg-white sticky top-0 py-6">
      <div className="px-6 mb-8">
        <Link to="/admin" className="flex items-center space-x-2">
          <img src="/RozSewa.png" alt="RozSewa Admin" className="h-[2rem] w-auto object-contain drop-shadow-sm" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <link.icon className={`h-4.5 w-4.5 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="px-6 mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
            AD
          </div>
          <div>
            <p className="text-xs font-black text-gray-900">Admin</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Super User</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
