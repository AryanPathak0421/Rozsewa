import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [placeholders, setPlaceholders] = useState(["Search services..."]);

  useEffect(() => {
    const savedServices = JSON.parse(localStorage.getItem("rozsewa_admin_services") || "[]");
    if (savedServices.length > 0) {
      setPlaceholders(savedServices.filter(s => s.isVisible).map(s => `Search ${s.name}...`));
    } else {
      setPlaceholders([
        "Search Plumber...", "Search Salon...", "Search Electrician...", 
        "Search Doctor...", "Search AC Repair...", "Search Pandit..."
      ]);
    }
  }, []);

  useEffect(() => {
    if (placeholders.length <= 1) return;
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [placeholders]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-center"
    >
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch?.(e.target.value);
        }}
        className="w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-sm font-medium shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {!query && (
        <AnimatePresence mode="wait">
          <motion.div
            key={placeholderIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-y-0 left-12 flex items-center"
          >
            <span className="text-sm text-muted-foreground leading-none -mt-[2px]">{placeholders[placeholderIdx]}</span>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default SearchBar;
