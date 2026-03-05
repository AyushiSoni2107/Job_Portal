import { useEffect, useRef, useState } from "react";
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
  ChevronDown,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import DevHireBrand from "../../components/DevHireBrand";

const EmployerProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
  const [isDesktopProfileMenuOpen, setIsDesktopProfileMenuOpen] = useState(false);
  const mobileProfileMenuRef = useRef(null);
  const desktopProfileMenuRef = useRef(null);

  useEffect(() => {
    if (!isMobileProfileMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!mobileProfileMenuRef.current?.contains(event.target)) {
        setIsMobileProfileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileProfileMenuOpen]);

  useEffect(() => {
    if (!isDesktopProfileMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!desktopProfileMenuRef.current?.contains(event.target)) {
        setIsDesktopProfileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsDesktopProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDesktopProfileMenuOpen]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty("--x", `${x}%`);
        e.currentTarget.style.setProperty("--y", `${y}%`);
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(800px circle at var(--x, 100%) var(--y, 100%), rgba(99,102,241,0.16), transparent 60%)",
        }}
      />

      <div className="relative z-10 min-h-screen text-slate-900 m-0 p-0">
      <div className="w-full min-h-screen lg:grid lg:grid-cols-[220px_1fr] m-0 p-0">
        <aside className="hidden lg:flex flex-col border-r border-slate-200 bg-blue-50 min-h-screen">
          <div className="h-16 px-4 flex items-center border-b border-slate-200">
            <Link to="/" className="flex items-center">
              <DevHireBrand
                textClassName="text-2xl font-bold text-gray-800 leading-none"
                iconWrapperClassName="w-10 h-10 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-blue-50"
                iconClassName="w-6 h-6"
              />
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

        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute inset-0 bg-black/40"
              aria-label="Close menu"
            />
            <div className="relative w-72 h-full bg-blue-50 border-r border-slate-200 p-3">
              <div className="h-14 px-1 flex items-center justify-between border-b border-slate-200">
                <Link
                  to="/"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center"
                >
                  <DevHireBrand />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="px-1 pt-4 space-y-1.5">
                <Link
                  to="/employer-dashboard"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/post-job"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Post Job
                </Link>
                <Link
                  to="/manage-jobs"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 text-sm"
                >
                  <ClipboardList className="w-4 h-4" />
                  Manage Jobs
                </Link>
                <Link
                  to="/company-profile"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium"
                >
                  <Building2 className="w-4 h-4" />
                  Company Profile
                </Link>
              </nav>
            </div>
          </div>
        )}

        <main className="min-w-0">
          <header className="h-16 px-4 md:px-5 border-b border-slate-200 bg-blue-50 flex items-center justify-between">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden inline-flex items-center"
                aria-label="Open menu"
              >
                <DevHireBrand />
              </button>

              <div className="hidden lg:block">
                <h1 className="text-lg md:text-xl leading-tight font-bold">Company Profile</h1>
                <p className="text-xs md:text-sm text-slate-500 mt-1">
                  View and manage your employer and company details
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative md:hidden" ref={mobileProfileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsMobileProfileMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={isMobileProfileMenuOpen}
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
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isMobileProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMobileProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg p-1 z-50">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsMobileProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <div className="hidden md:block relative" ref={desktopProfileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsDesktopProfileMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={isDesktopProfileMenuOpen}
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
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800 leading-none">
                      {user?.name || "Employer"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Employer Profile</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isDesktopProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDesktopProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg p-1 z-50">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsDesktopProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <section className="p-4 md:p-5 flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 flex items-center justify-center">
                  <h2 className="text-xl font-semibold text-white text-center">Employer Profile</h2>
                  <Link
                    to="/company-profile/edit"
                    className="hidden md:inline-flex absolute right-5 items-center gap-2 px-3 py-2 rounded-lg bg-white/20 text-white text-sm hover:bg-white/30"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Profile
                  </Link>
                  <Link
                    to="/company-profile/edit"
                    className="md:hidden absolute right-3 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/20 text-white hover:bg-white/30"
                    aria-label="Edit profile"
                    title="Edit profile"
                  >
                    <Pencil className="w-4 h-4" />
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
    </div>
  );
};

export default EmployerProfilePage;

