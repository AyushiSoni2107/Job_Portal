const formatCurrency = (value, currency = "INR") => {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount) || amount <= 0) return "Not specified";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

const JobPostingPreview = ({ values }) => {
  const currency = values?.currency || "INR";
  const salaryMin = formatCurrency(values?.salaryMin, currency);
  const salaryMax = formatCurrency(values?.salaryMax, currency);
  const companyName = values?.companyName?.trim() || "Your Company";
  const categories = Array.isArray(values?.category)
    ? values.category.filter(Boolean)
    : String(values?.category || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 h-fit sticky top-4">
      <h2 className="text-lg font-semibold text-slate-900">Live Preview</h2>
      <p className="text-sm text-slate-500 mt-1">Candidate-facing job card updates as you type.</p>

      <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-blue-100">Now Hiring</p>
          <h3 className="text-xl font-semibold text-white mt-1">
            {values?.title?.trim() || "Untitled Role"}
          </h3>
          <p className="text-sm text-blue-100 mt-1">{companyName}</p>
        </div>

        <div className="p-5 space-y-4 bg-gradient-to-b from-slate-50 to-white">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
              {values?.type || "Not specified"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {values?.location?.trim() || "Location"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
              {categories.length > 0 ? categories.join(", ") : "General"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">{currency}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Salary Min</p>
              <p className="text-slate-900 font-semibold mt-1">{salaryMin}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Salary Max</p>
              <p className="text-slate-900 font-semibold mt-1">{salaryMax}</p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Description</p>
            <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">
              {values?.description?.trim() || "No description provided yet."}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Requirements</p>
            <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">
              {values?.requirements?.trim() || "No requirements provided yet."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobPostingPreview;
