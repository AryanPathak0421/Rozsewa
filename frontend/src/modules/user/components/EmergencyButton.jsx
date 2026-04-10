import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmergencyButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      onClick={() => navigate("/shops?emergency=true")}
      className="relative w-full rounded-2xl bg-gradient-to-r from-secondary to-emergency-glow px-6 py-4 font-bold text-emergency-foreground shadow-xl transition-all"
      style={{ animation: "pulse-glow 2s cubic-bezier(0.4,0,0.6,1) infinite" }}
    >
      <div className="flex items-center justify-center gap-3">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Zap className="h-6 w-6 fill-current" />
        </motion.div>
        <div className="text-left">
          <div className="text-lg font-extrabold tracking-tight">Emergency Service 24×7</div>
          <div className="text-xs font-medium opacity-80">Tap for instant help — Plumber, Electrician & more</div>
        </div>
        <Zap className="h-5 w-5 fill-current opacity-60" />
      </div>
    </motion.button>
  );
};

export default EmergencyButton;
