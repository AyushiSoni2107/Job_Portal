import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  ClipboardList,
  Users,
  Building2,
  LogOut,
  LayoutDashboard,
  Plus,
  Settings,
  CheckCircle2,
  Clock3,
  UserCircle2,
  ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const StatCard = ({ label, value, icon, classes }) => (
  <div className={`rounded-2xl p-4 text-white relative overflow-hidden w-[410px] h-[150px] sm:w-[410px] sm:h-[150px] ${classes}`}>
    <div className="absolute -right-2 -top-2 w-20 h-20 rounded-2xl bg-white/15" />
    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-sm md:text-base font-medium text-white/95">{label}</p>
        <p className="text-3xl font-bold mt-2 leading-none">{value}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/95">
          <ArrowUpRight className="w-4 h-4" />
          100%
        </p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
        {icon}
      </div>
    </div>
  </div>
);

const formatDate = (isoDate) => {
  if (!isoDate) return "N/A";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getRelativeDays = (isoDate) => {
  if (!isoDate) return "Recently";
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  const days = Math.max(0, Math.floor((now - then) / (1000 * 60 * 60 * 24)));
  return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
};

const EmployerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);
        const employerJobs = res.data || [];
        setJobs(employerJobs);

        if (employerJobs.length > 0) {
          const appRequests = employerJobs.slice(0, 8).map((job) =>
            axiosInstance.get(API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(job._id))
          );

          const appResponses = await Promise.allSettled(appRequests);
          const allApplications = appResponses
            .filter((result) => result.status === "fulfilled")
            .flatMap((result) => result.value?.data || [])
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 3);

          setRecentApplications(allApplications);
        } else {
          setRecentApplications([]);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const activeJobs = jobs.filter((job) => !job.isClosed).length;
    const totalApplications = jobs.reduce(
      (sum, job) => sum + (job.applicationCount || 0),
      0
    );
    const hired =
      recentApplications.filter(
        (application) => application?.status?.toLowerCase() === "accepted"
      ).length || 0;

    return { activeJobs, totalApplications, hired };
  }, [jobs, recentApplications]);

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
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-600 text-white border-r-4 border-blue-700 text-sm font-medium"
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

        <main className="min-w-0">
          <header className="h-16 px-4 md:px-5 border-b border-slate-200 bg-blue-50 flex items-center justify-between">
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl leading-tight font-bold">Welcome back!</h1>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                Here's what's happening with your jobs today.
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

          <section className="p-4 md:p-5 space-y-4">
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-4">Loading dashboard...</div>
          ) : (
            <>
              <section className="flex flex-wrap gap-3 justify-center">
                <StatCard
                  label="Active Jobs"
                  value={stats.activeJobs}
                  icon={<Briefcase className="w-6 h-6" />}
                  classes="bg-gradient-to-r from-blue-600 to-blue-500"
                />
                <StatCard
                  label="Total Applications"
                  value={stats.totalApplications}
                  icon={<Users className="w-6 h-6" />}
                  classes="bg-gradient-to-r from-emerald-500 to-emerald-600"
                />
                <StatCard
                  label="Hired"
                  value={stats.hired}
                  icon={<CheckCircle2 className="w-6 h-6" />}
                  classes="bg-gradient-to-r from-violet-500 to-violet-600"
                />
              </section>

              <section className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Recent Job Posts</h2>
                      <p className="text-sm text-slate-500 mt-1">Your latest job postings</p>
                    </div>
                    <Link to="/manage-jobs" className="text-blue-600 text-sm font-semibold hover:underline">
                      View all
                    </Link>
                  </div>

                  <div className="mt-4 space-y-3">
                    {jobs.length === 0 ? (
                      <div className="border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
                        No jobs posted yet.
                      </div>
                    ) : (
                      jobs.slice(0, 3).map((job) => (
                        <div key={job._id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-base leading-tight font-semibold text-slate-900">
                                {job.title}
                              </p>
                              <p className="text-sm text-slate-500 mt-1">
                                {job.location || "N/A"} | {formatDate(job.createdAt)}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                            {job.isClosed ? "Closed" : "Active"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Recent Applications</h2>
                      <p className="text-sm text-slate-500 mt-1">Latest candidate applications</p>
                    </div>
                    <Link to="/applicants" className="text-blue-600 text-sm font-semibold hover:underline">
                      View all
                    </Link>
                  </div>

                  <div className="mt-4 space-y-3">
                    {recentApplications.length === 0 ? (
                      <div className="border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
                        No applications yet.
                      </div>
                    ) : (
                      recentApplications.map((application) => {
                        const applicantName = application?.applicant?.name || "Applicant";
                        const initials = applicantName
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0]?.toUpperCase())
                          .join("");

                        return (
                          <div key={application._id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {application?.applicant?.avatar ? (
                                <img
                                  src={resolveMediaUrl(application.applicant.avatar)}
                                  alt={applicantName}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
                                  {initials || "NA"}
                                </div>
                              )}
                              <div>
                                <p className="text-base leading-tight font-semibold text-slate-900">
                                  {applicantName}
                                </p>
                                <p className="text-sm text-slate-500 mt-1">
                                  {application?.job?.title || "Applied Job"}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 inline-flex items-center gap-1.5">
                              <Clock3 className="w-4 h-4" />
                              {getRelativeDays(application?.createdAt)}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </section>

              <section className="bg-white border border-slate-200 rounded-2xl p-4">
                <div>
                  <h2 className="text-xl font-bold">Quick Actions</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Common tasks to get you started
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Link
                    to="/post-job"
                    className="border border-slate-200 rounded-xl px-3 py-3 hover:bg-slate-50 transition-colors flex items-center gap-2.5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-800">Post New Job</span>
                  </Link>

                  <Link
                    to="/applicants"
                    className="border border-slate-200 rounded-xl px-3 py-3 hover:bg-slate-50 transition-colors flex items-center gap-2.5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-800">Review Applications</span>
                  </Link>

                  <Link
                    to="/company-profile"
                    className="border border-slate-200 rounded-xl px-3 py-3 hover:bg-slate-50 transition-colors flex items-center gap-2.5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Settings className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-800">Company Settings</span>
                  </Link>
                </div>
              </section>
            </>
          )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default EmployerDashboard;

