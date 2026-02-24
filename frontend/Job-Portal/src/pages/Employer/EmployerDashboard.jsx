import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ClipboardList, Users, Building2, LogOut } from "lucide-react";
import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";

const StatCard = ({ label, value, accent }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
  </div>
);

const EmployerDashboard = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);
        setJobs(res.data || []);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const openJobs = jobs.filter((job) => !job.isClosed).length;
    const closedJobs = jobs.filter((job) => job.isClosed).length;
    const totalApplications = jobs.reduce(
      (sum, job) => sum + (job.applicationCount || 0),
      0
    );
    return { totalJobs, openJobs, closedJobs, totalApplications };
  }, [jobs]);

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Employer Dashboard Page</h1>
            <p className="text-sm text-slate-500">Welcome back, {user?.name || "Employer"}.</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <aside className="bg-white border border-slate-200 rounded-xl p-3 h-fit">
          <nav className="space-y-1">
            <Link
              to="/employer-dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700"
            >
              <Briefcase className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/post-job"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <ClipboardList className="w-4 h-4" />
              Create Job Posting Form
            </Link>
            <Link
              to="/applicants"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Users className="w-4 h-4" />
              View Applications Page
            </Link>
            <Link
              to="/company-profile"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Building2 className="w-4 h-4" />
              Employer Profile Details
            </Link>
          </nav>
        </aside>

        <main>
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5">Loading dashboard...</div>
          ) : (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Total Jobs" value={stats.totalJobs} accent="text-slate-900" />
                <StatCard label="Open Jobs" value={stats.openJobs} accent="text-emerald-600" />
                <StatCard label="Closed Jobs" value={stats.closedJobs} accent="text-amber-600" />
                <StatCard
                  label="Total Applications"
                  value={stats.totalApplications}
                  accent="text-blue-600"
                />
              </section>

              <section className="bg-white border border-slate-200 rounded-xl p-5 mt-6">
                <h2 className="font-semibold text-slate-900">Quick Actions</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to="/post-job" className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm">
                    Create Job Posting
                  </Link>
                  <Link to="/manage-jobs" className="border border-slate-300 px-3 py-2 rounded-lg text-sm">
                    Manage Jobs Page
                  </Link>
                  <Link to="/applicants" className="border border-slate-300 px-3 py-2 rounded-lg text-sm">
                    View Applications
                  </Link>
                </div>
              </section>

              <section className="bg-white border border-slate-200 rounded-xl p-5 mt-6">
                <h2 className="font-semibold text-slate-900">Recent Jobs</h2>
                {jobs.length === 0 ? (
                  <p className="text-sm text-slate-600 mt-2">No jobs posted yet.</p>
                ) : (
                  <div className="space-y-3 mt-3">
                    {jobs.slice(0, 4).map((job) => (
                      <div key={job._id} className="border border-slate-200 rounded-lg p-3">
                        <p className="font-medium text-slate-900">{job.title}</p>
                        <p className="text-sm text-slate-600 mt-1">
                          {job.type} | {job.location || "N/A"} | {job.applicationCount || 0} applicants
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployerDashboard;
