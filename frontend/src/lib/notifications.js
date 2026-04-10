// Notification helper utility
// Creates notifications in localStorage that are readable by all panels

export const createNotification = ({ title, body, type = "info", target = "customer" }) => {
  const notifications = JSON.parse(localStorage.getItem("rozsewa_notifications") || "[]");
  const notif = {
    id: `N-${Date.now().toString(36)}`,
    title,
    body,
    type, // info, booking, payment, promo, alert
    target, // customer, provider, admin
    read: false,
    date: new Date().toISOString(),
  };
  notifications.unshift(notif);
  localStorage.setItem("rozsewa_notifications", JSON.stringify(notifications));
  return notif;
};

export const getNotifications = (target = "customer") => {
  const all = JSON.parse(localStorage.getItem("rozsewa_notifications") || "[]");
  return all.filter(n => !target || n.target === target || n.target === "all");
};

export const markAsRead = (id) => {
  const notifications = JSON.parse(localStorage.getItem("rozsewa_notifications") || "[]");
  const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem("rozsewa_notifications", JSON.stringify(updated));
};

export const markAllAsRead = (target) => {
  const notifications = JSON.parse(localStorage.getItem("rozsewa_notifications") || "[]");
  const updated = notifications.map(n => (!target || n.target === target || n.target === "all") ? { ...n, read: true } : n);
  localStorage.setItem("rozsewa_notifications", JSON.stringify(updated));
};

export const getUnreadCount = (target = "customer") => {
  return getNotifications(target).filter(n => !n.read).length;
};

// Booking event notifications
export const notifyBookingCreated = (bookingId, service) => {
  createNotification({ title: "Booking Confirmed! ✓", body: `Your booking #${bookingId} for ${service} has been placed.`, type: "booking", target: "customer" });
  createNotification({ title: "New Booking Request", body: `New booking #${bookingId} for ${service}. Check your dashboard.`, type: "booking", target: "provider" });
};

export const notifyProviderAssigned = (bookingId, providerName) => {
  createNotification({ title: "Provider Assigned", body: `${providerName} will handle your booking #${bookingId}.`, type: "booking", target: "customer" });
};

export const notifyPaymentSuccess = (amount) => {
  createNotification({ title: "Payment Successful 💰", body: `₹${amount} has been processed successfully.`, type: "payment", target: "customer" });
};

export const logAdminActivity = (action) => {
  const logs = JSON.parse(localStorage.getItem("rozsewa_admin_activity_log") || "[]");
  logs.unshift({
    type: "approval",
    action,
    user: "Admin",
    time: new Date().toISOString(),
  });
  localStorage.setItem("rozsewa_admin_activity_log", JSON.stringify(logs));
};
