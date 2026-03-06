import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  ClipboardList,
  Building2,
  LogOut,
  LayoutDashboard,
  Plus,
  UserCircle2,
  Search,
  Users,
  Pencil,
  Trash2,
  X,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import ConfirmDialog from "../../components/ConfirmDialog";
import DevHireBrand from "../../components/DevHireBrand";

const ManageJobs = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteTargetJob, setDeleteTargetJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
  const [isDesktopProfileMenuOpen, setIsDesktopProfileMenuOpen] = useState(false);
  const mobileProfileMenuRef = useRef(null);
  const desktopProfileMenuRef = useRef(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);
      setJobs(res.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesQuery =
        !q ||
        (job.title || "").toLowerCase().includes(q) ||
        (job.location || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !job.isClosed) ||
        (statusFilter === "closed" && job.isClosed);

      return matchesQuery && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  const handleDelete = (job) => {
    setDeleteTargetJob(job);
  };

  const confirmDeleteJob = async () => {
    if (!deleteTargetJob?._id) return;
    setDeletingJob(true);
    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(deleteTargetJob._id));
      toast.success("Job deleted");
      setDeleteTargetJob(null);
      fetchJobs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete job");
    } finally {
      setDeletingJob(false);
    }
  };

  const handleToggleClose = async (job) => {
    try {
      await axiosInstance.put(API_PATHS.JOBS.TOGGLE_CLOSE(job._id));
      toast.success(job.isClosed ? "Job reopened" : "Job closed");
      fetchJobs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update job");
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingJob) return;
    try {
      await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(editingJob._id), {
        title: editingJob.title,
        description: editingJob.description,
        requirements: editingJob.requirements,
        location: editingJob.location,
        category: editingJob.category,
        type: editingJob.type,
        currency: editingJob.currency || "INR",
        salaryMin: Number(editingJob.salaryMin || 0),
        salaryMax: Number(editingJob.salaryMax || 0),
      });
      toast.success("Job updated");
      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update job");
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
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 text-sm"
            >
              <Plus className="w-4 h-4" />
              Post Job
            </Link>
            <Link
              to="/manage-jobs"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-600 text-white border-r-4 border-blue-700 text-sm font-medium"
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
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Post Job
                </Link>
                <Link
                  to="/manage-jobs"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium"
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

              <h1 className="hidden lg:block text-lg md:text-xl leading-tight font-bold">Job Management</h1>
              <p className="hidden lg:block text-xs md:text-sm text-slate-500 mt-1">
                Manage your job postings and track applications
              </p>
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
            <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-[220px]">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search jobs..."
                      className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm min-w-[140px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>

                <button
                  onClick={() => navigate("/post-job")}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add New Job
                </button>
              </div>

              <p className="text-sm text-slate-500 mt-4">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>

              <div className="mt-4 overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full min-w-[760px]">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="text-left px-4 py-3">Job Title</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3">Applicants</th>
                      <th className="text-left px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-sm text-slate-500">
                          Loading jobs...
                        </td>
                      </tr>
                    ) : filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-sm text-slate-500">
                          No jobs found.
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((job) => (
                        <tr key={job._id} className="text-sm">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-900">{job.title}</p>
                            <p className="text-slate-500 text-xs mt-0.5">
                              {job.company?.name || user?.name || "Employer"}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full ${
                                job.isClosed
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {job.isClosed ? "Closed" : "Active"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-blue-600 font-medium">
                            <button
                              type="button"
                              onClick={() => navigate(`/applicants?jobId=${job._id}`)}
                              className="inline-flex items-center gap-1.5 hover:text-blue-800 hover:underline"
                            >
                              <Users className="w-4 h-4" />
                              {job.applicationCount || 0}
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className="inline-flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setEditingJob(job)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleClose(job)}
                                className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900"
                                title={job.isClosed ? "Reopen" : "Close"}
                              >
                                <X className="w-4 h-4" />
                                <span className="text-xs">{job.isClosed ? "Reopen" : "Close"}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(job)}
                                className="text-rose-600 hover:text-rose-800"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>

      {editingJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-20">
          <form onSubmit={handleUpdate} className="bg-white rounded-xl p-5 w-full max-w-2xl space-y-3">
            <h3 className="font-semibold text-slate-900">Edit Job</h3>
            <input
              value={editingJob.title}
              onChange={(e) => setEditingJob((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Job title"
            />
            <textarea
              value={editingJob.description}
              onChange={(e) => setEditingJob((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 min-h-24"
              placeholder="Description"
            />
            <textarea
              value={editingJob.requirements}
              onChange={(e) => setEditingJob((prev) => ({ ...prev, requirements: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 min-h-20"
              placeholder="Requirements"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={editingJob.location || ""}
                onChange={(e) => setEditingJob((prev) => ({ ...prev, location: e.target.value }))}
                className="border border-slate-300 rounded-lg px-3 py-2"
                placeholder="Location"
              />
              <input
                value={Array.isArray(editingJob.category) ? editingJob.category.join(", ") : (editingJob.category || "")}
                onChange={(e) => setEditingJob((prev) => ({ ...prev, category: e.target.value }))}
                className="border border-slate-300 rounded-lg px-3 py-2"
                placeholder="Categories (comma separated)"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <select
                value={editingJob.type}
                onChange={(e) => setEditingJob((prev) => ({ ...prev, type: e.target.value }))}
                className="border border-slate-300 rounded-lg px-3 py-2"
              >
                <option>Remote</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
              <select
                value={editingJob.currency || "INR"}
                onChange={(e) => setEditingJob((prev) => ({ ...prev, currency: e.target.value }))}
                className="border border-slate-300 rounded-lg px-3 py-2"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="AED">AED</option>
              </select>
              <input
                type="number"
                value={editingJob.salaryMin || 0}
                onChange={(e) => setEditingJob((prev) => ({ ...prev, salaryMin: e.target.value }))}
                className="border border-slate-300 rounded-lg px-3 py-2"
                placeholder="Salary Min"
              />
              <input
                type="number"
                value={editingJob.salaryMax || 0}
                onChange={(e) => setEditingJob((prev) => ({ ...prev, salaryMax: e.target.value }))}
                className="border border-slate-300 rounded-lg px-3 py-2"
                placeholder="Salary Max"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="px-3 py-2 rounded-lg border border-slate-300"
              >
                Cancel
              </button>
              <button type="submit" className="px-3 py-2 rounded-lg bg-blue-600 text-white">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTargetJob)}
        title="Delete this job posting?"
        message={`This will permanently remove "${deleteTargetJob?.title || "this job"}" and cannot be undone.`}
        confirmText="Yes, Delete Job"
        cancelText="Cancel"
        loading={deletingJob}
        confirmTone="danger"
        onConfirm={confirmDeleteJob}
        onClose={() => setDeleteTargetJob(null)}
      />
      </div>
    </div>
  );
};

export default ManageJobs;

