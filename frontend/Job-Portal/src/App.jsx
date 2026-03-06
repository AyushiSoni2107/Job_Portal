import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard";
import JobDetails from "./pages/JobSeeker/JobDetails";
import SavedJobs from "./pages/JobSeeker/SavedJobs";
import UserProfile from "./pages/JobSeeker/UserProfile";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import JobPostingForm from "./pages/Employer/JobPostingForm";
import ManageJobs from "./pages/Employer/ManageJobs";
import ApplicationViewer from "./pages/Employer/ApplicationViewer";
import EmployerProfilePage from "./pages/Employer/EmployerProfilePage";
import EditProfileDetails from "./pages/Employer/EditProfileDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

const HomeRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user?.role === "employer") {
    return <Navigate to="/employer-dashboard" replace />;
  }
  if (user?.role === "jobseeker") {
    return <Navigate to="/find-jobs" replace />;
  }

  return <LandingPage />;
};

const App = () => {
  return (
    <Router>
      <div className="relative min-h-screen bg-white overflow-x-hidden">
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: "var(--app-bg-gradient)",
          }}
        />

        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--app-grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--app-grid-color) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative z-10">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomeRoute />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ForgotPassword />} />

            {/* Protected Routes for Job Seekers */}
            <Route path="/find-jobs" element={<JobSeekerDashboard />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/profile" element={<UserProfile />} />

            {/* Protected Routes for Employers */}
            <Route element={<ProtectedRoute requiredRole="employer" />}>
              <Route path="/employer-dashboard" element={<EmployerDashboard />} />
              <Route path="/post-job" element={<JobPostingForm />} />
              <Route path="/manage-jobs" element={<ManageJobs />} />
              <Route path="/applicants" element={<ApplicationViewer />} />
              <Route path="/company-profile" element={<EmployerProfilePage />} />
              <Route path="/company-profile/edit" element={<EditProfileDetails />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
            color: "#111827",
          },
        }}
      />
    </Router>
  );
};

export default App;
