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
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSendOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 1200);
  };

  const handleVerifyLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Call real backend login
    const res = await login(mobile, "123456", "provider");
    setIsLoading(false);

    if (res.success) {
      toast({ title: "Login Successful", description: `Welcome back, ${res.data.ownerName}!` });
      navigate("/provider");
    } else {
      toast({ title: "Login Failed", description: res.error, variant: "destructive" });
      setOtpSent(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/50"
          >
            <Store className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, Partner
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your RozSewa Pro account
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-8 shadow-sm"
        >
          <AnimatePresence mode="wait">
            {!otpSent ? (
              <motion.form
                key="send-otp"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
                onSubmit={handleSendOtp}
              >
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-foreground">
                    Mobile Number
                  </label>
                  <div className="relative mt-1 border-border rounded-xl">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                      pattern="[0-9]{10}"
                      maxLength="10"
                      className="block w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                      placeholder="Enter 10 digit number"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex w-full justify-center items-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700 focus:outline-none disabled:opacity-70 active:scale-[0.98]"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send OTP"}
                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="verify-otp"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-6"
                onSubmit={handleVerifyLogin}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-muted-foreground">Sent to {mobile}</span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="flex items-center text-emerald-600 hover:text-emerald-700 font-bold"
                  >
                    <ArrowLeft className="mr-1 h-3 w-3" /> Edit
                  </button>
                </div>

                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-foreground">
                    Enter OTP
                  </label>
                  <div className="relative mt-1 border-border rounded-xl text-center">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <ShieldCheck className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      required
                      pattern="[0-9]{4,6}"
                      maxLength="6"
                      className="block w-full text-center tracking-[0.5em] font-bold rounded-xl border border-border bg-background py-3 pl-10 pr-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-lg"
                      placeholder="••••••"
                    />
                  </div>
                  <div className="mt-2 text-right">
                    <button type="button" className="text-xs font-semibold text-emerald-600 hover:text-emerald-500">
                      Resend OTP
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex w-full justify-center items-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700 focus:outline-none disabled:opacity-70 active:scale-[0.98]"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify & Login"}
                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have a provider account? </span>
            <Link to="/provider/register" className="font-semibold text-emerald-600 hover:text-emerald-500">
              Register your business
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProviderLogin;
