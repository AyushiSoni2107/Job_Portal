import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Grid3X3, List } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import JobCard from "../../components/JobCard";
import Header from "../LandingPage/components/Header";

const SavedJobs = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState("");
  const [jobView, setJobView] = useState("grid");

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
      const jobs = (res.data || [])
        .map((item) => item.job)
        .filter(Boolean)
        .map((job) => ({ ...job, isSaved: true }));
      setSavedJobs(jobs);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "jobseeker") {
      navigate("/");
      return;
    }

    fetchSavedJobs();
  }, [isAuthenticated, user?.role]);

  const handleRemove = async (job) => {
    setRemovingId(job._id);
    try {
      await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(job._id));
      setSavedJobs((prev) => prev.filter((item) => item._id !== job._id));
      toast.success("Removed from saved jobs");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove job");
    } finally {
      setRemovingId("");
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
      <Header hidePrimaryLinks />
      <div className="h-16" />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <section className="mb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/find-jobs")}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center"
                aria-label="Back to jobs"
                title="Back to jobs"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl font-semibold text-slate-900">Saved Jobs</h1>
            </div>

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

          <div className="mt-3">
            <p className="text-slate-600 text-sm">
              Showing {savedJobs.length} jobs
            </p>
          </div>
        </section>

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">
            Loading saved jobs...
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">
            No saved jobs yet.
          </div>
        ) : (
          <div className={jobView === "grid" ? "grid grid-cols-1 xl:grid-cols-2 gap-4" : "space-y-4"}>
            {savedJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                showSaveControl
                isSaved
                disableSave={removingId === job._id}
                onToggleSave={handleRemove}
                variant={jobView === "grid" ? "compact" : "default"}
              />
            ))}
          </div>
        )}
      </main>
      </div>
    </div>
  );
};

export default SavedJobs;
