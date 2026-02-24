import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ClipboardList, Users, Building2, FileText } from "lucide-react";
import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const ApplicationViewer = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);
        const jobList = res.data || [];
        setJobs(jobList);
        if (jobList.length > 0) {
          setSelectedJobId(jobList[0]._id);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load jobs");
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedJobId) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(selectedJobId));
        setApplications(res.data || []);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [selectedJobId]);

  const updateStatus = async (applicationId, status) => {
    try {
      await axiosInstance.put(API_PATHS.APPLICATIONS.UPDATE_STATUS(applicationId), { status });
      setApplications((prev) =>
        prev.map((item) => (item._id === applicationId ? { ...item, status } : item))
      );
      toast.success("Application status updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Status update failed");
    }
  };

  const getResumeUrl = (application) => {
    return resolveMediaUrl(application?.applicant?.resume || application?.resume || "");
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">View Applications Page</h1>
          <p className="text-sm text-slate-500">Review all candidates per job post.</p>
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
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700"
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

        <main className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium text-slate-700">Select Job</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-slate-600">Loading applications...</p>
          ) : applications.length === 0 ? (
            <p className="text-slate-600">No applications found for this job.</p>
          ) : (
            <div className="space-y-3">
              {applications.map((application) => (
                <div key={application._id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{application.applicant?.name}</p>
                      <p className="text-sm text-slate-600">{application.applicant?.email}</p>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                      {application.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {getResumeUrl(application) ? (
                      <a
                        href={getResumeUrl(application)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 border border-slate-300 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-100"
                      >
                        <FileText className="w-4 h-4" />
                        View Resume
                      </a>
                    ) : (
                      <span className="text-sm text-slate-500">No resume uploaded</span>
                    )}

                    <select
                      value={application.status}
                      onChange={(e) => updateStatus(application._id, e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option>Applied</option>
                      <option>Accepted</option>
                      <option>In Review</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ApplicationViewer;
