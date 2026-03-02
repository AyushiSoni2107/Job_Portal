import { Link, useNavigate } from "react-router-dom";
import { Building2, MapPin, Briefcase, CircleDollarSign, Bookmark, CalendarDays } from "lucide-react";
import { resolveMediaUrl } from "../utils/mediaUrl";

const getApplicationStatusMeta = (status) => {
  if (!status) return null;

  const normalized = String(status).trim();
  if (normalized === "Accepted") {
    return {
      label: "Selected",
      className: "bg-emerald-100 text-emerald-700",
    };
  }

  if (normalized === "Rejected") {
    return {
      label: "Not Selected",
      className: "bg-rose-100 text-rose-700",
    };
  }

  if (normalized === "In Review") {
    return {
      label: "In Review",
      className: "bg-amber-100 text-amber-700",
    };
  }

  return {
    label: "Applied",
    className: "bg-sky-100 text-sky-700",
  };
};

const formatSalary = (amount, currency = "INR") => {
  const value = Number(amount || 0);
  if (!Number.isFinite(value) || value <= 0) return "0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
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

const formatPostedDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const JobCard = ({
  job,
  showSaveControl = false,
  onToggleSave,
  disableSave = false,
  isSaved = false,
  customActionLabel = "",
  onCustomAction,
  variant = "default",
}) => {
  const navigate = useNavigate();
  const applicationStatus = getApplicationStatusMeta(job.applicationStatus);
  const companyName = job.company?.companyName || job.company?.name || "Company";
  const postedDate = formatPostedDate(job.createdAt || job.postedAt);

  if (variant === "compact") {
    return (
      <article
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm cursor-pointer"
        onClick={() => navigate(`/job/${job._id}`)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            navigate(`/job/${job._id}`);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
              {job.company?.companyLogo ? (
                <img
                  src={resolveMediaUrl(job.company.companyLogo)}
                  alt={companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-slate-900 truncate">{job.title}</h2>
              <p className="text-sm text-slate-600 mt-0.5 truncate">{companyName}</p>
            </div>
          </div>

          {showSaveControl && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleSave?.(job);
              }}
              disabled={disableSave}
              aria-label={isSaved ? "Unsave job" : "Save job"}
              title={isSaved ? "Unsave job" : "Save job"}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center disabled:opacity-60 ${
                isSaved
                  ? "border-blue-200 bg-blue-50 text-blue-600"
                  : "border-slate-300 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100">
            <MapPin className="w-3.5 h-3.5" />
            {job.location || "N/A"}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
            {job.type || "Full-Time"}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100">
            <Briefcase className="w-3.5 h-3.5" />
            {formatCategories(job.category)}
          </span>
        </div>

        {postedDate && (
          <div className="mt-3 text-sm text-slate-500 inline-flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            {postedDate}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <p className="text-2xl font-semibold text-blue-600">
            {formatSalary(job.salaryMin, job.currency)} - {formatSalary(job.salaryMax, job.currency)}
          </p>

          {applicationStatus ? (
            <span className={`text-xs px-2.5 py-1 rounded-full ${applicationStatus.className}`}>
              {applicationStatus.label}
            </span>
          ) : (
            <Link
              to={`/job/${job._id}`}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-100"
            >
              View Details
            </Link>
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      className="bg-white border border-slate-200 rounded-xl p-5 cursor-pointer"
      onClick={() => navigate(`/job/${job._id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/job/${job._id}`);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
            {job.company?.companyLogo ? (
              <img
                src={resolveMediaUrl(job.company.companyLogo)}
                alt={job.company?.companyName || job.company?.name || "Company logo"}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
          <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{job.description}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{job.type}</span>
      </div>

      {applicationStatus && (
        <div className="mt-3">
          <span className={`text-xs px-2.5 py-1 rounded-full ${applicationStatus.className}`}>
            Application Status: {applicationStatus.label}
          </span>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
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
          {formatCategories(job.category)}
        </span>
        <span className="inline-flex items-center gap-1">
          <CircleDollarSign className="w-4 h-4" />
          {formatSalary(job.salaryMin, job.currency)} - {formatSalary(job.salaryMax, job.currency)}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/job/${job._id}`}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-700"
          >
            View Details
          </Link>

          {showSaveControl && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleSave?.(job);
              }}
              disabled={disableSave}
              aria-label={isSaved ? "Unsave job" : "Save job"}
              title={isSaved ? "Unsave job" : "Save job"}
              className={`w-10 h-10 rounded-lg border flex items-center justify-center disabled:opacity-60 ${
                isSaved
                  ? "border-blue-200 bg-blue-50 text-blue-600"
                  : "border-slate-300 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            </button>
          )}

          {customActionLabel && onCustomAction && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onCustomAction(job);
              }}
              className="px-3 py-2 rounded-lg border border-rose-300 text-rose-700 text-sm hover:bg-rose-50"
            >
              {customActionLabel}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default JobCard;
