import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopNav from "./AdminTopNav";
import AdminMobileNav from "./AdminMobileNav";
import { useAuth } from "@/context/AuthContext";

const AdminLayout = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Dashboard");

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      navigate("/admin/login");
    }
    // Force light mode for admin module
    document.documentElement.classList.remove("dark");
  }, [navigate, user, role, loading]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans light selection:bg-emerald-200">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopNav title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet context={{ setTitle }} />
        </main>
        <AdminMobileNav />
      </div>
    </div>
  );
};

export default AdminLayout;
