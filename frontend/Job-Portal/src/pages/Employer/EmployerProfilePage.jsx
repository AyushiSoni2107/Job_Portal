import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  ClipboardList,
  Building2,
  LogOut,
  LayoutDashboard,
  Plus,
  UserCircle2,
  Mail,
  Pencil,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const EmployerProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f2f4f7] text-slate-900 m-0 p-0">
      <div className="w-full min-h-screen lg:grid lg:grid-cols-[220px_1fr] m-0 p-0">
        <aside className="hidden lg:flex flex-col border-r border-slate-200 bg-blue-50 min-h-screen">
          <div className="h-16 px-4 flex items-center border-b border-slate-200">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-linear-to-r from-blue-500 to-purple-500 rounded-lg w-10 h-10 flex items-center justify-center text-blue-50">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-800 leading-none">DevHire</span>
            </Link>
          </div>

          <nav className="px-3 pt-4 space-y-1.5">
            <Link
              to="/employer-dashboard"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/post-job"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 text-sm"
            >
              <Plus className="w-4 h-4" />
              Post Job
            </Link>
            <Link
              to="/manage-jobs"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 text-sm"
            >
              <ClipboardList className="w-4 h-4" />
              Manage Jobs
            </Link>
            <Link
              to="/company-profile"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-600 text-white border-r-4 border-blue-700 text-sm font-medium"
            >
              <Building2 className="w-4 h-4" />
              Company Profile
            </Link>
          </nav>

          <div className="mt-auto p-3 border-t border-slate-200">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="h-16 px-4 md:px-5 border-b border-slate-200 bg-blue-50 flex items-center justify-between">
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl leading-tight font-bold">Company Profile</h1>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                View and manage your employer and company details
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/company-profile")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 transition-colors"
              >
                {user?.avatar ? (
                  <img
                    src={resolveMediaUrl(user.avatar)}
                    alt={user.name || "Employer"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="w-8 h-8 text-blue-600" />
                )}
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800 leading-none">
                    {user?.name || "Employer"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Employer Profile</p>
                </div>
              </button>

              <button
                onClick={logout}
                className="px-3 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          </header>

          <section className="p-4 md:p-5 flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 flex items-center justify-center">
                  <h2 className="text-xl font-semibold text-white text-center">Employer Profile</h2>
                  <Link
                    to="/company-profile/edit"
                    className="absolute right-5 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 text-white text-sm hover:bg-white/30"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Profile
                  </Link>
                </div>

                <div className="p-4 md:p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 pb-3 border-b border-slate-200">
                        Personal Information
                      </h3>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                          {user?.avatar ? (
                            <img
                              src={resolveMediaUrl(user.avatar)}
                              alt={user.name || "Employer"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserCircle2 className="w-10 h-10 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-slate-900">{user?.name || "Employer Name"}</p>
                          <p className="text-sm text-slate-600 mt-1 inline-flex items-center gap-1.5">
                            <Mail className="w-4 h-4" />
                            {user?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 pb-3 border-b border-slate-200">
                        Company Information
                      </h3>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                          {user?.companyLogo ? (
                            <img
                              src={resolveMediaUrl(user.companyLogo)}
                              alt={user.companyName || "Company Logo"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-8 h-8 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-slate-900">
                            {user?.companyName || "Company Name"}
                          </p>
                          <p className="text-sm text-slate-600 mt-1 inline-flex items-center gap-1.5">
                            <Building2 className="w-4 h-4" />
                            Company
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7">
                    <h3 className="text-xl font-semibold text-slate-900 pb-3 border-b border-slate-200">
                      About Company
                    </h3>
                    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <p className="text-slate-700 leading-relaxed">
                        {user?.companyDescription || "No company description added yet."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EmployerProfilePage;

