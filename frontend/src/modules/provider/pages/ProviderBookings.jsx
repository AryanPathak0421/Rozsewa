import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import RecentBookingsList from "@/modules/provider/components/RecentBookingsList";

const ProviderBookings = () => {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      <ProviderTopNav />
      <main className="container max-w-6xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Manage Bookings</h1>
          <p className="text-sm text-muted-foreground">View all your past, present, and pending service requests here.</p>
        </div>
        <RecentBookingsList />
      </main>
      <ProviderBottomNav />
    </div>
  );
};

export default ProviderBookings;
