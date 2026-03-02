import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  ClipboardList,
  Building2,
  LogOut,
  LayoutDashboard,
  Plus,
  UserCircle2,
  X,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const EditProfileDetails = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    avatar: user?.avatar || "",
    companyLogo: user?.companyLogo || "",
  });

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (field, file) => {
    if (!file) return;

    try {
      const data = await uploadImage(file);
      setField(field, data.imageUrl || "");
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        name: formData.name,
        avatar: formData.avatar,
        companyName: formData.companyName,
        companyDescription: formData.companyDescription,
        companyLogo: formData.companyLogo,
      });

      updateUser(res.data);
      toast.success("Profile updated");
      navigate("/company-profile");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f4f7] text-slate-900 m-0 p-0">
      <div className="w-full min-h-screen lg:grid lg:grid-cols-[220px_1fr] m-0 p-0">
        <aside className="hidden lg:flex flex-col border-r border-slate-200 bg-blue-50 min-h-screen">
          <div className="h-16 px-4 flex items-center border-b border-slate-200">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-linear-to-r from-blue-500 to-purple-500 rounded-lg w-10 h-10 flex items-center justify-center text-blue-50">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-800 leading-none">DevHire</span>
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
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 text-sm"
            >
              <ClipboardList className="w-4 h-4" />
              Manage Jobs
            </Link>
            <Link
              to="/company-profile"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-600 text-white border-r-4 border-blue-700 text-sm font-medium"
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
              <h1 className="text-lg md:text-xl leading-tight font-bold">Company Profile</h1>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                View and manage your employer and company details
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/company-profile")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 transition-colors"
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
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800 leading-none">
                    {user?.name || "Employer"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Employer Profile</p>
                </div>
              </button>

              <button
                onClick={logout}
                className="px-3 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          </header>

          <section className="p-4 md:p-5 flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4">
              <h1 className="text-2xl font-semibold text-white">Edit Profile</h1>
            </div>

            <div className="p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                  <h2 className="text-2xl font-semibold text-slate-900 pb-3 border-b border-slate-300">
                    Personal Information
                  </h2>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                      {formData.avatar ? (
                        <img
                          src={resolveMediaUrl(formData.avatar)}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircle2 className="w-10 h-10 text-slate-400" />
                      )}
                    </div>
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm cursor-pointer hover:bg-blue-200">
                      <span>Choose file</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload("avatar", e.target.files?.[0])}
                      />
                    </label>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Full Name</label>
                      <input
                        value={formData.name}
                        onChange={(e) => setField("name", e.target.value)}
                        className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Email Address</label>
                      <input
                        value={user?.email || ""}
                        disabled
                        className="mt-1 w-full border border-slate-300 bg-slate-100 rounded-lg px-3 py-2 text-slate-600"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-slate-900 pb-3 border-b border-slate-300">
                    Company Information
                  </h2>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                      {formData.companyLogo ? (
                        <img
                          src={resolveMediaUrl(formData.companyLogo)}
                          alt="Company Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm cursor-pointer hover:bg-emerald-200">
                      <span>Choose file</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload("companyLogo", e.target.files?.[0])}
                      />
                    </label>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Company Name</label>
                      <input
                        value={formData.companyName}
                        onChange={(e) => setField("companyName", e.target.value)}
                        className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Company Description</label>
                      <textarea
                        value={formData.companyDescription}
                        onChange={(e) => setField("companyDescription", e.target.value)}
                        className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 min-h-28"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-300 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/company-profile")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EditProfileDetails;

