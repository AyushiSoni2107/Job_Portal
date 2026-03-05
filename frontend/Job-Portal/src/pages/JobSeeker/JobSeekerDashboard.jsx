import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Bookmark, Briefcase, ChevronDown, Grid3X3, List, UserCircle2 } from "lucide-react";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import JobCard from "../../components/JobCard";
import FilterContent from "../../components/FilterContent";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import Header from "../LandingPage/components/Header";

const JobSeekerDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [jobView, setJobView] = useState("grid");
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
  const mobileProfileMenuRef = useRef(null);
  const defaultFilters = {
    keyword: "",
    location: "",
    category: "",
    type: "",
    minSalary: "",
    maxSalary: "",
  };
  const [filters, setFilters] = useState(defaultFilters);
  const jobTypeOptions = ["Remote", "Full-Time", "Part-Time", "Contract", "Internship"];
  const categoryOptions = [
    "Engineering",
    "Design",
    "Marketing",
    "Sales",
    "HR",
    "IT & Software",
    "Customer-service",
    "Product",
    "Operations",
    "Finance",
  ];

  const fetchJobs = async (activeFilters = defaultFilters) => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilters.keyword.trim()) params.keyword = activeFilters.keyword.trim();
      if (activeFilters.location.trim()) params.location = activeFilters.location.trim();
      if (activeFilters.category.trim()) params.category = activeFilters.category.trim();
      if (activeFilters.type.trim()) params.type = activeFilters.type.trim();
      if (activeFilters.minSalary) params.minSalary = Number(activeFilters.minSalary);
      if (activeFilters.maxSalary) params.maxSalary = Number(activeFilters.maxSalary);
      if (isAuthenticated && user?._id && user?.role === "jobseeker") params.userId = user._id;

      const res = await axiosInstance.get(API_PATHS.JOBS.GET_ALL_JOBS, { params });
      if (Array.isArray(res.data)) {
        setJobs(res.data);
      } else {
        setJobs([]);
        toast.error("Jobs API is not reachable. Check Vercel API deployment and VITE_API_BASE_URL.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [isAuthenticated, user?._id, user?.role]);

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

  const handleSearch = (event) => {
    event.preventDefault();
    fetchJobs(filters);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    fetchJobs(defaultFilters);
  };

  const handleToggleSave = async (job) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "jobseeker") {
      toast.error("Only job seekers can save jobs");
      return;
    }

    setSavingId(job._id);
    try {
      if (job.isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(job._id));
        toast.success("Removed from saved jobs");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(job._id));
        toast.success("Job saved successfully!");
      }
      fetchJobs(filters);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update saved jobs");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-white overflow-hidden"
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

      <div className="relative z-10 min-h-screen">
      <div className="hidden md:block">
        <Header hidePrimaryLinks />
      </div>
      <div className="hidden md:block h-16" />

      <header className="md:hidden h-16 px-4 border-b border-slate-200 bg-blue-50 flex items-center justify-between">
        <div className="min-w-0 flex items-center gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="bg-linear-to-r from-blue-500 to-purple-500 rounded-lg w-9 h-9 flex items-center justify-center text-blue-50">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-800 leading-none">DevHire</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/saved-jobs")}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-blue-200 bg-white hover:bg-blue-50 transition-colors"
            aria-label="Saved jobs"
            title="Saved jobs"
          >
            <Bookmark className="w-4 h-4 text-blue-600" />
          </button>

          <div className="relative" ref={mobileProfileMenuRef}>
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
                  alt={user.name || "Job Seeker"}
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
                    navigate("/profile");
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
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <FilterContent
          filters={filters}
          onChange={handleFilterChange}
          onApply={handleSearch}
          loading={loading}
        />
        <section className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          <aside className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-slate-900">Filter Jobs</h3>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Clear All
              </button>
            </div>

            <div className="mt-6">
              <p className="text-lg font-semibold text-slate-900 mb-3">Job Type</p>
              <div className="space-y-3">
                {jobTypeOptions.map((typeOption) => (
                  <label key={typeOption} className="flex items-center gap-2 text-base text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.type === typeOption}
                      onChange={() =>
                        handleFilterChange("type", filters.type === typeOption ? "" : typeOption)
                      }
                      className="w-4 h-4 rounded border-slate-300"
                    />
                    {typeOption}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-lg font-semibold text-slate-900 mb-3">Salary Range</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={filters.minSalary}
                  onChange={(event) => handleFilterChange("minSalary", event.target.value)}
                  placeholder="Min Salary"
                  className="w-full border border-slate-300 rounded-xl px-3 h-11 text-sm placeholder:text-sm"
                />
                <input
                  type="number"
                  value={filters.maxSalary}
                  onChange={(event) => handleFilterChange("maxSalary", event.target.value)}
                  placeholder="Max Salary"
                  className="w-full border border-slate-300 rounded-xl px-3 h-11 text-sm placeholder:text-sm"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-lg font-semibold text-slate-900 mb-3">Category</p>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {categoryOptions.map((categoryOption) => (
                  <label key={categoryOption} className="flex items-center gap-2 text-base text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.category === categoryOption}
                      onChange={() =>
                        handleFilterChange(
                          "category",
                          filters.category === categoryOption ? "" : categoryOption,
                        )
                      }
                      className="w-4 h-4 rounded border-slate-300"
                    />
                    {categoryOption}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-700 text-lg">
                Showing <span className="font-semibold text-slate-900">{jobs.length}</span> jobs
              </p>
              <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setJobView("grid")}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    jobView === "grid" ? "bg-blue-600 text-white" : "text-slate-500"
                  }`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setJobView("list")}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    jobView === "list" ? "bg-blue-600 text-white" : "text-slate-500"
                  }`}
                  aria-label="List view"
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">
                No jobs found.
              </div>
            ) : (
              <div className={jobView === "grid" ? "grid grid-cols-1 xl:grid-cols-2 gap-4" : "space-y-4"}>
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    showSaveControl
                    isSaved={Boolean(job.isSaved)}
                    disableSave={savingId === job._id}
                    onToggleSave={handleToggleSave}
                    variant={jobView === "grid" ? "compact" : "default"}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
