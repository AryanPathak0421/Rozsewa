import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, Camera, Check, Star, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";

const tags = ["On Time", "Clean Work", "Polite", "Professional", "Affordable", "Expert"];

const PostService = () => {
  const navigate = useNavigate();
  const [beforeImg, setBeforeImg] = useState(null);
  const [afterImg, setAfterImg] = useState(null);
  const [showApproval, setShowApproval] = useState(true);
  const [approved, setApproved] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [review, setReview] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const allBookings = JSON.parse(localStorage.getItem("rozsewa_bookings") || "[]");
  const currentBooking = allBookings.find(b => b.status === "active" || b.status === "completed") || allBookings[0] || { amount: 497 };
  const baseAmount = currentBooking.amount || 497;
  const extraAmount = approved ? 1250 : 0;
  const finalTotal = baseAmount + extraAmount;

  const handleImageUpload = (type) => {
    const url = "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop";
    if (type === "before") setBeforeImg(url);
    else setAfterImg(url);
  };

  const handlePayment = () => {
    setPaymentDone(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <h1 className="text-xl font-bold text-foreground">Service Completed</h1>
        </div>

        {/* Image Upload */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-bold text-card-foreground flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" /> Work Verification
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Before Work", img: beforeImg, type: "before" },
              { label: "After Work", img: afterImg, type: "after" },
            ].map(({ label, img, type }) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleImageUpload(type)}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/50 p-6 transition-colors hover:border-primary hover:bg-primary/5"
              >
                {img ? (
                  <img src={img} alt={label} className="h-20 w-20 rounded-lg object-cover" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
                <span className="text-xs font-semibold text-muted-foreground">{label}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Approval */}
        <AnimatePresence>
          {showApproval && !approved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-2xl border-2 border-secondary bg-secondary/10 p-5"
            >
              <h3 className="text-sm font-bold text-foreground">Extra Charges Added</h3>
              <p className="mt-1 text-xs text-muted-foreground">Technician added spare parts cost</p>
              <div className="mt-3 rounded-xl bg-card p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacitor (1.5 ton)</span>
                  <span className="font-bold text-foreground">₹450</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-muted-foreground">Gas Refill</span>
                  <span className="font-bold text-foreground">₹800</span>
                </div>
                <div className="border-t border-border mt-2 pt-2 flex justify-between">
                  <span className="font-bold text-foreground">Extra Total</span>
                  <span className="font-extrabold text-secondary-foreground">₹1,250</span>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowApproval(false)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Decline
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setApproved(true); setShowApproval(false); }}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground"
                >
                  Approve ₹1,250
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Bill */}
        <section className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <h3 className="text-sm font-bold text-card-foreground mb-3">Final Bill</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Booking Amount</span>
            <span className="font-semibold text-card-foreground">₹{baseAmount}</span>
          </div>
          {/* Discount is already subtracted in baseAmount in checkout logic */}
          {approved && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Extra Parts</span>
              <span className="font-semibold text-card-foreground">₹1,250</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between text-base font-extrabold text-foreground">
            <span>Total</span>
            <span>₹{finalTotal}</span>
          </div>
        </section>

        {/* Payment */}
        {!paymentDone ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handlePayment}
            className="w-full rounded-2xl bg-primary py-4 text-base font-extrabold text-primary-foreground shadow-xl"
          >
            Pay ₹{finalTotal}
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl bg-gradient-to-r from-primary to-emerald-500 p-6 text-center text-primary-foreground shadow-xl"
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: 2, duration: 0.3 }}>
              <Check className="mx-auto h-12 w-12" />
            </motion.div>
            <h3 className="mt-3 text-xl font-extrabold">Payment Successful!</h3>
            <div className="mt-3 flex items-center justify-center gap-2 rounded-full bg-white/20 py-2 px-4 mx-auto w-fit">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-bold">+50 Cashback Points Earned! 🎉</span>
            </div>
            {showConfetti && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: "50%", y: "100%", opacity: 1, scale: 0 }}
                    animate={{
                      x: `${Math.random() * 100}%`,
                      y: `${-Math.random() * 200}%`,
                      opacity: 0,
                      scale: 1,
                      rotate: Math.random() * 720,
                    }}
                    transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
                    className="absolute h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: ["#22c55e", "#eab308", "#ef4444", "#3b82f6", "#a855f7", "#f97316"][i % 6],
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Review Section */}
        {paymentDone && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-5 space-y-4"
          >
            <h3 className="text-sm font-bold text-card-foreground">Rate Your Experience</h3>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <motion.button
                  key={s}
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.2 }}
                  onMouseEnter={() => setHoveredStar(s)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(s)}
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      s <= (hoveredStar || rating) ? "fill-secondary text-secondary" : "text-border"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <motion.button
                  key={tag}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your feedback..."
              rows={3}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
            >
              Submit Review
            </motion.button>
          </motion.section>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default PostService;
