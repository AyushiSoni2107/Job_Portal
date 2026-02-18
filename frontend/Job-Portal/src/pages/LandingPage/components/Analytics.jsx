import { color, motion } from "framer-motion";
import { TrendingUp, Users, Briefcase, Target } from "lucide-react";

const Analytics = () => {
  const colorClasses = {
    blue: "bg-blue-100",
    purple: "bg-purple-100",
    green: "bg-green-100",
    orange: "bg-orange-100",
  };

  const colorText = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    green: "text-green-600",
    orange: "text-orange-600",
  };

  const stats = [
    {
      icon: Users,
      title: "Active Users",
      value: "1,200+",
      growth: "+15%",
      color: "blue",
    },
    {
      icon: Briefcase,
      title: "Jobs Posted",
      value: "5,000+",
      growth: "+20%",
      color: "purple",
    },
    {
      icon: Target,
      title: "Successful Hires",
      value: "3,500+",
      growth: "+25%",
      color: "green",
    },
    {
      icon: TrendingUp,
      title: "Revenue Growth",
      value: "$1M+",
      growth: "+30%",
      color: "orange",
    },
  ];
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 items-center mb-6">
          Platform
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {" "}
            Analytics
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Real-time insights and data-driven analytics to help you make informed
          decisions and optimize your job search or hiring process.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${colorClasses[stat.color]} rounded-xl flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${colorText[stat.color]}`} />
              </div>
              <span className="text-green-500 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full">
                {stat.growth}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {stat.value}
            </h3>
            <p className="text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default Analytics;
