import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";

const defaultCategories = [
  { name: "Salon", icon: "Scissors", color: "bg-pink-50 text-pink-600" },
  { name: "AC Repair", icon: "Wrench", color: "bg-blue-50 text-blue-600" },
  { name: "Electrician", icon: "Zap", color: "bg-yellow-50 text-yellow-700" },
  { name: "Plumber", icon: "Droplets", color: "bg-cyan-50 text-cyan-600" },
  { name: "Painter", icon: "Paintbrush", color: "bg-purple-50 text-purple-600" },
  { name: "Home Maint.", icon: "Home", color: "bg-green-50 text-green-600" },
  { name: "Medical", icon: "Stethoscope", color: "bg-red-50 text-red-600" },
  { name: "Mechanic", icon: "Car", color: "bg-orange-50 text-orange-600" },
  { name: "Decoration", icon: "Flower2", color: "bg-rose-50 text-rose-600" },
  { name: "Pandit", icon: "BookOpen", color: "bg-amber-50 text-amber-700" },
];

const CategoryGrid = ({ showAll = true }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/public/categories");
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        setCategories(defaultCategories.map((c, i) => ({ ...c, _id: `def-${i}` })));
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories(defaultCategories.map((c, i) => ({ ...c, _id: `def-${i}` })));
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    // Dynamically get Lucide icon or fallback to Layers
    const Icon = LucideIcons[iconName] || LucideIcons.Layers;
    return <Icon className="h-6 w-6" />;
  };

  // Assign fixed colors based on index to keep it colorful but deterministic
  const colors = [
    "bg-emerald-50 text-emerald-600",
    "bg-blue-50 text-blue-600",
    "bg-pink-50 text-pink-600",
    "bg-amber-50 text-amber-700",
    "bg-indigo-50 text-indigo-600",
    "bg-rose-50 text-rose-600",
    "bg-cyan-50 text-cyan-600",
    "bg-purple-50 text-purple-600",
    "bg-orange-50 text-orange-600",
    "bg-teal-50 text-teal-600",
  ];

  const displayList = showAll ? categories : categories.slice(0, 10);

  if (loading) return (
    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-10 gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
          <div className="h-14 w-14 bg-gray-100 rounded-2xl"></div>
          <div className="h-2 w-12 bg-gray-100 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-5 lg:grid-cols-10">
      {displayList.map((cat, i) => (
        <motion.button
          key={cat._id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.02 }}
          whileHover={{ y: -8, scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(`/shops?category=${encodeURIComponent(cat.name)}`)}
          className="group flex flex-col items-center gap-2"
        >
          <div className={`flex h-16 w-16 items-center justify-center rounded-[1.5rem] ${cat.image ? "" : colors[i % colors.length]} transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-emerald-500/10 overflow-hidden border border-transparent group-hover:border-emerald-500/20`}>
            {cat.image ? (
              <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
            ) : (
              getIcon(cat.icon)
            )}
          </div>
          <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight text-center leading-tight line-clamp-1 decoration-emerald-500 group-hover:text-emerald-700">
            {cat.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryGrid;
