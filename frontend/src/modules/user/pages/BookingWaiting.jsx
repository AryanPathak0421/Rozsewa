import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";

const BookingWaiting = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("waiting"); // waiting | accepted | rejected
  const [countdown, setCountdown] = useState(30);
  const [assignedProvider, setAssignedProvider] = useState("");
  const [latestBooking, setLatestBooking] = useState(null);

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem("rozsewa_bookings") || "[]");
    if (allBookings.length > 0) {
      setLatestBooking(allBookings[0]);
    }
  }, []);

  useEffect(() => {
    if (status !== "waiting") return;
    if (countdown <= 0) {
      setStatus("rejected"); // Or do some logic
      return;
    }
    const timer = setInterval(() => setCountdown(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, status]);

  useEffect(() => {
    // 1. Pick a provider from localStorage if available
    const allProviders = JSON.parse(localStorage.getItem("rozsewa_providers") || "[]");
    const approvedProviders = allProviders.filter(p => p.status === "approved");
    const mockProvider = approvedProviders.length > 0 
      ? approvedProviders[Math.floor(Math.random() * approvedProviders.length)]
      : { shopName: "Ramesh Services", owner: "Ramesh Kumar" };

    // 2. Poll local storage to see if the pending booking got an 'active' status or simulate after 5s
    const timer = setTimeout(() => {
      const allBookings = JSON.parse(localStorage.getItem("rozsewa_bookings") || "[]");
      if (allBookings.length > 0 && status === "waiting") {
        const updatedBookings = allBookings.map((b, idx) => {
          if (idx === 0 && b.status === "pending") {
            return { 
              ...b, 
              status: "active", 
              provider: mockProvider.shopName || mockProvider.owner,
              providerMobile: mockProvider.mobile || "+91 9876543210"
            };
          }
          return b;
        });
        localStorage.setItem("rozsewa_bookings", JSON.stringify(updatedBookings));
        setAssignedProvider(mockProvider.shopName || mockProvider.owner);
        setStatus("accepted");
      }
    }, 5000); // 5 second simulation
    
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 flex flex-col items-center justify-center min-h-[70vh] space-y-8">
        <AnimatePresence mode="wait">
          {status === "waiting" && (
            <motion.div key="waiting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-6 w-full max-w-sm">
              {/* Pulsing Loader */}
              <div className="relative mx-auto h-28 w-28">
                <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-full bg-primary/20" />
                <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                  className="absolute inset-2 rounded-full bg-primary/30" />
                <div className="absolute inset-4 flex items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
              </div>

              <div>
                <h1 className="text-xl font-extrabold text-foreground">Finding a Provider...</h1>
                <p className="mt-2 text-sm text-muted-foreground">Your booking request has been sent to nearby providers.</p>
              </div>

              {/* Countdown */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Estimated wait time</p>
                <p className="text-3xl font-black text-primary mt-1">
                  00:{String(countdown).padStart(2, "0")}
                </p>
              </div>

              {/* Booking Summary */}
              <div className="rounded-2xl border border-border bg-card p-4 text-left space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Service</span><span className="font-semibold text-foreground text-right max-w-[60%]">{latestBooking?.service || "Service"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount</span><span className="font-bold text-foreground">₹{latestBooking?.amount || 0}</span></div>
              </div>

              <button onClick={() => { navigate("/"); }} className="text-sm font-semibold text-destructive hover:underline">
                Cancel Request
              </button>
            </motion.div>
          )}

          {status === "accepted" && (
            <motion.div key="accepted" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 w-full max-w-sm">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-14 w-14 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-xl font-extrabold text-foreground">Provider Accepted! 🎉</h1>
                <p className="mt-2 text-sm text-muted-foreground">A technician has accepted your booking and is getting ready.</p>
              </div>
              
              {/* Provider Card */}
              <div className="rounded-2xl border border-border bg-card p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">{(assignedProvider || "PRO").substring(0,2).toUpperCase()}</div>
                  <div>
                    <p className="font-bold text-foreground">{assignedProvider || "Ramesh Kumar"}</p>
                    <p className="text-xs text-muted-foreground">⭐ 4.8 • Expert Professional</p>
                  </div>
                </div>
              </div>

              <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate("/")}
                className="group w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-extrabold text-primary-foreground shadow-xl">
                Track Booking <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </motion.div>
          )}

          {status === "rejected" && (
            <motion.div key="rejected" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 w-full max-w-sm">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-14 w-14 text-destructive" />
              </motion.div>
              <div>
                <h1 className="text-xl font-extrabold text-foreground">No Provider Available</h1>
                <p className="mt-2 text-sm text-muted-foreground">We couldn't find a provider near you. Let us search again.</p>
              </div>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setStatus("waiting"); setCountdown(30); }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg">
                  <Search className="h-4 w-4" /> Find Another
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate("/")}
                  className="flex-1 rounded-2xl border border-border py-3.5 text-sm font-bold text-foreground hover:bg-muted">
                  Go Home
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
};

export default BookingWaiting;
