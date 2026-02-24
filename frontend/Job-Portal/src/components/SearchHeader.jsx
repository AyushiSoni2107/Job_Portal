import { Link } from "react-router-dom";

const SearchHeader = ({ title, subtitle }) => {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-600 mt-1">{subtitle}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/find-jobs" className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100">
            Browse Jobs
          </Link>
          <Link to="/saved-jobs" className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100">
            Saved Jobs
          </Link>
          <Link to="/profile" className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100">
            Update Profile
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
