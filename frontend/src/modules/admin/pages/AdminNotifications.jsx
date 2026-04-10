import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Send, Plus, Clock, Users, Search, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminNotifications = () => {
  const { setTitle } = useOutletContext();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem("rozsewa_admin_sent_notifications") || "[]"));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", target: "all" });

  useEffect(() => {
    setTitle("Push Notifications");
  }, [setTitle]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!form.title || !form.body) { toast({ title: "Fill all fields", variant: "destructive" }); return; }
    const notif = {
      id: `NOTIF-${Date.now().toString(36)}`,
      ...form,
      sentAt: new Date().toISOString(),
    };
    const updated = [notif, ...notifications];
    setNotifications(updated);
    localStorage.setItem("rozsewa_admin_sent_notifications", JSON.stringify(updated));

    // Also push to user notifications
    const userNotifs = JSON.parse(localStorage.getItem("rozsewa_notifications") || "[]");
    userNotifs.unshift({ id: notif.id, title: form.title, body: form.body, read: false, date: notif.sentAt, type: "promo" });
    localStorage.setItem("rozsewa_notifications", JSON.stringify(userNotifs));

    toast({ title: "Notification Sent! 🚀", description: `Sent to: ${form.target}` });
    setForm({ title: "", body: "", target: "all" });
    setShowForm(false);
  };

  const handleDelete = (i) => {
    setNotifications(notifications.filter((_, idx) => idx !== i));
    localStorage.setItem("rozsewa_admin_sent_notifications", JSON.stringify(notifications.filter((_, idx) => idx !== i)));
    toast({ title: "Deleted" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Push Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Compose & send notifications to users</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg active:scale-95 transition-all">
          <Plus className="h-4 w-4" /> Compose
        </motion.button>
      </div>

      {/* Compose Form */}
      <AnimatePresence>
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-foreground">New Notification</h3>
          <form onSubmit={handleSend} className="space-y-4">
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Notification Title..."
              className="w-full rounded-xl border border-border bg-background p-3 text-sm font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
            <textarea rows={3} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Message body..."
              className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
            <div className="flex flex-wrap gap-2">
              {[{ id: "all", label: "All Users" }, { id: "customers", label: "Customers" }, { id: "providers", label: "Providers" }].map(t => (
                <button key={t.id} type="button" onClick={() => setForm({ ...form, target: t.id })}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                    form.target === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}>
                  <Users className="h-3 w-3" /> {t.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.97 }} type="submit"
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm">
                <Send className="h-4 w-4" /> Send Now
              </motion.button>
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-foreground hover:bg-muted transition-all">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}
      </AnimatePresence>

      {/* History */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">Sent Notifications ({notifications.length})</h3>
        {notifications.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center rounded-2xl border-2 border-dashed border-border bg-gray-50/50">
            <Bell className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">No notifications sent yet</p>
          </div>
        )}
        {notifications.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3 hover:shadow-sm transition-all">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-foreground">{n.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(n.sentAt).toLocaleString("en-IN")}</span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{n.target}</span>
              </div>
            </div>
            <button onClick={() => handleDelete(i)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0 transition-all">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotifications;
