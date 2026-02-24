const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// In production, default to same-origin so a single Vercel project works
// with API routes mounted at /api. In local dev, keep localhost backend fallback.
export const BASE_URL = envBaseUrl || (import.meta.env.PROD ? "" : "http://localhost:3000");

export const API_PATHS = {
    AUTH: {
        REGISTER: `/api/auth/register`, // Signup
        LOGIN: `/api/auth/login`, // Authenticate user & return JWT token
        FORGOT_PASSWORD: `/api/auth/forgot-password`,
        RESET_PASSWORD: `/api/auth/reset-password`,
        GET_PROFILE: `/api/auth/profile`, // Get logged-in user details
        UPDATE_PROFILE: `/api/user/profile`, // Update profile details
        DELETE_RESUME: `/api/user/resume`, // Delete Resume details
    },
    
    DASHBOARD: {
        OVERVIEW: `/api/analytics/overview`,
    },
    
    JOBS: {
        GET_ALL_JOBS: `/api/jobs`,
        POST_JOB: `/api/jobs`,
        GET_JOBS_EMPLOYER: `/api/jobs/get-jobs-employer`,
        GET_JOB_BY_ID: (id) => `/api/jobs/${id}`,
        UPDATE_JOB: (id) => `/api/jobs/${id}`,
        TOGGLE_CLOSE: (id) => `/api/jobs/${id}/toggle-close`,
        DELETE_JOB: (id) => `/api/jobs/${id}`,
        
        SAVE_JOB: (id) => `/api/save-jobs/${id}`,
        UNSAVE_JOB: (id) => `/api/save-jobs/${id}`,
        GET_SAVED_JOBS: `/api/save-jobs/my`,
    },

    APPLICATIONS: {
    APPLY_TO_JOB: (id) => `/api/applications/${id}`,
    GET_ALL_APPLICATIONS: (id) => `/api/applications/job/${id}`,
    UPDATE_STATUS: (id) => `/api/applications/${id}/status`,
},

IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", // Upload profile picture
},
};
