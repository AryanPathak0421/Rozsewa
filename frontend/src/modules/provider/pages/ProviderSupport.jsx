import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import { LifeBuoy, FileQuestion, MessageSquare, PhoneCall, ChevronRight } from "lucide-react";

const ProviderSupport = () => {
  return (
    <div className="min-h-[100dvh] bg-background pb-20 md:pb-8">
      <ProviderTopNav />
      <main className="container max-w-4xl px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-xl md:text-3xl font-black tracking-tight text-foreground">RozSewa Support</h1>
          <p className="text-xs md:text-sm text-muted-foreground">How can we help your business thrive today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center p-6 border border-border bg-card rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-left group">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mr-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-foreground">Live Chat Support</h3>
              <p className="text-xs text-muted-foreground mt-1">Connect instantly with our executive</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-emerald-600" />
          </button>

          <button className="flex items-center p-6 border border-border bg-card rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4 group-hover:scale-110 transition-transform">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-foreground">Request a Call</h3>
              <p className="text-xs text-muted-foreground mt-1">We will call you on your registered number</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-blue-600" />
          </button>
        </div>

        <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2"><LifeBuoy className="h-4 w-4 text-emerald-600"/> Ticket History</h3>
            <span className="text-xs font-bold text-muted-foreground">0 Pending</span>
          </div>
          <div className="p-8 text-center">
             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
               <FileQuestion className="h-8 w-8 text-gray-400" />
             </div>
             <p className="text-sm font-bold text-foreground mb-1">No support tickets</p>
             <p className="text-xs text-muted-foreground">You haven't raised any issues yet.</p>
             <button className="mt-4 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold shadow-sm hover:bg-muted transition">
               Raise a Ticket
             </button>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold tracking-wider uppercase text-muted-foreground mb-4">Help Articles & Training</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
             {["How to increase my shop visits?", "Understanding Payout Cycle", "How to manage staff allocation?"].map((title, i) => (
               <div key={i} className="flex flex-col rounded-xl border border-border bg-card p-4 hover:shadow-md cursor-pointer transition">
                 <h4 className="text-sm font-bold leading-tight mb-2 text-foreground flex-1">{title}</h4>
                 <p className="text-[10px] font-bold text-emerald-600 text-right mt-auto group-hover:underline">Read Article</p>
               </div>
             ))}
          </div>
        </section>
      </main>
      <ProviderBottomNav />
    </div>
  );
};

export default ProviderSupport;
