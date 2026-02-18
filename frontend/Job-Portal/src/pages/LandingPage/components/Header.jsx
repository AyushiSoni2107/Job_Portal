import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="fixed top-0 left-0 right-0 z-50 bg-blue-50 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="bg-linear-to-r from-blue-500 to-purple-500 rounded-lg w-10 h-10 flex items-center justify-center text-blue-50">
              <Briefcase size={28} />
            </div>
            <span className="text-2xl font-bold text-gray-800">DevHire</span>
          </div>

          {/* Navigation Links - hidden on mobile*/}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate("/find-jobs")}
              className="text-gray-700 hover:text-blue-500 transition-colors font-medium"
            >
              Browse Jobs
            </button>
            <button
              onClick={() => {
                navigate(
                  isAuthenticated && user?.role === "employer"
                    ? "/employer-dashboard"
                    : "/login",
                );
              }}
              className="text-gray-700 hover:text-blue-500 transition-colors font-medium"
            >
              For Employers
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <a
              href="/login"
              className="text-gray-700 hover:text-blue-500 font-medium"
            >
              Login
            </a>
            <a
              href="/signup"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
