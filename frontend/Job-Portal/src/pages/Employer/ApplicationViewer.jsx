import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  FileDown,
  MapPin,
  Briefcase,
  CalendarDays,
  ClipboardList,
  Building2,
  LogOut,
  LayoutDashboard,
  Plus,
  UserCircle2,
  X,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import { useAuth } from "../../context/AuthContext";
import DevHireBrand from "../../components/DevHireBrand";

const formatAppliedDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCategories = (categoryValue) => {
  if (Array.isArray(categoryValue)) {
    const values = categoryValue.filter(Boolean);
    return values.length > 0 ? values.join(", ") : "General";
  }
  if (typeof categoryValue === "string" && categoryValue.trim()) {
    return categoryValue;
  }
  return "General";
};

const initialsFromName = (name) =>
  String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "NA";

const ApplicationViewer = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
  const [isDesktopProfileMenuOpen, setIsDesktopProfileMenuOpen] = useState(false);
  const mobileProfileMenuRef = useRef(null);
  const desktopProfileMenuRef = useRef(null);
  const [searchParams] = useSearchParams();
  const jobIdFromQuery = searchParams.get("jobId") || "";

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);
        const jobList = res.data || [];
        setJobs(jobList);

        if (jobList.length === 0) {
          setSelectedJobId("");
          return;
        }

        const hasQueryJob = jobIdFromQuery && jobList.some((job) => job._id === jobIdFromQuery);
        setSelectedJobId(hasQueryJob ? jobIdFromQuery : jobList[0]._id);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load jobs");
      }
    };

    fetchJobs();
  }, [jobIdFromQuery]);

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

  const selectedJob = useMemo(
    () => jobs.find((job) => job._id === selectedJobId) || null,
    [jobs, selectedJobId]
  );

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingStatusId(applicationId);
      await axiosInstance.put(API_PATHS.APPLICATIONS.UPDATE_STATUS(applicationId), { status });
      setApplications((prev) =>
        prev.map((item) => (item._id === applicationId ? { ...item, status } : item))
      );
      setSelectedApplication((prev) => (prev && prev._id === applicationId ? { ...prev, status } : prev));
      toast.success("Application status updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingStatusId("");
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

        <main className="min-w-0">
          <header className="h-16 px-4 md:px-5 border-b border-slate-200 bg-blue-50 flex items-center justify-between">
            <div className="min-w-0">
              <div className="md:hidden">
                <DevHireBrand />
              </div>
              <h1 className="hidden md:block text-lg md:text-xl leading-tight font-bold">Job Management</h1>
              <p className="hidden md:block text-xs md:text-sm text-slate-500 mt-1">
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
            <div className="max-w-6xl">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => navigate("/manage-jobs")}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900">Applications Overview</h2>
              </div>

              {!selectedJob ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-600">
                  {jobs.length === 0 ? "No jobs found." : "Select a job to view applications."}
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-2xl p-5 text-white border border-blue-500">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
                        <p className="mt-2 text-sm text-blue-100 inline-flex items-center gap-4 flex-wrap">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {selectedJob.location || "N/A"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {selectedJob.type || "N/A"}
                          </span>
                          <span>{formatCategories(selectedJob.category)}</span>
                        </p>
                      </div>
                      <span className="px-4 py-2 rounded-xl bg-white/20 text-sm font-medium">
                        {applications.length} Applications
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl p-4 md:p-5 space-y-3">
                    {loading ? (
                      <p className="text-slate-600">Loading applications...</p>
                    ) : applications.length === 0 ? (
                      <p className="text-slate-600">No applications for this job yet.</p>
                    ) : (
                      applications.map((application) => {
                        const applicantName = application?.applicant?.name || "Applicant";
                        const applicantEmail = application?.applicant?.email || "No email";
                        const resumeUrl = resolveMediaUrl(application?.applicant?.resume || application?.resume || "");

                        return (
                          <div
                            key={application._id}
                            className="border border-slate-200 rounded-xl p-3 md:p-4 flex items-center justify-between gap-3 flex-wrap"
                          >
                            <div className="flex items-center gap-3 min-w-[240px]">
                              {application?.applicant?.avatar ? (
                                <img
                                  src={resolveMediaUrl(application.applicant.avatar)}
                                  alt={applicantName}
                                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
                                  {initialsFromName(applicantName)}
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-slate-900">{applicantName}</p>
                                <p className="text-sm text-slate-600">{applicantEmail}</p>
                                <p className="text-xs text-slate-500 mt-0.5 inline-flex items-center gap-1">
                                  <CalendarDays className="w-3.5 h-3.5" />
                                  Applied {formatAppliedDate(application.createdAt)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                                {application.status || "Applied"}
                              </span>

                              {resumeUrl ? (
                                <a
                                  href={resumeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                  <FileDown className="w-3.5 h-3.5" />
                                  Resume
                                </a>
                              ) : (
                                <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500">
                                  No Resume
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => setSelectedApplication(application)}
                                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Profile
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Applicant Profile</h3>
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-center">
                {selectedApplication?.applicant?.avatar ? (
                  <img
                    src={resolveMediaUrl(selectedApplication.applicant.avatar)}
                    alt={selectedApplication?.applicant?.name || "Applicant"}
                    className="w-20 h-20 rounded-full object-cover border border-slate-200 mx-auto"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-semibold mx-auto">
                    {initialsFromName(selectedApplication?.applicant?.name)}
                  </div>
                )}
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {selectedApplication?.applicant?.name || "Applicant"}
                </p>
                <p className="text-slate-600 text-sm mt-1">
                  {selectedApplication?.applicant?.email || "No email"}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-sm text-slate-500">Applied Position</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {selectedApplication?.job?.title || selectedJob?.title || "N/A"}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {(selectedApplication?.job?.location || selectedJob?.location || "N/A")} -{" "}
                  {(selectedApplication?.job?.type || selectedJob?.type || "N/A")}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="font-semibold text-slate-900">Application Details</h4>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <p className="text-slate-600">
                    Status:{" "}
                    <span className="font-semibold text-slate-900">
                      {selectedApplication?.status || "Applied"}
                    </span>
                  </p>
                  <p className="text-slate-600">
                    Applied Date:{" "}
                    <span className="font-semibold text-slate-900">
                      {formatAppliedDate(selectedApplication?.createdAt)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {resolveMediaUrl(selectedApplication?.applicant?.resume || selectedApplication?.resume || "") ? (
                  <a
                    href={resolveMediaUrl(
                      selectedApplication?.applicant?.resume || selectedApplication?.resume || ""
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700"
                  >
                    <FileDown className="w-4 h-4" />
                    Download Resume
                  </a>
                ) : (
                  <p className="text-sm text-slate-500">No resume uploaded by this applicant.</p>
                )}

                <div>
                  <label className="text-sm text-slate-600">Change Application Status</label>
                  <select
                    value={selectedApplication?.status || "Applied"}
                    onChange={(e) => updateStatus(selectedApplication._id, e.target.value)}
                    disabled={updatingStatusId === selectedApplication._id}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm disabled:opacity-60"
                  >
                    <option>Applied</option>
                    <option>In Review</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ApplicationViewer;

