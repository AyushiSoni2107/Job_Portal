import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapPin, Briefcase, Building2, Calendar, CircleDollarSign } from "lucide-react";
import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const formatSalary = (amount, currency = "INR") => {
  const value = Number(amount || 0);
  if (!Number.isFinite(value) || value <= 0) return "0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const params = {};
      if (isAuthenticated && user?._id) {
        params.userId = user._id;
      }

      const res = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(id), { params });
      setJob(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id, isAuthenticated, user?._id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "jobseeker") {
      toast.error("Only job seekers can apply");
      return;
    }

    setApplying(true);
    try {
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(id));
      toast.success("Application submitted");
      setJob((prev) => (prev ? { ...prev, applicationStatus: "Applied" } : prev));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
          <p className="text-slate-700">Job not found.</p>
          <Link to="/find-jobs" className="inline-block mt-3 text-blue-600 hover:underline">
            Back to Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  const alreadyApplied = Boolean(job.applicationStatus);

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link to="/find-jobs" className="text-sm text-blue-600 hover:underline">
            Back to Browse Jobs
          </Link>
          <div className="mt-3 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
              {job.company?.companyLogo ? (
                <img
                  src={resolveMediaUrl(job.company.companyLogo)}
                  alt={job.company?.companyName || job.company?.name || "Company logo"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
              <p className="text-slate-600 mt-1">
                {job.company?.companyName || job.company?.name || "Company"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-5">
            <span className="inline-flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {job.company?.companyName || job.company?.name || "Company"}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location || "N/A"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {job.type}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Posted: {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">Job Description</h2>
            <p className="text-slate-700 mt-2 whitespace-pre-wrap">{job.description}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-slate-900">Requirements</h2>
            <p className="text-slate-700 mt-2 whitespace-pre-wrap">{job.requirements}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-slate-900">Category</h2>
            <p className="text-slate-700 mt-2">{job.category || "General"}</p>
          </div>
        </section>

        <aside className="bg-white border border-slate-200 rounded-xl p-5 h-fit">
          <h3 className="font-semibold text-slate-900">Compensation</h3>
          <p className="text-slate-700 mt-2 inline-flex items-center gap-1">
            <CircleDollarSign className="w-4 h-4" />
            {formatSalary(job.salaryMin, job.currency)} - {formatSalary(job.salaryMax, job.currency)} ({job.currency || "INR"})
          </p>

          <div className="mt-5">
            {alreadyApplied ? (
              <button
                disabled
                className="w-full px-4 py-2.5 rounded-lg bg-emerald-100 text-emerald-700 cursor-not-allowed"
              >
                Already Applied ({job.applicationStatus})
              </button>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying || job.isClosed}
                className="w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {job.isClosed ? "Job Closed" : applying ? "Applying..." : "Apply Now"}
              </button>
            )}
          </div>

          {!isAuthenticated && (
            <p className="text-xs text-slate-500 mt-3">
              Login or signup as a job seeker to apply.
            </p>
          )}
        </aside>
      </main>
    </div>
  );
};

export default JobDetails;
