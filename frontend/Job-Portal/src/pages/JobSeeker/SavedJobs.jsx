import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen">
      <Header hidePrimaryLinks />
      <div className="h-16" />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <section className="mb-5">
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
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                showSaveControl
                isSaved
                disableSave={removingId === job._id}
                onToggleSave={handleRemove}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedJobs;
