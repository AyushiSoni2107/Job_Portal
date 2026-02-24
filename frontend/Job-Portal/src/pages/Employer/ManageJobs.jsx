import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ClipboardList, Users, Building2 } from "lucide-react";
import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

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

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete "${job.title}"?`)) return;
    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(job._id));
      toast.success("Job deleted");
      fetchJobs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete job");
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
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">Manage Jobs Page</h1>
          <p className="text-sm text-slate-500">Edit, close, reopen, or delete posted jobs.</p>
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
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Building2 className="w-4 h-4" />
              Employer Profile
            </Link>
          </nav>
        </aside>

        <main>
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5">No jobs posted yet.</div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{job.description}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        job.isClosed ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {job.isClosed ? "Closed" : "Open"}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mt-3">
                    {job.type} | {job.location || "N/A"} | {(job.currency || "INR")} {job.salaryMin || 0} - {job.salaryMax || 0} | Applicants: {job.applicationCount || 0}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setEditingJob(job)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleClose(job)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                    >
                      {job.isClosed ? "Reopen" : "Close"}
                    </button>
                    <button
                      onClick={() => handleDelete(job)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                value={editingJob.category || ""}
                onChange={(e) => setEditingJob((prev) => ({ ...prev, category: e.target.value }))}
                className="border border-slate-300 rounded-lg px-3 py-2"
                placeholder="Category"
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
    </div>
  );
};

export default ManageJobs;
