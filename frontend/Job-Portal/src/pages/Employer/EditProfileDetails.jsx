import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, ClipboardList, Users, Building2 } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const EditProfileDetails = () => {
  const { user, updateUser } = useAuth();
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
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">Edit Employer Profile Page</h1>
          <p className="text-sm text-slate-500">Update company and employer details.</p>
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
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Users className="w-4 h-4" />
              View Applications
            </Link>
            <Link
              to="/company-profile"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700"
            >
              <Building2 className="w-4 h-4" />
              Profile Details
            </Link>
          </nav>
        </aside>

        <main>
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Employer Name</label>
              <input
                value={formData.name}
                onChange={(e) => setField("name", e.target.value)}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>

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
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 min-h-32"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload("avatar", e.target.files?.[0])}
                  className="mt-1 w-full text-sm"
                />
                {formData.avatar && (
                  <img src={resolveMediaUrl(formData.avatar)} alt="Avatar" className="mt-2 h-16 w-16 rounded-full object-cover" />
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Company Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload("companyLogo", e.target.files?.[0])}
                  className="mt-1 w-full text-sm"
                />
                {formData.companyLogo && (
                  <img src={resolveMediaUrl(formData.companyLogo)} alt="Logo" className="mt-2 h-16 w-16 rounded-lg object-cover" />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate("/company-profile")}
                className="px-4 py-2 rounded-lg border border-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditProfileDetails;
