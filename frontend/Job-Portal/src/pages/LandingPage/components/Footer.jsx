import { Briefcase } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-blue-50 text-gray-900 overflow-hidden">
      <div className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="text-center space-y-8">
            {/* Logo/Brand */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-16">
                <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-blue-50">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">DevHire</h3>
              </div>

              <p className={`text-xl text-gray-600 max-w-md mx-auto`}>
                Connecting talented professionals with top companies. Whether
                you're job hunting or hiring, we've got you covered.
              </p>
            </div>

            {/* Copyright */}
            <div className="space-y-2">
              <p className={`text-sm text-gray-600`}>
                &copy; {new Date().getFullYear()} <b>DevHire.</b> All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
