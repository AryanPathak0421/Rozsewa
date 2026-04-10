import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, Bell, User, Moon, Sun, Home, Store, ClipboardList, Heart } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { getUnreadCount } from "@/lib/notifications";

const cities = ["Lucknow", "Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Kolkata", "Chennai"];

const navLinks = [
  { label: "Home", path: "/", icon: Home },
  { label: "Services", path: "/shops", icon: Store },
  { label: "Bookings", path: "/my-bookings", icon: ClipboardList },
  { label: "Favorites", path: "/favorites", icon: Heart },
];

const TopNav = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [city, setCity] = useState(() => localStorage.getItem("rozsewa_user_city") || "Lucknow");
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Basic polling or event listening for unread count in a real app
    // Here we'll just pull it on mount and when focus returns
    const updateCount = () => setUnreadCount(getUnreadCount("customer"));
    updateCount();
    window.addEventListener("focus", updateCount);
    return () => window.removeEventListener("focus", updateCount);
  }, [location.pathname]);

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    localStorage.setItem("rozsewa_user_city", selectedCity);
    setShowLocationModal(false);
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      toast({ title: "Accessing Location", description: "Fetching your current city..." });
      navigator.geolocation.getCurrentPosition(
        () => {
          const detectedCity = "Lucknow (Detected)";
          handleCitySelect(detectedCity);
          toast({ title: "Location Updated", description: `Successfully detected ${detectedCity}.` });
        },
        () => toast({ title: "Access Denied", description: "Please enable location services.", variant: "destructive" })
      );
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (user) navigate("/profile");
    else navigate("/login");
  };

  return (
    <>
      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-50 glass border-b border-border/50">

        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex h-16 items-center gap-6">
              <Link to="/" className="flex items-center shrink-0 mr-2">
                <img src="/RozSewa.png" alt="RojSewa" className="h-7 w-auto object-contain" />
              </Link>

              <button onClick={() => setShowLocationModal(true)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm font-semibold hover:bg-muted hover:border-primary/30 group transition-all">
                <MapPin className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="truncate max-w-[120px]">{city}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>

              <nav className="flex items-center gap-1 ml-4">
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path}
                    className={`relative px-4 py-2 text-sm font-black rounded-xl transition-all ${isActive(link.path) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}>
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex-1" />

              <div className="flex items-center gap-3">
                <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted hover:border-primary/30 transition-all">
                  {isDark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-foreground/80" />}
                </motion.button>

                <Link to="/notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted hover:border-primary/30 transition-all">
                  <Bell className="h-5 w-5 text-foreground/80" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-rose-500 text-[10px] font-black text-white">{unreadCount}</span>
                  )}
                </Link>

                <div className="h-6 w-px bg-border mx-1" />

                <button onClick={handleProfileClick} className="flex items-center gap-2 rounded-full border border-border bg-background pl-1 pr-4 py-1 hover:bg-muted hover:border-primary/30 transition-all">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground leading-none">Account</span>
                    <span className="text-sm font-bold text-foreground leading-none mt-0.5">{user ? (user.name || user.ownerName || "User").split(" ")[0] : "Login"}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden">
          <div className="px-4 flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center shrink-0">
              <img src="/RozSewa.png" alt="RojSewa" className="h-8 w-auto object-contain" />
            </Link>

            <button onClick={() => setShowLocationModal(true)} className="flex items-center justify-center gap-1 rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs font-bold transition-colors hover:bg-muted">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="max-w-[80px] truncate">{city}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>

            <div className="flex shrink-0 items-center gap-2">
              <Link to="/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors">
                <Bell className="h-[18px] w-[18px] text-foreground" />
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-background bg-rose-500 text-[9px] font-bold text-white">{unreadCount}</span>}
              </Link>
              <button onClick={handleProfileClick} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-primary/10 text-primary transition-colors hover:bg-primary/20">
                <User className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Location Selector Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm rounded-[32px] bg-card p-6 shadow-2xl border border-border">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-foreground">Where are you?</h3>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">Select a city to check services</p>
                </div>
                <button onClick={() => setShowLocationModal(false)} className="rounded-full bg-muted p-2 hover:bg-muted/80"><ChevronDown className="h-5 w-5 rotate-180" /></button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {cities.map((c) => (
                  <button key={c} onClick={() => handleCitySelect(c)}
                    className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-bold transition-all ${city === c ? "border-primary bg-primary/10 text-primary shadow-md shadow-primary/10" : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
                      }`}>
                    <MapPin className="h-4 w-4" /> {c}
                  </button>
                ))}
              </div>

              <button className="mt-6 w-full rounded-2xl bg-foreground py-4 text-sm font-extrabold text-background shadow-xl flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors"
                onClick={handleUseCurrentLocation}>
                <MapPin className="h-5 w-5" /> Auto-Detect Location
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopNav;
