import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import JobCard from "../../components/JobCard";
import FilterContent from "../../components/FilterContent";
import Header from "../LandingPage/components/Header";

const JobSeekerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState("");
  const defaultFilters = {
    keyword: "",
    location: "",
    category: "",
    type: "",
    minSalary: "",
    maxSalary: "",
  };
  const [filters, setFilters] = useState(defaultFilters);

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
        toast.success("Job saved");
      }
      fetchJobs(filters);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update saved jobs");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="min-h-screen">
      <Header hidePrimaryLinks />
      <div className="h-16" />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <FilterContent
          filters={filters}
          onChange={handleFilterChange}
          onApply={handleSearch}
          onReset={handleResetFilters}
          loading={loading}
        />

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">
            No jobs found.
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                showSaveControl
                isSaved={Boolean(job.isSaved)}
                disableSave={savingId === job._id}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default JobSeekerDashboard;
