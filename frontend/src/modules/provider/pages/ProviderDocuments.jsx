import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, CheckCircle2, XCircle, Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";
import { useToast } from "@/components/ui/use-toast";

const docTypes = [
  { id: "aadhaar", label: "Aadhaar Card", required: true },
  { id: "pan", label: "PAN Card", required: true },
  { id: "gst", label: "GST Certificate", required: false },
  { id: "license", label: "Business License", required: false },
  { id: "certification", label: "Skill Certification", required: false },
  { id: "police", label: "Police Verification", required: false },
];

const statusConfig = {
  pending: { icon: Clock, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20", label: "Pending" },
  verified: { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20", label: "Verified" },
  rejected: { icon: XCircle, color: "text-rose-600 bg-rose-50 dark:bg-rose-900/20", label: "Rejected" },
};

const ProviderDocuments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [docs, setDocs] = useState(() => JSON.parse(localStorage.getItem("rozsewa_provider_documents") || "{}"));

  const handleUpload = (docId) => {
    const updated = {
      ...docs,
      [docId]: {
        status: "pending",
        uploadedAt: new Date().toISOString(),
        fileName: `${docId}_document.pdf`,
      },
    };
    setDocs(updated);
    localStorage.setItem("rozsewa_provider_documents", JSON.stringify(updated));
    toast({ title: "Document Uploaded", description: "Sent for verification. Status: Pending" });
  };

  const uploadedCount = Object.keys(docs).length;
  const verifiedCount = Object.values(docs).filter(d => d.status === "verified").length;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-foreground">KYC Documents</h1>
            <p className="text-xs text-muted-foreground">{verifiedCount}/{docTypes.length} verified</p>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-2xl bg-gradient-to-r from-primary to-emerald-600 p-5 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-md">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Verification Status</h3>
              <p className="text-sm opacity-80 mt-0.5">{uploadedCount === 0 ? "Upload documents to get verified" : `${verifiedCount} verified, ${uploadedCount - verifiedCount} pending`}</p>
              <div className="mt-2 h-2 rounded-full bg-white/20 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(verifiedCount / docTypes.length) * 100}%` }}
                  className="h-full rounded-full bg-white" transition={{ duration: 0.5 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {docTypes.map((doc, i) => {
            const uploaded = docs[doc.id];
            const StatusIcon = uploaded ? statusConfig[uploaded.status]?.icon || Clock : null;
            return (
              <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-foreground truncate">{doc.label}</h3>
                        {doc.required && <span className="text-[8px] font-black text-rose-500 uppercase">Required</span>}
                      </div>
                      {uploaded ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusConfig[uploaded.status]?.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[uploaded.status]?.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{new Date(uploaded.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-0.5">Not uploaded</p>
                      )}
                    </div>
                  </div>
                  {!uploaded ? (
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleUpload(doc.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all shrink-0">
                      <Upload className="h-3.5 w-3.5" /> Upload
                    </motion.button>
                  ) : uploaded.status === "rejected" ? (
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleUpload(doc.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-500/20 transition-all shrink-0">
                      <Upload className="h-3.5 w-3.5" /> Re-upload
                    </motion.button>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-700/30 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Important</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">All required documents must be verified before you can receive bookings. Verification takes 1-2 business days.</p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default ProviderDocuments;
