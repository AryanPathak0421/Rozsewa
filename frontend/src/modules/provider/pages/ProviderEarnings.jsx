import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import EarningsWidget from "@/modules/provider/components/EarningsWidget";
import { Download, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";

const ProviderEarnings = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem("rozsewa_bookings") || "[]");
    const completed = allBookings.filter(b => b.status === "completed").sort((a,b) => {
       const dA = new Date(a.date || a.timestamp || Date.now());
       const dB = new Date(b.date || b.timestamp || Date.now());
       return dB - dA;
    });
    setTransactions(completed);
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate API delay for export generation
    setTimeout(() => {
      setIsExporting(false);
      
      // Create a dummy CSV/JSON blob for download demonstration
      const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `rozsewa-earnings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Your earnings report has been downloaded.",
      });
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      <ProviderTopNav />
      <main className="container max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Wallet & Earnings</h1>
            <p className="text-sm text-muted-foreground">Track your revenue and withdraw funds.</p>
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm hover:bg-muted transition disabled:opacity-70"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} 
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
        
        <EarningsWidget />

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-bold tracking-tight text-foreground">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <p className="text-sm">No transactions to display yet.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {transactions.slice(0, 10).map((t, idx) => (
                <div key={t.id || idx} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background shadow-sm">
                  <div>
                    <h4 className="text-sm font-bold text-foreground truncate">{t.service}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.user || "Customer"} • {new Date(t.date || t.timestamp || Date.now()).toLocaleDateString()}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1">Ref: {t.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-emerald-600">+ ₹{t.amount || 0}</p>
                    <span className="mt-1 inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-100">
                      <Check className="h-2.5 w-2.5" /> Settled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <ProviderBottomNav />
    </div>
  );
};

export default ProviderEarnings;
