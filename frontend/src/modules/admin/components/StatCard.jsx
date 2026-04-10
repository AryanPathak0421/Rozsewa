import { motion } from "framer-motion";
import { Copy, TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
            {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-500">{title}</p>
        <h3 className="mt-1 text-2xl font-extrabold text-gray-900">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
