import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Image as ImageIcon, ToggleLeft, ToggleRight, Trash2, Edit3, X, Save, Link2, Eye, Loader2, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import API from "@/lib/api";

const AdminBanners = () => {
  const { setTitle } = useOutletContext();
  const { toast } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    ctaLink: "/shops",
    ctaText: "Book Now",
    active: true
  });

  useEffect(() => {
    setTitle("Banner Management");
    fetchBanners();
  }, [setTitle]);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/admin/banners");
      setBanners(data);
    } catch (err) {
      toast({ title: "Fetch Failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      toast({ title: "Title and Image are required", variant: "destructive" });
      return;
    }

    try {
      if (editId) {
        const { data } = await API.put(`/admin/banners/${editId}`, form);
        setBanners(banners.map(b => b._id === editId ? data : b));
        toast({ title: "Banner Updated Successfully" });
      } else {
        const { data } = await API.post("/admin/banners", form);
        setBanners([data, ...banners]);
        toast({ title: "Banner Created Successfully" });
      }
      resetForm();
    } catch (err) {
      toast({ title: "Operation Failed", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", imageUrl: "", ctaLink: "/shops", ctaText: "Book Now", active: true });
    setShowForm(false);
    setEditId(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);
    setIsUploading(true);

    try {
      const res = await API.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm({ ...form, imageUrl: res.data.url });
      toast({ title: "Image Uploaded" });
    } catch (err) {
      toast({ title: "Upload Failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this banner?")) return;
    try {
      await API.delete(`/admin/banners/${id}`);
      setBanners(banners.filter(b => b._id !== id));
      toast({ title: "Banner Deleted" });
    } catch (err) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  const toggleActive = async (id) => {
    try {
      const { data } = await API.patch(`/admin/banners/${id}/status`);
      setBanners(banners.map(b => b._id === id ? data : b));
    } catch (err) {
      toast({ title: "Toggle Failed", variant: "destructive" });
    }
  };

  if (loading) return (
    <div className="flex h-96 flex-col items-center justify-center space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Banners...</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">Active Promotions</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Homepage Banners</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-600/10 hover:bg-emerald-700 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-24 text-center rounded-[2rem] border-4 border-dashed border-gray-100 bg-gray-50/50">
            <ImageIcon className="h-12 w-12 text-gray-200 mb-4" />
            <p className="text-sm font-bold text-gray-400">No active campaigns found.</p>
          </div>
        )}
        {banners.map((b, i) => (
          <motion.div
            key={b._id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`group flex flex-col rounded-[2.5rem] border bg-white overflow-hidden transition-all hover:shadow-2xl hover:shadow-emerald-500/10 ${b.active ? "border-gray-100" : "border-gray-200 opacity-60 grayscale-[50%]"}`}
          >
            <div className="relative h-48 bg-gray-50 overflow-hidden">
              {b.imageUrl ? (
                <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-10 w-10 text-gray-200" /></div>
              )}
              <div className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center">
                <button
                  onClick={() => toggleActive(b._id)}
                  className={`h-full w-full rounded-2xl flex items-center justify-center transition-all bg-white border border-gray-100 shadow-xl ${b.active ? "text-emerald-500" : "text-gray-400"}`}
                >
                  {b.active ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex-1">
                <h3 className="text-lg font-black text-gray-900 tracking-tight leading-tight mb-2 truncate">{b.title}</h3>
                <p className="text-xs text-gray-500 font-bold line-clamp-2 mb-4">{b.description || "No description provided."}</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
                <button
                  onClick={() => {
                    setForm({ ...b });
                    setEditId(b._id);
                    setShowForm(true);
                  }}
                  className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-gray-50 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-gray-50 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{editId ? "Update Campaign" : "Create Campaign"}</h3>
                <button onClick={resetForm} className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><X className="h-5 w-5 text-gray-400" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Campaign Image</label>
                  <label className={`relative block h-40 rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${form.imageUrl ? 'border-emerald-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                    {form.imageUrl ? (
                      <img src={form.imageUrl} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center">
                        {isUploading ? <Loader2 className="h-8 w-8 animate-spin text-emerald-600" /> : <Camera className="h-8 w-8 text-gray-200" />}
                        <span className="text-[10px] font-black text-gray-300 mt-2 uppercase tracking-widest">Upload 1200x400 px</span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="space-y-4">
                  <input type="text" placeholder="Headline" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/10 outline-none" />
                  <textarea placeholder="Promo Text" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/10 outline-none" />
                </div>

                <button type="submit" disabled={isUploading} className="w-full h-14 rounded-2xl bg-emerald-600 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all">{editId ? "Update Campaign" : "Launch Campaign"}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBanners;
