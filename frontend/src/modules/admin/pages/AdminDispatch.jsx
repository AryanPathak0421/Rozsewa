import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Zap, Clock, ArrowRight, User, MapPin } from "lucide-react";

const AdminDispatch = () => {
  const { setTitle } = useOutletContext();
  const jobs = [
    { id: "JOB-2019", customer: "Vivek K.", service: "AC Repair", area: "Noida Sec-62", status: "Unassigned", time: "10m ago" },
    { id: "JOB-2020", customer: "Deepa S.", service: "Deep Cleaning", area: "South Delhi", status: "Searching", time: "2m ago" }
  ];

  useEffect(() => {
    setTitle("Job Dispatching");
  }, [setTitle]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Job Dispatch Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor real-time job requests and assign to nearest providers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1"><Clock className="h-4 w-4" /> Live Queue</h3>
          {jobs.map(job => (
            <div key={job.id} className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                     <h4 className="font-bold text-gray-900">{job.service}</h4>
                     <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded uppercase">{job.id}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
                     <span className="flex items-center gap-1"><User className="h-3 w-3" /> {job.customer}</span>
                     <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.area}</span>
                     <span className="flex items-center gap-1 text-emerald-600"><Clock className="h-3 w-3" /> {job.time}</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition shadow-md active:scale-95 transition-all">
                 Dispatch <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-card p-6 h-fit shadow-sm text-center">
           <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-4">
              <MapPin className="h-8 w-8" />
           </div>
           <h3 className="font-bold text-gray-900">Map Dispatch Disabled</h3>
           <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
             Enable Google Maps API to view provider clusters and live traffic for manual routing and geo-dispatching.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDispatch;
