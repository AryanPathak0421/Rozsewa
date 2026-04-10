import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, MessageCircle, AlertOctagon, Check, Clock, User, Star, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";
import { useToast } from "@/components/ui/use-toast";
import API from "@/lib/api";

const steps = [
  { label: "Booking Placed", time: "10:00 AM" },
  { label: "Provider Accepted", time: "10:02 AM" },
  { label: "On the Way", time: "10:15 AM" },
  { label: "Service Started", time: "" },
  { label: "Completed", time: "" },
];

const LiveTracking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [cancelTimer, setCancelTimer] = useState(250);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOTP, setShowOTP] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const fetchBookingStatus = async () => {
    try {
      const { data } = await API.get('/bookings');
      // Find the most recent active booking
      const active = data.find(b => ['confirmed', 'on_the_way', 'started'].includes(b.status));
      if (active) {
        setBookingDetails(active);
        // Map status to currentStep
        if (active.status === 'confirmed') setCurrentStep(1);
        else if (active.status === 'on_the_way') setCurrentStep(2);
        else if (active.status === 'started') setCurrentStep(3);
        else if (active.status === 'completed') setCurrentStep(4);
      }
    } catch (err) {
      console.error("Failed to fetch booking status", err);
    } finally {
      setLoading(false);
    }
  };

  const [providerInfo, setProviderInfo] = useState({
    name: "Loading...",
    rating: 4.8,
    jobs: 120,
    mobile: ""
  });

  useEffect(() => {
    if (bookingDetails?.providerId) {
      setProviderInfo({
        name: bookingDetails.providerId.shopName || bookingDetails.providerId.ownerName || "Technician",
        rating: bookingDetails.providerId.rating || 4.8,
        jobs: bookingDetails.providerId.jobsCompleted || 150,
        mobile: bookingDetails.providerId.phoneNumber || ""
      });
    }
  }, [bookingDetails]);

  useEffect(() => {
    fetchBookingStatus();
    const interval = setInterval(fetchBookingStatus, 3000); // Polling faster (3s)
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = async (idx, val) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 3) {
      const next = document.getElementById(`otp-${idx + 1}`);
      next?.focus();
    }
    if (newOtp.every((d) => d !== "")) {
      const fullOtp = newOtp.join("");
      setIsVerifying(true);
      try {
        // Use different endpoints for Start vs Completion
        const endpoint = currentStep === 2 ? `/bookings/${bookingDetails._id}/start` : `/bookings/${bookingDetails._id}/complete`;
        await API.post(endpoint, { otp: fullOtp });

        if (currentStep === 2) {
          setCurrentStep(3);
          toast({ title: "OTP Verified", description: "Service has started!" });
        } else {
          setCurrentStep(4);
          toast({ title: "Work Completed", description: "Technician has confirmed the work!" });
        }

        setShowOTP(false);
        setOtp(["", "", "", ""]);
      } catch (err) {
        toast({ title: "Verification Failed", description: "Invalid OTP. Please check with technician.", variant: "destructive" });
        setOtp(["", "", "", ""]);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Live Tracking</h1>
              <p className="text-xs text-muted-foreground">Booking #{bookingDetails?.id || "ROJ-2024-0000"}</p>
            </div>
          </div>
          {cancelTimer > 0 && currentStep < 3 && (
            <span className="rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive">
              Free Cancel — {formatTime(cancelTimer)}
            </span>
          )}
        </div>

        {/* Technician Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
              {providerInfo.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-card-foreground">{providerInfo.name}</h3>
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                <span className="text-xs font-semibold text-card-foreground">{providerInfo.rating}</span>
                <span className="text-xs text-muted-foreground">({providerInfo.jobs} jobs)</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">Expert Professional • Verified Partner</p>
            </div>
            <div className="flex flex-col gap-2">
              <a href={`tel:${providerInfo.mobile}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-muted"><Phone className="h-4 w-4 text-primary" /></a>
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-muted"><MessageCircle className="h-4 w-4 text-primary" /></button>
            </div>
          </div>
          {/* SOS Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="mt-4 w-full rounded-xl py-3 text-sm font-bold text-destructive-foreground shadow-lg"
            style={{
              background: "linear-gradient(135deg, hsl(0 84% 60%), hsl(0 70% 50%))",
              animation: "emergency-pulse 2s ease-in-out infinite",
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertOctagon className="h-5 w-5" />
              SOS / Emergency
            </div>
          </motion.button>
        </motion.div>

        {/* Timeline */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-5 text-sm font-bold text-card-foreground flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Order Status</h3>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={step.label} className="flex gap-4">
                {/* Line + Dot */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.15, type: "spring", stiffness: 300 }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${i <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "border-2 border-border bg-background text-muted-foreground"
                      }`}
                  >
                    {i <= currentStep ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.15 + 0.1, type: "spring", stiffness: 500 }}
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <span className="text-xs font-bold">{i + 1}</span>
                    )}
                  </motion.div>
                  {i < steps.length - 1 && (
                    <div className="relative h-10 w-0.5 bg-border">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: i < currentStep ? "100%" : "0%" }}
                        transition={{ delay: i * 0.2, duration: 0.5 }}
                        className="absolute left-0 top-0 w-full bg-primary"
                      />
                    </div>
                  )}
                </div>
                {/* Label */}
                <div className="pb-8">
                  <p className={`text-sm font-semibold ${i <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                  {step.time && <p className="text-xs text-muted-foreground">{step.time}</p>}
                  {/* Only show OTP button on 'On the Way' step to START service */}
                  {i === currentStep && i === 2 && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowOTP(true)}
                      className="mt-2 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground"
                    >
                      Enter OTP to Start
                    </motion.button>
                  )}

                  {/* New: Completion OTP to finish service */}
                  {i === currentStep && i === 3 && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowOTP(true)}
                      className="mt-2 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground"
                    >
                      Enter OTP to Complete
                    </motion.button>
                  )}
                  {i === currentStep && i === 4 && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/post-service")}
                      className="mt-2 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground"
                    >
                      View Bill & Review →
                    </motion.button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OTP Modal */}
        {showOTP && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-full max-w-sm rounded-2xl bg-card p-6 text-center shadow-2xl"
            >
              <h3 className="text-lg font-bold text-card-foreground">Enter 4-digit OTP</h3>
              <p className="mt-1 text-xs text-muted-foreground">Share this OTP with your technician</p>
              <div className="mt-6 flex justify-center gap-3">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="h-14 w-14 rounded-xl border-2 border-border bg-background text-center text-2xl font-extrabold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                ))}
              </div>
              <button onClick={() => setShowOTP(false)} className="mt-5 text-sm font-semibold text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default LiveTracking;
