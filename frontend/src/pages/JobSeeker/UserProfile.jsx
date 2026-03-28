import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Save, Trash2, X } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import Header from "../LandingPage/components/Header";
import ConfirmDialog from "../../components/ConfirmDialog";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [resumeFileName, setResumeFileName] = useState("No file chosen");
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

    if (user?.resume) {
      const resumeName = decodeURIComponent(user.resume.split("/").pop() || "Resume uploaded");
      setResumeFileName(resumeName);
    } else {
      setResumeFileName("No file chosen");
    }
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
      setResumeFileName("No file chosen");
      updateUser({ resume: "" });
      toast.success("Resume removed");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove resume");
    }
  };

  const confirmSaveChanges = async () => {
    setShowSaveDialog(false);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (loading) return;
    setShowSaveDialog(true);
  };

  const handleCancel = () => {
    navigate("/find-jobs");
  };

  return (
    <div
      className="relative min-h-screen bg-white overflow-hidden"
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

      <div className="relative z-10 min-h-screen">
      <Header hidePrimaryLinks />
      <div className="h-16" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700">
            <h1 className="text-2xl font-semibold text-white">Profile</h1>
          </div>

          <div className="px-6 py-6 space-y-5">
            <div className="flex flex-wrap items-center gap-5">
              {formData.avatar ? (
                <img
                  src={resolveMediaUrl(formData.avatar)}
                  alt="Avatar"
                  className="h-20 w-20 rounded-full object-cover border-4 border-slate-100"
                />
              ) : (
                <div className="h-20 w-20 rounded-full border-4 border-slate-100 bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
                  Avatar
                </div>
              )}

              <label className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium cursor-pointer hover:bg-blue-200 transition-colors">
                Choose file
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                />
              </label>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                value={formData.name}
                onChange={(e) => setField("name", e.target.value)}
                className="mt-2 w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input
                value={user?.email || ""}
                disabled
                className="mt-2 w-full border border-slate-300 bg-slate-100 rounded-xl px-4 py-3 text-slate-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Resume</label>
              <div className="mt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium cursor-pointer hover:bg-blue-200 transition-colors">
                    Choose file
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setResumeFileName(file.name);
                        handleResumeUpload(file);
                      }}
                    />
                  </label>
                  <span className="text-sm text-slate-500">{resumeFileName}</span>
                </div>
                {uploadingResume && <p className="text-sm text-slate-500 mt-2">Uploading resume...</p>}

                {formData.resume && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="text-slate-600">Link:</span>
                    <a
                      href={resolveMediaUrl(formData.resume)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {resolveMediaUrl(formData.resume)}
                    </a>
                    <button
                      type="button"
                      onClick={handleDeleteResume}
                      className="text-rose-600 hover:text-rose-700"
                      aria-label="Delete resume"
                      title="Delete resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="border-t border-slate-300 pt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </main>

      <ConfirmDialog
        open={showSaveDialog}
        title="Save profile changes?"
        message="Your updated profile details will be saved and visible in your account."
        confirmText="Yes, Save Changes"
        cancelText="Not Now"
        loading={loading}
        onConfirm={confirmSaveChanges}
        onClose={() => setShowSaveDialog(false)}
      />
      </div>
    </div>
  );
};

export default UserProfile;
