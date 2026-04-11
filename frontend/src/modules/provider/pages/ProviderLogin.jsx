import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Phone, ShieldCheck, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const ProviderLogin = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleVerifyLogin = async (e) => {
    e.preventDefault();
    if (!mobile || !password) {
      toast({ title: "Error", description: "Mobile and password are required", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const res = await login(mobile, password, "provider");
    setIsLoading(false);

    if (res.success) {
      toast({ title: "Login Successful", description: `Welcome back, ${res.data.ownerName}!` });
      navigate("/provider");
    } else {
      toast({ title: "Login Failed", description: res.error, variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50/50 via-background to-blue-50/30 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-100 shadow-xl shadow-emerald-500/10"
          >
            <Store className="h-10 w-10 text-emerald-600" />
          </motion.div>
          <h2 className="mt-8 text-3xl font-black tracking-tight text-gray-900 italic uppercase">
            Provider Portal
          </h2>
          <p className="mt-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
            Manage your RozSewa store
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-200/50"
        >
          <form className="space-y-6" onSubmit={handleVerifyLogin}>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Registered Mobile</label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Phone className="h-4 w-4 text-emerald-500" />
                  </div>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    maxLength="10"
                    className="block w-full rounded-2xl border border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 text-sm font-bold placeholder:text-gray-300 focus:border-emerald-500 focus:ring-0 focus:outline-none transition-all"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secret Password</label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-2xl border border-gray-100 bg-gray-50/50 py-4 pl-12 pr-12 text-sm font-bold placeholder:text-gray-300 focus:border-emerald-500 focus:ring-0 focus:outline-none transition-all"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-emerald-600"
                  >
                    {showPassword ? <ShieldCheck className="h-5 w-5 fill-current opacity-20" /> : <ShieldCheck className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full justify-center items-center rounded-2xl bg-gray-900 px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Access Dashboard"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
              Don't have a business account?{" "}
              <Link to="/provider/register" className="text-emerald-600 border-b-2 border-emerald-100 hover:border-emerald-600 transition-all">
                Register Now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProviderLogin;
