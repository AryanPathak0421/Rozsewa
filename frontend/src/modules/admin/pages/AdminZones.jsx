import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { MapPin, Plus, Move, X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const AdminZones = () => {
    const { setTitle } = useOutletContext();
    const { toast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [zones, setZones] = useState([
        { id: "ZONE-1", name: "South Delhi Hub", type: "Tier 1 Metro", activeP: 145 },
        { id: "ZONE-2", name: "Noida CBD", type: "Tier 1 Metro", activeP: 89 },
        { id: "ZONE-3", name: "Gurugram Cyber City", type: "Tier 1 Premium", activeP: 210 },
    ]);
    const [newZone, setNewZone] = useState({ name: "", type: "Tier 1 Metro" });

    useEffect(() => {
        setTitle("Zones & Cities");
    }, [setTitle]);

    const handleAddZone = (e) => {
        e.preventDefault();
        if (!newZone.name) {
            toast({ title: "Name is required", variant: "destructive" });
            return;
        }
        const zone = {
            id: `ZONE-${Date.now().toString(36)}`,
            ...newZone,
            activeP: 0
        };
        setZones([zone, ...zones]);
        setShowModal(false);
        setNewZone({ name: "", type: "Tier 1 Metro" });
        toast({ title: "Zone Added", description: `${newZone.name} is now operational.` });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-foreground text-gray-900">City & Zone Management</h1>
                    <p className="text-sm text-muted-foreground mt-1 text-gray-500">Configure operational perimeters and geo-fenced boundaries.</p>
                </div>
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-emerald-700 transition"
                >
                    <Plus className="h-4 w-4"/> Add New Zone
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-border bg-white shadow-sm p-6 flex flex-col items-center justify-center text-center h-64 relative overflow-hidden group border-dashed border-gray-200">
                    <div className="absolute inset-0 bg-emerald-50/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="font-bold text-emerald-700 bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2"><Move className="h-4 w-4"/> Click to Map Geofence</span>
                    </div>
                    <MapPin className="h-10 w-10 text-emerald-200 mb-3" />
                    <h3 className="font-black text-lg text-gray-600">Visual Map Disabled</h3>
                    <p className="text-xs text-gray-400 w-2/3">Map rendering layer will load the existing operational zones bounding boxes here.</p>
                </div>

                <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden border-gray-200">
                    <div className="px-6 py-4 border-b border-border bg-gray-50/50 border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Active Service Zones</h3>
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{zones.length} TOTAL</span>
                    </div>
                    <div className="divide-y divide-border border-gray-100">
                        {zones.map((zone) => (
                            <div key={zone.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">{zone.name}</h4>
                                        <p className="text-xs text-emerald-600 font-bold">{zone.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-900">{zone.activeP}</p>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Providers</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-gray-900">Add Service Zone</h3>
                                <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                            <form onSubmit={handleAddZone} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Zone Name</label>
                                    <input 
                                        type="text" 
                                        value={newZone.name}
                                        onChange={e => setNewZone({...newZone, name: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition font-bold"
                                        placeholder="e.g. West Mumbai"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Market Type</label>
                                    <select 
                                        value={newZone.type}
                                        onChange={e => setNewZone({...newZone, type: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition font-bold appearance-none"
                                    >
                                        <option>Tier 1 Metro</option>
                                        <option>Tier 1 Premium</option>
                                        <option>Tier 2 City</option>
                                        <option>New Market</option>
                                    </select>
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-black transition flex items-center justify-center gap-2 mt-4"
                                >
                                    <Save className="h-4 w-4" /> Save Zone
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminZones;
