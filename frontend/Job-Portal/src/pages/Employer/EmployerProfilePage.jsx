import { Link } from "react-router-dom";
import { Briefcase, ClipboardList, Users, Building2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const EmployerProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">Employer Profile Details Page</h1>
          <p className="text-sm text-slate-500">Company details shown to candidates.</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <aside className="bg-white border border-slate-200 rounded-xl p-3 h-fit">
          <nav className="space-y-1">
            <Link
              to="/employer-dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Briefcase className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/post-job"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <ClipboardList className="w-4 h-4" />
              Create Job Posting
            </Link>
            <Link
              to="/applicants"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Users className="w-4 h-4" />
              View Applications
            </Link>
            <Link
              to="/company-profile"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700"
            >
              <Building2 className="w-4 h-4" />
              Employer Profile Details
            </Link>
          </nav>
        </aside>

        <main className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
              {user?.companyLogo ? (
                <img src={resolveMediaUrl(user.companyLogo)} alt="Company logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">{user?.companyName || "Company Name"}</h2>
              <p className="text-slate-600">Managed by {user?.name || "Employer"}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-slate-900">About Company</h3>
            <p className="text-slate-700 mt-2 whitespace-pre-wrap">
              {user?.companyDescription || "No company description added yet."}
            </p>
          </div>

          <div className="mt-6">
            <Link to="/company-profile/edit" className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block">
              Edit Employer Profile Page
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployerProfilePage;
