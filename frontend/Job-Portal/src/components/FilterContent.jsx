import { Search } from "lucide-react";

const FilterContent = ({ filters, onChange, onApply, onReset, loading }) => {
  return (
    <form onSubmit={onApply} className="bg-white border border-slate-200 rounded-xl p-4 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <div className="relative xl:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={filters.keyword}
            onChange={(event) => onChange("keyword", event.target.value)}
            placeholder="Search by title..."
            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2"
          />
        </div>

        <input
          value={filters.location}
          onChange={(event) => onChange("location", event.target.value)}
          placeholder="Location"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />

        <input
          value={filters.category}
          onChange={(event) => onChange("category", event.target.value)}
          placeholder="Category"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />

        <select
          value={filters.type}
          onChange={(event) => onChange("type", event.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        >
          <option value="">All Job Types</option>
          <option value="Remote">Remote</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <input
          type="number"
          value={filters.minSalary}
          onChange={(event) => onChange("minSalary", event.target.value)}
          placeholder="Min Salary"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />

        <input
          type="number"
          value={filters.maxSalary}
          onChange={(event) => onChange("maxSalary", event.target.value)}
          placeholder="Max Salary"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Searching..." : "Apply Filters"}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="border border-slate-300 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default FilterContent;
