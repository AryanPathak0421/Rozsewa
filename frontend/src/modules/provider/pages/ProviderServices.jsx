import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Edit3, Trash2, Eye, EyeOff, X, Save, IndianRupee, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import { useToast } from "@/components/ui/use-toast";
import API from "@/lib/api";

const ProviderServices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", basic: "", standard: "", premium: "", express: "", duration: "30 min", visible: true, image: "" });
  const [uploading, setUploading] = useState(false);

  const { user } = useAuth();
  const [categoryServices, setCategoryServices] = useState([]);
  const [providerCategory, setProviderCategory] = useState("");

  useEffect(() => {
    fetchProviderInfoAndServices();
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm({ ...form, image: data.url });
      toast({ title: "Image Uploaded", description: "Service image updated successfully." });
    } catch (err) {
      toast({ title: "Upload Failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const fetchProviderInfoAndServices = async () => {
    setLoading(true);
    try {
      // 1. Fetch current services
      const { data: myServices } = await API.get("/services");
      setServices(myServices);

      // 2. Use user from context
      if (user?.vendorType) {
        // 3. Fetch categories
        const { data: catData } = await API.get(`/public/categories`);
        // vendorType can be ID or full object if populated
        const categoryId = typeof user.vendorType === 'string' ? user.vendorType : user.vendorType._id;
        const myCat = catData.find(c => c._id === categoryId);

        if (myCat) {
          setProviderCategory(myCat.name);
          setCategoryServices(myCat.services || []);
        }
      }
    } catch (err) {
      toast({ title: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.basic) { toast({ title: "Name & Basic price required", variant: "destructive" }); return; }
    if (Number(form.basic) < 1) { toast({ title: "Price must be positive", variant: "destructive" }); return; }

    const payload = {
      name: form.name,
      description: form.description,
      duration: form.duration,
      visible: form.visible,
      image: form.image,
      category: providerCategory, // Force match provider's category
      pricing: {
        basic: Number(form.basic),
        standard: form.standard ? Number(form.standard) : undefined,
        premium: form.premium ? Number(form.premium) : undefined,
        express: form.express ? Number(form.express) : 0
      }
    };

    try {
      if (editId) {
        await API.put(`/services/${editId}`, payload);
        toast({ title: "Service Updated" });
      } else {
        await API.post("/services", payload);
        toast({ title: "Service Added" });
      }
      const { data: updatedServices } = await API.get("/services");
      setServices(updatedServices);
      resetForm();
    } catch (err) {
      toast({ title: "Save failed", variant: "destructive" });
    }
  };

  const resetForm = () => { setForm({ name: "", description: "", basic: "", standard: "", premium: "", express: "", duration: "30 min", visible: true, image: "" }); setShowForm(false); setEditId(null); };

  const handleEdit = (s) => {
    setForm({
      name: s.name,
      description: s.description,
      basic: s.pricing?.basic || "",
      standard: s.pricing?.standard || "",
      premium: s.pricing?.premium || "",
      express: s.pricing?.express || "",
      duration: s.duration || "30 min",
      visible: s.visible,
      image: s.image || ""
    });
    setEditId(s._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      if (confirm("Are you sure you want to remove this service?")) {
        await API.delete(`/services/${id}`);
        toast({ title: "Service Removed" });
        const { data: updatedServices } = await API.get("/services");
        setServices(updatedServices);
      }
    } catch (err) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const toggleVisibility = async (s) => {
    try {
      await API.put(`/services/${s._id}`, { visible: !s.visible });
      const { data: updatedServices } = await API.get("/services");
      setServices(updatedServices);
    } catch (err) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <ProviderTopNav />
      <main className="container max-w-3xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div className="text-left">
              <h1 className="text-xl font-bold text-foreground">My Services</h1>
              <p className="text-xs text-muted-foreground">{services.length} services listed</p>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> Add Service
          </motion.button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-12 text-center">
                <IndianRupee className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-semibold text-muted-foreground">No services added yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add your services with pricing to start receiving bookings</p>
              </div>
            )}
            {services.map((s, i) => (
              <motion.div key={s._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`flex flex-col rounded-2xl border bg-card overflow-hidden transition-all ${s.visible ? "border-border" : "border-border/50 opacity-60"}`}>

                {s.image && (
                  <div className="h-40 w-full relative">
                    <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                <div className="p-4 flex-1 text-left">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-foreground">{s.name}</h3>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => toggleVisibility(s)} className="p-1.5 rounded-lg hover:bg-muted">{s.visible ? <Eye className="h-3.5 w-3.5 text-emerald-500" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}</button>
                      <button onClick={() => handleEdit(s)} className="p-1.5 rounded-lg hover:bg-muted"><Edit3 className="h-3.5 w-3.5 text-blue-500" /></button>
                      <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-rose-500" /></button>
                    </div>
                  </div>
                  {s.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{s.description}</p>}
                  <div className="flex gap-2 flex-wrap">
                    <span className="rounded-lg bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">Basic ₹{s.pricing?.basic}</span>
                    {s.pricing?.standard && <span className="rounded-lg bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-300">Standard ₹{s.pricing?.standard}</span>}
                    {s.pricing?.premium && <span className="rounded-lg bg-purple-50 dark:bg-purple-900/30 px-2 py-1 text-[10px] font-bold text-purple-700 dark:text-purple-300">Premium ₹{s.pricing?.premium}</span>}
                    {s.pricing?.express > 0 && <span className="rounded-lg bg-sky-50 dark:bg-sky-900/30 px-2 py-1 text-[10px] font-bold text-sky-700 dark:text-sky-300">Express +₹{s.pricing?.express}</span>}
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground font-medium">Duration: {s.duration}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
              <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }}
                className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-[32px] sm:rounded-[32px] bg-card border border-border shadow-2xl">
                <div className="flex items-center justify-between border-b border-border p-5 sticky top-0 bg-card z-10 text-foreground">
                  <h3 className="text-lg font-black uppercase tracking-tighter">{editId ? "Edit Service" : "Add Service"}</h3>
                  <button onClick={resetForm} className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-5">
                  <div className="text-left">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-muted-foreground">Work Photo</label>
                    <div className="group relative h-48 w-full overflow-hidden rounded-[24px] bg-muted/50 border-2 border-dashed border-border hover:border-primary/50 transition-all">
                      {form.image ? (
                        <>
                          <img src={form.image} alt="Work" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => setForm({ ...form, image: "" })} className="h-10 w-10 rounded-full bg-white text-rose-500 shadow-xl flex items-center justify-center">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2">
                          {uploading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : (
                            <>
                              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Plus className="h-6 w-6" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Upload Sample Work</span>
                            </>
                          )}
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="text-left">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-muted-foreground">Service Name *</label>
                    <div className="relative">
                      <select
                        value={form.name}
                        onChange={e => {
                          const selected = categoryServices.find(s => s.name === e.target.value);
                          setForm({
                            ...form,
                            name: e.target.value,
                            basic: selected ? selected.basePrice : form.basic
                          });
                        }}
                        className="w-full rounded-2xl border border-border bg-background p-4 text-xs font-bold focus:border-primary focus:outline-none appearance-none"
                      >
                        <option value="">Select a service...</option>
                        {categoryServices.map(s => (
                          <option key={s._id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="text-left">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-muted-foreground">Description</label>
                    <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full rounded-2xl border border-border bg-background p-4 text-xs font-bold focus:border-primary focus:outline-none" placeholder="Describe the service..." />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest mb-1.5 text-muted-foreground">Basic ₹</label>
                      <input type="number" min="1" value={form.basic} onChange={e => setForm({ ...form, basic: e.target.value })}
                        className="w-full rounded-2xl border border-border bg-background p-4 text-xs font-black focus:border-primary" placeholder="299" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest mb-1.5 text-muted-foreground">Standard ₹</label>
                      <input type="number" min="1" value={form.standard} onChange={e => setForm({ ...form, standard: e.target.value })}
                        className="w-full rounded-2xl border border-border bg-background p-4 text-xs font-black focus:border-primary" placeholder="499" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest mb-1.5 text-muted-foreground">Premium ₹</label>
                      <input type="number" min="1" value={form.premium} onChange={e => setForm({ ...form, premium: e.target.value })}
                        className="w-full rounded-2xl border border-border bg-background p-4 text-xs font-black focus:border-primary" placeholder="799" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest mb-1.5 text-sky-500">Express ₹</label>
                      <input type="number" min="0" value={form.express} onChange={e => setForm({ ...form, express: e.target.value })}
                        className="w-full rounded-2xl border border-sky-200 bg-sky-50/30 p-4 text-xs font-black focus:border-sky-500 text-sky-700" placeholder="150" />
                    </div>
                  </div>

                  <div className="text-left">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-muted-foreground">Duration</label>
                    <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                      className="w-full rounded-2xl border border-border bg-background p-4 text-xs font-bold focus:border-primary appearance-none">
                      {["15 min", "30 min", "45 min", "1 hr", "1.5 hrs", "2 hrs", "3 hrs", "4+ hrs"].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>

                  <motion.button whileTap={{ scale: 0.97 }} type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-[24px] bg-primary h-16 text-xs font-black uppercase tracking-[0.2em] text-primary-foreground shadow-2xl shadow-primary/30">
                    <Save className="h-4 w-4" /> {editId ? "Update" : "Add"} Service
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <ProviderBottomNav />
    </div>
  );
};

export default ProviderServices;
