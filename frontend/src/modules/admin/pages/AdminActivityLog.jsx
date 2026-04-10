import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Search, Clock, User, Settings, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

const typeConfig = {
  login: { icon: User, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
  approval: { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
  settings: { icon: Settings, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
  security: { icon: Shield, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
  warning: { icon: AlertTriangle, color: "text-rose-600 bg-rose-50 dark:bg-rose-900/20" },
};

const defaultLogs = [
  { type: "login", action: "Admin logged in", user: "Super Admin", time: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { type: "approval", action: "Provider 'Ramesh Services' approved", user: "Super Admin", time: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { type: "settings", action: "Commission rate changed to 15%", user: "Super Admin", time: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { type: "security", action: "Password changed for admin account", user: "Super Admin", time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { type: "approval", action: "New service 'Deep Cleaning' created", user: "Super Admin", time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { type: "warning", action: "Provider 'XYZ Services' blocked for policy violation", user: "Super Admin", time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { type: "settings", action: "Cancellation policy updated", user: "Super Admin", time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
  { type: "login", action: "Admin logged in from new device", user: "Super Admin", time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
];

const AdminActivityLog = () => {
  const { setTitle } = useOutletContext();
  const [logs] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("rozsewa_admin_activity_log") || "[]");
    return saved.length > 0 ? saved : defaultLogs;
  });
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    setTitle("System Logs");
  }, [setTitle]);

  const filtered = logs
    .filter(l => filterType === "all" || l.type === filterType)
    .filter(l => !search || l.action.toLowerCase().includes(search.toLowerCase()));

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Activity Log</h1>
        <p className="text-sm text-muted-foreground mt-1">Track all admin actions and events</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search activities..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["all", "login", "approval", "settings", "security", "warning"].map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                filterType === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}>
              {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center rounded-2xl border-2 border-dashed border-border">
            <Activity className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">No activities found</p>
          </div>
        )}
        {filtered.map((log, i) => {
          const conf = typeConfig[log.type] || typeConfig.login;
          const Icon = conf.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className="flex gap-3 py-3 border-b border-border/50 last:border-0">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${conf.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{log.action}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">{log.user}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-3 w-3" /> {timeAgo(log.time)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminActivityLog;
