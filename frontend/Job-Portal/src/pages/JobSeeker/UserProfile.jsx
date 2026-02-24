import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import SearchHeader from "../../components/SearchHeader";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    resume: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "jobseeker") {
      navigate("/");
      return;
    }

    setFormData({
      name: user?.name || "",
      avatar: user?.avatar || "",
      resume: user?.resume || "",
    });
  }, [isAuthenticated, user?._id, user?.role]);

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    try {
      const res = await uploadImage(file);
      setField("avatar", res.imageUrl || "");
      toast.success("Avatar uploaded");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Avatar upload failed");
    }
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;
    setUploadingResume(true);
    try {
      const res = await uploadImage(file);
      setField("resume", res.imageUrl || "");
      toast.success("Resume uploaded");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Resume upload failed");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!formData.resume) return;
    try {
      await axiosInstance.delete(API_PATHS.AUTH.DELETE_RESUME, {
        data: { resumeUrl: formData.resume },
      });
      setField("resume", "");
      updateUser({ resume: "" });
      toast.success("Resume removed");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove resume");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        name: formData.name,
        avatar: formData.avatar,
        resume: formData.resume,
      });
      updateUser(res.data);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SearchHeader
        title="Update JobSeeker Profile Page"
        subtitle="Update your basic profile and resume used for applications."
      />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="mt-1 w-full border border-slate-200 bg-slate-100 rounded-lg px-3 py-2 text-slate-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input
              value={formData.name}
              onChange={(e) => setField("name", e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Avatar</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 w-full text-sm"
              onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
            />
            {formData.avatar && (
              <img src={resolveMediaUrl(formData.avatar)} alt="Avatar" className="mt-2 h-16 w-16 rounded-full object-cover" />
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Resume (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              className="mt-1 w-full text-sm"
              onChange={(e) => handleResumeUpload(e.target.files?.[0])}
            />
            {uploadingResume && <p className="text-sm text-slate-500 mt-1">Uploading resume...</p>}

            {formData.resume && (
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={resolveMediaUrl(formData.resume)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100"
                >
                  View Resume
                </a>
                <button
                  type="button"
                  onClick={handleDeleteResume}
                  className="text-sm px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50"
                >
                  Delete Resume
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default UserProfile;
