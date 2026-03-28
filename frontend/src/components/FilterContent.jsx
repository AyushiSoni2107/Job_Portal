import { Search, MapPin } from "lucide-react";

const FilterContent = ({ filters, onChange, onApply, loading }) => {
  return (
    <form onSubmit={onApply} className="bg-white border border-slate-200 rounded-2xl p-5 md:p-7 mb-5 shadow-sm">
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">Find Your Dream Job</h2>
        <p className="text-slate-600 mt-1">Discover opportunities that match your passion</p>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_0.38fr_auto] gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={filters.keyword}
            onChange={(event) => onChange("keyword", event.target.value)}
            placeholder="Job title, company, or keywords"
            className="w-full border border-slate-300 rounded-xl pl-11 pr-4 h-12"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={filters.location}
            onChange={(event) => onChange("location", event.target.value)}
            placeholder="Location"
            className="w-full border border-slate-300 rounded-xl pl-11 pr-4 h-12"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 px-8 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search Jobs"}
        </button>
      </div>

    </form>
  );
};

export default FilterContent;
