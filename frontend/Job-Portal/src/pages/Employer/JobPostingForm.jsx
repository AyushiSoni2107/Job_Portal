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
  ChevronDown,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import JobPostingPreview from "./JobPostingPreview";
import { useAuth } from "../../context/AuthContext";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import DevHireBrand from "../../components/DevHireBrand";

const defaultFormData = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  category: [],
  type: "Full-Time",
  salaryType: "Yearly",
  currency: "INR",
  salaryMin: "",
  salaryMax: "",
};

const CATEGORY_OPTIONS = [
  "IT & Software",
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Customer-service",
  "HR",
  "Finance",
  "Operations",
];

const JobPostingForm = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
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

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addCategory = () => {
    if (!selectedCategory) return;
    setFormData((prev) => {
      const current = Array.isArray(prev.category) ? prev.category : [];
      if (current.includes(selectedCategory)) return prev;
      return { ...prev, category: [...current, selectedCategory] };
    });
  };

  const removeCategory = (categoryToRemove) => {
    setFormData((prev) => ({
      ...prev,
      category: (prev.category || []).filter((item) => item !== categoryToRemove),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title || !formData.description || !formData.requirements || !formData.type) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.JOBS.POST_JOB, {
        ...formData,
        salaryMin: Number(formData.salaryMin || 0),
        salaryMax: Number(formData.salaryMax || 0),
      });
      toast.success("Job posted successfully");
      setFormData(defaultFormData);
      navigate("/employer-dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

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
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-600 text-white border-r-4 border-blue-700 text-sm font-medium"
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
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 text-sm"
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
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium"
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
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 text-sm"
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

              <h1 className="hidden lg:block text-lg md:text-xl leading-tight font-bold">Post New Job</h1>
              <p className="hidden lg:block text-xs md:text-sm text-slate-500 mt-1">Publish your job and preview it live.</p>
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
                        navigate("/company-profile");
                        setIsMobileProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      View Profile
                    </button>
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
                        navigate("/company-profile");
                        setIsDesktopProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      View Profile
                    </button>
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

          <section className="p-4 md:p-5">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Job Title *</label>
                  <input
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                    placeholder="Senior Frontend Developer"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 min-h-28"
                    placeholder="Describe role, goals, and responsibilities"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Requirements *</label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => updateField("requirements", e.target.value)}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 min-h-24"
                    placeholder="Skills and minimum experience"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Location</label>
                    <input
                      value={formData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Categories</label>
                    <div className="mt-1 flex gap-2">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      >
                        {CATEGORY_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addCategory}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-100"
                      >
                        Add
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {(formData.category || []).length === 0 ? (
                        <span className="text-xs text-slate-500">No category selected</span>
                      ) : (
                        formData.category.map((category) => (
                          <span
                            key={category}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                          >
                            {category}
                            <button
                              type="button"
                              onClick={() => removeCategory(category)}
                              className="text-blue-700/80 hover:text-blue-900"
                            >
                              x
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Job Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => updateField("type", e.target.value)}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                    >
                      <option>Remote</option>
                      <option>Full-Time</option>
                      <option>Part-Time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Salary Type</label>
                    <select
                      value={formData.salaryType}
                      onChange={(e) => updateField("salaryType", e.target.value)}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                    >
                      <option>Hourly</option>
                      <option>Monthly</option>
                      <option>Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Salary Min</label>
                    <input
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => updateField("salaryMin", e.target.value)}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Salary Max</label>
                    <input
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => updateField("salaryMax", e.target.value)}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => updateField("currency", e.target.value)}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Posting..." : "Post Job"}
                </button>
              </form>

              <JobPostingPreview values={formData} />
            </div>
          </section>
        </main>
      </div>
      </div>
    </div>
  );
};

export default JobPostingForm;

