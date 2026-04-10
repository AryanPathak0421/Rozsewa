import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CalendarDays, Settings } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Home" },
  { path: "/admin/users", icon: Users, label: "Users" },
  { path: "/admin/bookings", icon: CalendarDays, label: "Bookings" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

const AdminMobileNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white pb-safe md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path !== "/admin" && location.pathname.startsWith(path));

          return (
            <Link key={path} to={path} className="relative flex min-w-[64px] flex-col items-center justify-center py-2">
              <motion.div whileTap={{ scale: 0.8 }} className="relative flex flex-col items-center gap-1">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isActive ? "bg-emerald-100" : "bg-transparent"}`}>
                  <Icon className={`h-5 w-5 ${isActive ? "text-emerald-700" : "text-gray-500"}`} />
                </div>
                <span className={`text-[10px] font-bold ${isActive ? "text-emerald-700" : "text-gray-500"}`}>
                  {label}
                </span>
                
                {isActive && (
                  <motion.div layoutId="admin-bottom-nav-indicator" className="absolute -top-3 h-1 w-8 rounded-full bg-emerald-600" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminMobileNav;
