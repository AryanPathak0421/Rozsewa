import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageSquare, Phone, Mail, HelpCircle, ChevronRight, Search, Zap, ExternalLink, X, Ticket, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";

const faqs = [
  { q: "How to cancel my booking?", a: "To cancel your booking, go to 'My Bookings', select the specific booking, and click the 'Cancel' button. Please note that cancellation fees may apply depending on how close it is to the scheduled time." },
  { q: "What is RozSewa Safety policy?", a: "We ensure safety by verifying all our professionals, requiring mask usage, sanitization of tools before and after service, and tracking daily temperature checks." },
  { q: "How can I apply a coupon?", a: "During checkout, you will see an 'Apply Promo' section. Enter your coupon code there and click 'Apply'. The discount will directly reflect in your total payable amount." },
  { q: "Refund not received in bank.", a: "Refunds typically take 5-7 business days to reflect in your original payment method. If you haven't received it after 7 days, please raise a support ticket or contact us." },
  { q: "How to contact my service professional?", a: "Once a professional is assigned (Booking Confirmed status), you will see their contact details in the 'My Bookings' section. You can call or chat with them directly." },
];

const HelpSupport = () => {
  const navigate = useNavigate();
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const policies = JSON.parse(localStorage.getItem("rozsewa_policy_settings") || JSON.stringify({
    terms: "Welcome to RozSewa. By using our services, you agree to our terms...",
    privacy: "Your privacy is important to us. We collect data to improve your experience...",
    cancellation: "Cancellations made 24 hours before the service are fully refundable..."
  }));

  const legalLinks = [
    { label: "Terms of Service", content:policies.terms },
    { label: "Privacy Policy", content:policies.privacy },
    { label: "Cancellation & Refund", content:policies.cancellation },
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-8">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </motion.button>
          <div>
             <h1 className="text-xl font-black text-foreground tracking-tight">Help & Support</h1>
             <p className="text-xs font-semibold text-muted-foreground mt-0.5">We're here 24/7 to assist you</p>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-3 gap-3">
           {[
             { label: "WhatsApp Chat", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
             { label: "Phone Support", icon: Phone, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
             { label: "Email Us", icon: Mail, color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" },
           ].map((opt) => (
             <motion.button key={opt.label} whileTap={{ scale: 0.95 }} className={`flex flex-col items-center gap-3 rounded-[24px] border ${opt.bg} p-4 transition-all hover:bg-muted/50`}>
               <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-card border border-border shadow-sm`}>
                 <opt.icon className={`h-6 w-6 ${opt.color}`} />
               </div>
               <span className="text-[10px] font-black uppercase text-foreground text-center tracking-wider">{opt.label}</span>
             </motion.button>
           ))}
        </div>

        {/* Raise Ticket CTA */}
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => navigate("/support-tickets")}
          className="w-full flex items-center justify-between rounded-3xl bg-gradient-to-r from-primary to-emerald-500 p-6 shadow-xl shadow-primary/20 text-white relative overflow-hidden group">
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <Ticket className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-black tracking-tight">Raise a Ticket</h3>
              <p className="text-xs font-bold text-white/80 mt-1">Track your issues & queries easily</p>
            </div>
          </div>
          <ChevronRight className="h-6 w-6 relative z-10 text-white/80 group-hover:text-white transition-colors group-hover:translate-x-1" />
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"/>
        </motion.button>

        {/* FAQ Search */}
        <div className="space-y-4 pt-2">
           <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" /> Frequently Asked Questions</h3>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. Refund, Cancel)..."
                className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-4 text-sm font-bold placeholder:font-medium placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 pb-4 border-b border-border/50">
           {filteredFaqs.length === 0 ? (
             <p className="text-sm font-semibold text-muted-foreground text-center py-4">No matching questions found.</p>
           ) : filteredFaqs.map((f, i) => (
             <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 group">
               <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="flex w-full items-center justify-between p-4 text-left">
                 <span className="text-sm font-bold text-foreground pr-4 leading-tight">{f.q}</span>
                 <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${expandedFaq === i ? "rotate-180 text-primary" : "group-hover:text-foreground"}`} />
               </button>
               <AnimatePresence>
                 {expandedFaq === i && (
                   <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-muted/30">
                     <p className="p-4 pt-0 text-xs font-medium leading-relaxed text-muted-foreground">{f.a}</p>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
           ))}
        </div>

        {/* Legal Links */}
        <div className="space-y-3">
           <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mt-4 mb-2">Legal Help</h3>
           <div className="rounded-2xl border border-border bg-card p-2">
             {legalLinks.map((link, i) => (
               <button key={link.label} onClick={() => setSelectedPolicy(link)}
                 className={`flex w-full items-center justify-between p-3 text-xs font-bold text-muted-foreground hover:bg-muted/50 hover:text-foreground active:text-primary transition-all rounded-xl ${i !== legalLinks.length - 1 ? "border-b border-border/50 rounded-b-none pb-4 mb-1" : "" }`}>
                 {link.label}
                 <ExternalLink className="h-4 w-4 opacity-50" />
               </button>
             ))}
           </div>
        </div>
      </main>

      {/* Policy Modal */}
      <AnimatePresence>
        {selectedPolicy && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg rounded-t-[32px] sm:rounded-3xl bg-card shadow-2xl border border-border max-h-[85vh] flex flex-col overflow-hidden">
              <div className="bg-muted/30 p-5 flex items-center justify-between border-b border-border shrink-0">
                <h3 className="text-lg font-black text-foreground tracking-tight">{selectedPolicy.label}</h3>
                <button onClick={() => setSelectedPolicy(null)} className="rounded-full bg-background p-2 text-muted-foreground hover:text-foreground shadow-sm transition-colors border border-border">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-gradient-to-b from-card to-muted/10">
                <p className="text-xs leading-loose text-muted-foreground whitespace-pre-wrap font-medium">
                  {selectedPolicy.content}
                </p>
              </div>
              <div className="border-t border-border bg-card p-5 shrink-0">
                <button className="w-full rounded-2xl bg-primary py-4 text-sm font-extrabold tracking-wide text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-2xl transition-all"
                  onClick={() => setSelectedPolicy(null)}>
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
};

export default HelpSupport;
