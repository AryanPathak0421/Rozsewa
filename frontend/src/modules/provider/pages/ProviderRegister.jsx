import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import {
  Store, User, Phone, MapPin, Briefcase, ArrowRight, ArrowLeft, Loader2,
  ShieldCheck, CreditCard, Gift, CheckCircle, Navigation, Clock,
  Car, Building, GraduationCap, Home, Utensils, HardHat, Truck, Wrench, Star, FileText, Camera, Image as ImageIcon, ChevronRight, X, Building2,
  Layers
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";

// User's requested top-level business models
const businessModels = [
  { id: 'shop', label: 'Shop Owner', icon: Store },
  { id: 'service_provider', label: 'Service Provider', icon: Wrench },
  { id: 'taxi', label: 'Taxi / Transport', icon: Car },
  { id: 'hotel', label: 'Hotel / Lodge / PG', icon: Building },
  { id: 'tutor_doc', label: 'Tutor / Doctor', icon: GraduationCap },
  { id: 'property_dealer', label: 'Property Dealer', icon: Home },
  { id: 'food', label: 'Food / Tiffin', icon: Utensils },
  { id: 'labour', label: 'Labour Contractor', icon: HardHat },
  { id: 'delivery', label: 'Delivery Service', icon: Truck },
];

const ProviderRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [coords, setCoords] = useState([0, 0]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [categories, setCategories] = useState([]);
  const [fetchingCats, setFetchingCats] = useState(false);

  const [formData, setFormData] = useState({
    mobile: "",
    otp: "",
    businessType: "",
    vendorType: "", // Category ID
    subServices: [],
    ownerName: "",
    shopName: "",
    gst: "",
    kycAadhaar: "",
    kycAadhaarPhoto: "",
    kycPanPhoto: "",
    profileImage: "",
    serviceRadius: "5",
    registrationType: "individual",
    referredBy: "",
    password: "",
  });

  const [referredByName, setReferredByName] = useState("");
  const [verifyingReferral, setVerifyingReferral] = useState(false);

  useEffect(() => {
    const verifyCode = async () => {
      if (formData.referredBy && formData.referredBy.length >= 5) {
        setVerifyingReferral(true);
        try {
          const { data } = await API.get(`/public/verify-referral/${formData.referredBy}`);
          setReferredByName(data.name);
        } catch (err) {
          setReferredByName("");
        } finally {
          setVerifyingReferral(false);
        }
      } else {
        setReferredByName("");
      }
    };

    const timer = setTimeout(verifyCode, 600);
    return () => clearTimeout(timer);
  }, [formData.referredBy]);

  const [generatedCode, setGeneratedCode] = useState("");
  const [cardConfig, setCardConfig] = useState({ enabled: true, price: 99 });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await API.get("/public/config");
        if (data.registrationPrice) {
          setCardConfig(prev => ({ ...prev, price: data.registrationPrice }));
        }
      } catch (err) {
        console.error("Failed to fetch register config:", err);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setFetchingCats(true);
    try {
      const { data } = await API.get("/provider/categories");
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setFetchingCats(false);
    }
  };

  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data && data.display_name) {
              const addr = data.address || {};
              setCoords([longitude, latitude]);
              setAddress(data.display_name);
              setCity(addr.city || addr.town || addr.village || "");
              setState(addr.state || "");
            }
          } catch (err) {
            console.error("Error fetching address:", err);
          } finally {
            setIsFetchingLocation(false);
          }
        },
        () => {
          setIsFetchingLocation(false);
          toast({ title: "Location Error", description: "Enable location permissions.", variant: "destructive" });
        }
      );
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const upData = new FormData();
    upData.append("image", file);
    setIsUploading(true);
    try {
      const { data } = await API.post("/upload", upData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData({ ...formData, [type]: data.url });
      toast({ title: "Photo Uploaded" });
    } catch { toast({ title: "Upload Failed", variant: "destructive" }); }
    finally { setIsUploading(false); }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.mobile || formData.mobile.length < 10) {
      toast({ title: "Invalid Number", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await API.post("/provider/check-existence", { mobile: formData.mobile });
      if (data.exists) {
        toast({ title: "Already Registered", description: "Use another number or login.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      setOtpSent(true);
      toast({ title: "OTP Sent" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const currentCategory = categories.find(c => c._id === formData.vendorType);

  const toggleSubService = (service) => {
    setFormData(prev => ({
      ...prev,
      subServices: prev.subServices.includes(service)
        ? prev.subServices.filter(s => s !== service)
        : [...prev.subServices, service]
    }));
  };

  const handleSignupComplete = async (response) => {
    try {
      setIsLoading(true);
      const { data: verifyRes } = await API.post("/payment/verify", response);
      if (verifyRes.success) {
        const finalData = {
          ...formData,
          address,
          city,
          state,
          location: { type: 'Point', coordinates: coords }
        };
        const signupRes = await signup(finalData, 'provider');
        if (signupRes.success) {
          setGeneratedCode(signupRes.data.vendorCode);
          setStep(9);
        } else {
          toast({ title: "Signup Failed", description: signupRes.error, variant: "destructive" });
        }
      } else {
        toast({ title: "Payment Failed", description: "Verification mismatch.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!window.Razorpay) return;

    setIsLoading(true);
    try {
      const { data: order } = await API.post("/payment/order", { amount: cardConfig.price });
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "RozSewa",
        order_id: order.id,
        handler: handleSignupComplete,
        prefill: { contact: formData.mobile },
        theme: { color: "#059669" },
        modal: { ondismiss: () => setIsLoading(false) }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast({ title: "Payment Error", variant: "destructive" });
      setIsLoading(false);
    }
  };

  const stepTitles = [
    "Verification", "Business Type", "Select Industry", "Add Services",
    "Business Profile", "Identity Photo", "Referral", "Pro Account", "Success!"
  ];

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg space-y-6 pt-6 pb-20 md:py-0">
        <div className="text-center">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            {step === 9 ? <CheckCircle className="h-8 w-8 text-emerald-600" /> : <Layers className="h-8 w-8 text-emerald-600" />}
          </motion.div>
          <h2 className="mt-4 text-2xl font-black text-foreground tracking-tighter">{stepTitles[step - 1]}</h2>
          <p className="mt-1 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{step < 9 ? `Step ${step} of 8` : 'Verified'}</p>
        </div>

        <motion.div layout initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative rounded-[2rem] border border-border bg-card p-6 md:p-8 shadow-2xl shadow-emerald-500/5">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" className="space-y-6">
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mobile Number</label>
                    <div className="relative group transition-all">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-600 transition-colors">
                        <Phone className="h-5 w-5" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                        maxLength="10"
                        className="w-full rounded-2xl border border-border bg-background py-4 pl-14 pr-5 font-bold text-lg tracking-wider focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full rounded-2xl bg-emerald-600 py-4 font-black text-white shadow-lg shadow-emerald-600/20 uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    {isLoading ? 'Processing...' : 'Send OTP'}
                  </button>
                </form>
                {otpSent && (
                  <form onSubmit={e => { e.preventDefault(); setStep(2); }} className="space-y-4 mt-6 pt-6 border-t border-dashed border-border animate-in fade-in slide-in-from-top-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-center block text-muted-foreground">Enter 6-Digit OTP</label>
                      <input type="text" required value={formData.otp} onChange={e => setFormData({ ...formData, otp: e.target.value })} maxLength="6" className="w-full text-center tracking-[0.3em] rounded-2xl border border-border bg-background p-4 text-2xl font-black focus:ring-4 focus:ring-emerald-500/10 outline-none" placeholder="••••••" />
                    </div>
                    <button type="submit" className="w-full rounded-2xl border-2 border-emerald-600/20 py-4 font-black text-emerald-600 uppercase text-[10px] tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Verify OTP
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" className="space-y-4">
                <p className="text-[10.5px] uppercase font-black text-emerald-700 opacity-60 text-center mb-6 tracking-widest">Select your business model</p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {businessModels.map(m => (
                    <button key={m.id} onClick={() => { setFormData({ ...formData, businessType: m.id }); setStep(3); }} className="flex flex-col items-center justify-center p-5 rounded-3xl border-2 border-border bg-background hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
                      <m.icon className="h-7 w-7 mb-3 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      <span className="text-[9px] font-black uppercase text-center leading-tight tracking-tighter group-hover:text-emerald-900">{m.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(1)} className="w-full py-6 text-xs font-black text-muted-foreground uppercase tracking-widest opacity-50">Go Back</button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" className="space-y-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(2)} className="p-3 bg-muted rounded-2xl hover:bg-emerald-50 transition-colors"><ArrowLeft className="h-4 w-4" /></button>
                  <span className="text-[11px] font-black uppercase text-emerald-700 tracking-widest">Select Your Industry</span>
                </div>
                <div className="grid grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar pb-4">
                  {fetchingCats ? (
                    <div className="col-span-full py-10 text-center text-xs font-bold text-gray-400">Loading Industries...</div>
                  ) : categories.map(c => (
                    <button key={c._id} onClick={() => { setFormData({ ...formData, vendorType: c._id, subServices: [] }); setStep(4); }} className="flex flex-col items-center p-4 rounded-[1.5rem] border-2 border-border bg-background hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all group overflow-hidden">
                      <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-2 text-emerald-600 shadow-inner group-hover:scale-110 transition-transform overflow-hidden">
                        {c.image ? (
                          <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                        ) : (
                          (() => {
                            const Icon = LucideIcons[c.icon] || LucideIcons.Layers;
                            return <Icon className="h-5 w-5" />;
                          })()
                        )}
                      </div>
                      <span className="text-[9px] font-black uppercase text-center leading-tight tracking-tighter line-clamp-2">{c.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" className="space-y-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(3)} className="p-3 bg-muted rounded-2xl hover:bg-emerald-50 transition-colors"><ArrowLeft className="h-4 w-4" /></button>
                  <span className="text-[11px] font-black uppercase text-emerald-700 tracking-widest">Available Services</span>
                </div>
                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {currentCategory?.services.map(s => (
                    <button key={s.name} onClick={() => toggleSubService(s.name)} className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${formData.subServices.includes(s.name) ? 'border-emerald-500 bg-emerald-50 shadow-inner' : 'border-border hover:border-emerald-200'}`}>
                      <div className="flex flex-col items-start">
                        <span className={`text-[11px] font-black uppercase tracking-tight ${formData.subServices.includes(s.name) ? 'text-emerald-900' : 'text-foreground'}`}>{s.name}</span>
                        <span className="text-[9px] font-bold text-emerald-600">Starts at ₹{s.basePrice}</span>
                      </div>
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${formData.subServices.includes(s.name) ? 'bg-emerald-600 scale-110 shadow-lg text-white' : 'bg-muted'}`}>
                        {formData.subServices.includes(s.name) ? <CheckCircle className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-border" />}
                      </div>
                    </button>
                  ))}
                  {(!currentCategory?.services || currentCategory.services.length === 0) && (
                    <div className="py-10 text-center text-xs font-bold text-gray-400 italic">No services listed for this category.</div>
                  )}
                </div>
                <button onClick={() => setStep(5)} disabled={formData.subServices.length === 0} className="w-full mt-2 rounded-2xl bg-emerald-600 py-5 font-black text-white shadow-xl shadow-emerald-600/20 uppercase text-xs tracking-widest transition-all active:scale-95 disabled:opacity-50">Continue</button>
              </motion.div>
            )}

            {step === 5 && (
              <motion.form key="s5" onSubmit={e => { e.preventDefault(); if (formData.kycAadhaarPhoto && formData.kycPanPhoto) setStep(6); else toast({ title: "Photos Required", variant: "destructive" }); }} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Owner Name</label><input required value={formData.ownerName} onChange={e => setFormData({ ...formData, ownerName: e.target.value })} className="w-full rounded-2xl border border-border bg-background p-4 font-bold text-sm" placeholder="e.g. John Doe" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Shop Name</label><input required value={formData.shopName} onChange={e => setFormData({ ...formData, shopName: e.target.value })} className="w-full rounded-2xl border border-border bg-background p-4 font-bold text-sm" placeholder="e.g. Sharma Kirana Store" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">GST (Optional)</label><input value={formData.gst} onChange={e => setFormData({ ...formData, gst: e.target.value.toUpperCase() })} className="w-full rounded-2xl border border-border bg-background p-4 font-bold text-sm" placeholder="22AAAAA0000A1Z5" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Aadhaar/PAN No.</label><input required value={formData.kycAadhaar} onChange={e => setFormData({ ...formData, kycAadhaar: e.target.value.toUpperCase() })} className="w-full rounded-2xl border border-border bg-background p-4 font-bold text-sm" placeholder="0000 0000 0000" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['kycAadhaarPhoto', 'kycPanPhoto'].map(type => (
                    <label key={type} className={`flex flex-col items-center justify-center h-32 rounded-3xl border-2 border-dashed transition-all cursor-pointer ${formData[type] ? 'border-emerald-500 bg-emerald-50' : 'border-border hover:bg-gray-50'}`}>
                      <input type="file" className="hidden" onChange={e => handleFileUpload(e, type)} />
                      {formData[type] ? <img src={formData[type]} className="h-full w-full object-cover rounded-3xl" /> : <div className="flex flex-col items-center"><Camera className="h-7 w-7 text-gray-300 mb-2" /><span className="text-[9px] font-black uppercase text-gray-400">{type.includes('Aadhaar') ? 'Aadhaar Card' : 'PAN Card'}</span></div>}
                    </label>
                  ))}
                </div>
                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Secure Password</label><input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full rounded-2xl border border-border bg-background p-5 font-bold outline-none focus:ring-4 focus:ring-emerald-500/10" placeholder="••••••••" /></div>
                <div className="space-y-4 pt-4 border-t border-dashed border-border mt-2">
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1 italic">Business Location</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAddress("")}
                        className={`flex-1 py-3 rounded-2xl border-2 text-[10px] font-black uppercase transition-all tracking-widest ${!address ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-inner' : 'border-border text-gray-400 opacity-60'}`}
                      >
                        Enter Manually
                      </button>
                      <button
                        type="button"
                        onClick={fetchLocation}
                        className={`flex-1 py-3 rounded-2xl border-2 text-[10px] font-black uppercase transition-all tracking-widest ${isFetchingLocation ? 'animate-pulse' : ''} ${coords[0] !== 0 ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-inner' : 'border-border text-gray-400 opacity-60'}`}
                      >
                        {isFetchingLocation ? 'Locating...' : coords[0] !== 0 ? 'Location Detected ✓' : 'Use Current Location'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">State</label>
                      <input type="text" value={state} onChange={e => setState(e.target.value)} className="w-full rounded-2xl border border-border bg-background p-4 font-bold text-xs" placeholder="Maharashtra" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">City</label>
                      <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full rounded-2xl border border-border bg-background p-4 font-bold text-xs" placeholder="Mumbai" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Detailed Address</label>
                    <textarea
                      required
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background p-4 font-bold text-xs focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:opacity-50"
                      rows={3}
                      placeholder="Building, Street, Landmark..."
                    />
                  </div>
                </div>
                <button type="submit" disabled={isUploading} className="w-full rounded-2xl bg-emerald-600 py-5 font-black text-white shadow-xl shadow-emerald-600/20 uppercase text-xs tracking-widest transition-all active:scale-95">{isUploading ? 'Uploading Docs...' : 'Create Profile'}</button>
              </motion.form>
            )}

            {step === 6 && (
              <motion.div key="s6" className="text-center space-y-8">
                <div className="relative mx-auto w-44 h-44">
                  <div className={`w-full h-full rounded-[60px] border-4 border-dashed flex items-center justify-center bg-gray-50 overflow-hidden rotate-3 ${formData.profileImage ? 'border-emerald-500 bg-white shadow-2xl' : 'border-gray-200'}`}>
                    {formData.profileImage ? <img src={formData.profileImage} className="w-full h-full object-cover -rotate-3 scale-110" /> : <User className="h-20 w-20 text-gray-200 -rotate-3" />}
                  </div>
                  <label className="absolute -bottom-3 -right-3 h-16 w-16 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white cursor-pointer shadow-2xl border-4 border-white active:scale-90 transition-transform">
                    <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'profileImage')} />
                    {isUploading ? <Loader2 className="h-7 w-7 animate-spin" /> : <Camera className="h-7 w-7" />}
                  </label>
                </div>
                <div><h3 className="text-2xl font-black tracking-tight">Identity Photo</h3><p className="text-[11px] font-bold text-gray-400 mt-2 px-10">Please upload a clear selfie for vendor verification and customer trust.</p></div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setStep(7)} disabled={!formData.profileImage} className="w-full rounded-2xl bg-emerald-600 py-5 font-black text-white shadow-xl shadow-emerald-600/20 uppercase text-xs tracking-widest disabled:opacity-50">Continue</button>
                  <button onClick={() => setStep(5)} className="w-full py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">Back to Profile</button>
                </div>
              </motion.div>
            )}

            {step === 7 && (
              <motion.div key="s7" className="space-y-6 py-2">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-emerald-700 opacity-60 text-center tracking-widest">How did you find us?</p>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'individual', label: 'Individually', icon: User },
                      { id: 'vendor_referral', label: 'By Vendor Referral', icon: Store },
                      { id: 'employee', label: 'By RozSewa Employee', icon: Briefcase }
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => setFormData({ ...formData, registrationType: type.id, referredBy: "" })}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${formData.registrationType === type.id ? 'border-emerald-500 bg-emerald-50 shadow-inner' : 'border-border bg-background hover:border-emerald-200'}`}
                      >
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${formData.registrationType === type.id ? 'bg-emerald-600 text-white' : 'bg-muted text-gray-400'}`}>
                          <type.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-black uppercase tracking-tight">{type.label}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-70">
                            {type.id === 'individual' ? 'Direct registration' : type.id === 'vendor_referral' ? 'Partner referral' : 'Assisted registration'}
                          </p>
                        </div>
                        {formData.registrationType === type.id && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>

                  {/* Conditional Code Input */}
                  <AnimatePresence>
                    {formData.registrationType !== 'individual' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-emerald-50/50 p-6 rounded-[2rem] border-2 border-emerald-100/50 flex flex-col items-center text-center mt-2">
                          <h3 className="font-black text-emerald-900 text-xs uppercase tracking-tight mb-3">
                            {formData.registrationType === 'vendor_referral' ? 'Enter Vendor Referral Code' : 'Enter Employee ID'}
                          </h3>
                          <div className="relative w-full">
                            <input
                              required
                              value={formData.referredBy || ""}
                              onChange={e => setFormData({ ...formData, referredBy: e.target.value.toUpperCase() })}
                              className="w-full rounded-xl border-2 border-emerald-200 bg-white py-3.5 px-4 font-black text-xl text-center tracking-widest text-emerald-900 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:opacity-30"
                              placeholder={formData.registrationType === 'vendor_referral' ? "RSVND..." : "EMP..."}
                            />
                            <AnimatePresence>
                              {verifyingReferral && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                                  <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <AnimatePresence>
                            {referredByName && (
                              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 px-4 py-2 bg-emerald-100 rounded-full border border-emerald-200">
                                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-tight flex items-center gap-1.5">
                                  <CheckCircle className="h-3 w-3" /> Referred by: {referredByName}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest mt-3 italic">First 3 services will be commission-free! 🎁</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-3 px-2">
                  <button
                    onClick={() => {
                      if (formData.registrationType !== 'individual' && !formData.referredBy) {
                        toast({ title: "Code Required", description: "Please enter referral or employee code.", variant: "destructive" });
                        return;
                      }
                      setStep(8);
                    }}
                    className="w-full rounded-2xl bg-emerald-600 py-4 font-black text-white shadow-xl shadow-emerald-600/20 uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button onClick={() => setStep(6)} className="w-full py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">Go Back</button>
                </div>
              </motion.div>
            )}

            {step === 8 && (
              <motion.form key="s8" onSubmit={handlePayment} className="space-y-6 text-center py-2">
                <div className="relative rounded-[2rem] bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white shadow-2xl overflow-hidden group">
                  {/* Glassmorphism Accents */}
                  <div className="absolute -top-10 -right-10 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                  <div className="absolute -bottom-10 -left-10 h-24 w-24 bg-black/20 rounded-full blur-xl"></div>

                  <div className="relative flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                      <ShieldCheck className="h-3 w-3 text-emerald-300" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-50">Identity Verified Card</span>
                    </div>

                    <h3 className="text-xl font-black mb-1 tracking-tighter flex items-center gap-2">
                      RozSewa <span className="bg-white text-emerald-700 px-1.5 py-0.5 rounded-lg text-[10px] uppercase">PRO</span>
                    </h3>

                    <div className="flex items-center justify-center gap-1 my-4">
                      <span className="text-xl font-bold opacity-50">₹</span>
                      <span className="text-5xl font-black tracking-tighter">{cardConfig.price}</span>
                      <span className="text-[9px] uppercase font-black opacity-30 ml-2 tracking-widest mt-4">once</span>
                    </div>

                    <div className="w-full space-y-2 bg-black/10 backdrop-blur-md p-4 rounded-2xl border border-white/5 text-left">
                      {[
                        { icon: CheckCircle, text: "Permanent Partner ID" },
                        { icon: Star, text: "Priority Business Leads" },
                        { icon: ShieldCheck, text: "Verified Badge" }
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <feature.icon className="h-3 w-3 text-emerald-300" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tight text-white/80">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-2 space-y-3">
                  <button type="submit" disabled={isLoading} className="w-full rounded-2xl bg-gray-900 py-4 font-black text-white shadow-2xl flex items-center justify-center gap-4 uppercase text-[10px] tracking-widest hover:bg-emerald-600 active:scale-95 transition-all group overflow-hidden relative">
                    <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                      Finalize & Pay
                    </span>
                  </button>
                  <button type="button" onClick={() => setStep(7)} className="w-full py-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Go Back</button>
                  <p className="mt-2 text-[8px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-40 uppercase">Secure 256-bit encrypted payment</p>
                </div>
              </motion.form>
            )}

            {step === 9 && (
              <motion.div key="s9" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-6 space-y-6">
                {/* Status Icon */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-20 w-20 bg-amber-50 border-4 border-amber-200 rounded-[2rem] flex items-center justify-center shadow-lg shadow-amber-100">
                    <Clock className="h-10 w-10 text-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-foreground">Under Review</h3>
                    <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">Payment Received · Docs Pending</p>
                  </div>
                </div>

                {/* Partner ID card */}
                <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-emerald-600/20">
                  <div className="absolute -top-6 -right-6 h-24 w-24 bg-white/10 rounded-full blur-xl"></div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Your Partner ID</p>
                  <p className="text-3xl font-black font-mono tracking-widest text-emerald-100">{generatedCode}</p>
                  <p className="text-[8px] font-bold opacity-40 mt-2 uppercase tracking-widest">Keep this ID safe for future reference</p>
                </div>

                {/* Verification Steps */}
                <div className="bg-muted/40 rounded-2xl p-4 space-y-3 text-left border border-border">
                  {[
                    { label: "Payment Received", done: true },
                    { label: "Documents Submitted", done: true },
                    { label: "Admin Verification (24–48 hrs)", done: false },
                    { label: "Account Activated", done: false },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-emerald-500 shadow-sm shadow-emerald-300' : 'bg-border'}`}>
                        {step.done
                          ? <CheckCircle className="h-3 w-3 text-white" />
                          : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-tight ${step.done ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}>{step.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link to="/provider/login" className="flex w-full justify-center items-center gap-3 bg-gray-900 py-4 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-emerald-600 transition-all active:scale-95 group">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default ProviderRegister;
