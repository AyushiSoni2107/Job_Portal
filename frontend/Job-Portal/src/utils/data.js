import {
    Search,
    Users,
    FileText,
    MessageSquare,
    BarChart3,
    Shield,
    Clock,
    Award,
    Briefcase,
    Building2,
    LayoutDashboard,
    Plus,
} from "lucide-react";

export const jobSeekerFeatures = [
    {
        icon: Search,
        title: "Smart Job Matching",
        description: "Sophisticated algorithms match you with jobs that fit your skills and preferences."
    },
    {
        icon: FileText,
        title: "Resume uploader",
        description: "Easily upload your resume and let employers find you."
    },
    {
        icon: MessageSquare,
        title: "Direct Communication",
        description: "Communicate directly with employers."
    },
    {
        icon: Award,
        title: "Skill Assessments",
        description: "Showcase your skills with verified assessments."
    },
];

export const employerFeatures = [
    {
        icon: Users,
        title: "Access to Talent Pool",
        description: "Find and connect with top talent in your industry."
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        description: "Get insights on job postings and candidate engagement."
    },
    {
        icon: Shield,
        title: "Verified Candidates",
        description: "All candidates undergo background verfication to ensure you're hiring trustworthy professionals."
    },
    {
        icon: Clock, 
        title: "Quick Hiring Process",
        description: "Streamline your hiring process with our efficient tools."
    },
];

//Navigation items configuration
export const NAVIGATION_MENU = [
    { id: "employer-dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "post-job", name: "Post a Job", icon: Plus },
    { id: "manage-jobs", name: "Manage Jobs", icon: Briefcase },
    { id: "company-profile", name: "Company Profile", icon: Building2 },
];

// Categories and job types
export const CATEGORIES = [
    { value: "Engineering", label: "Engineering" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" },
    { value: "IT & Software", label: "IT & Software" },
    { value: "Customer-service", label: "Customer Service" },
    { value: "Product", label: "Product" },
    { value: "Operations", label: "Operations" },
    { value: "Finance", label: "Finance" },
    { value: "HR", label: "Human Resources" },
    { value: "Other", label: "Other" },
];

export const JOB_TYPES = [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
    { value: "Remote", label: "Remote" },
];

export const SALARY_RANGES = [
    { value: "0-50000", label: "$0 - $50k" },
    { value: "50000-100000", label: "$50k - $100k" },
    { value: "100000-150000", label: "$100k - $150k" },
    { value: "150000-200000", label: "$150k - $200k" },
    { value: "200000+", label: "$200k+" },
];
