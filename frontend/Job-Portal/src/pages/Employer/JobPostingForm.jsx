import { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ClipboardList, Users, Building2 } from "lucide-react";
import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import JobPostingPreview from "./JobPostingPreview";

const defaultFormData = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  category: "",
  type: "Full-Time",
  currency: "INR",
  salaryMin: "",
  salaryMax: "",
};

const JobPostingForm = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title || !formData.description || !formData.requirements || !formData.type) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.JOBS.POST_JOB, {
        ...formData,
        salaryMin: Number(formData.salaryMin || 0),
        salaryMax: Number(formData.salaryMax || 0),
      });
      toast.success("Job posted successfully");
      setFormData(defaultFormData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">Create Job Posting Form</h1>
          <p className="text-sm text-slate-500">Publish your job and preview it live.</p>
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
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700"
            >
              <ClipboardList className="w-4 h-4" />
              Create Job Posting Form
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

        <main className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Job Title *</label>
              <input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                placeholder="Senior Frontend Developer"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 min-h-28"
                placeholder="Describe role, goals, and responsibilities"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Requirements *</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => updateField("requirements", e.target.value)}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 min-h-24"
                placeholder="Skills and minimum experience"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Location</label>
                <input
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Category</label>
                <input
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Job Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => updateField("type", e.target.value)}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                >
                  <option>Remote</option>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Salary Min</label>
                <input
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => updateField("salaryMin", e.target.value)}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Salary Max</label>
                <input
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => updateField("salaryMax", e.target.value)}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => updateField("currency", e.target.value)}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
          </form>

          <JobPostingPreview values={formData} />
        </main>
      </div>
    </div>
  );
};

export default JobPostingForm;
