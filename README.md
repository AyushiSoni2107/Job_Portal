# DevHire - Job Portal

A full-stack hiring platform where:
- job seekers discover roles, save jobs, and apply in one click
- employers post openings, review applicants, and track hiring analytics

Built as a two-part app:
- `frontend/Job-Portal` -> React + Vite + Tailwind
- `backend` -> Express + MongoDB + JWT auth

## Why This Project

Most job boards are noisy. DevHire is built to keep the flow clear:
- fast role-based onboarding (`jobseeker` vs `employer`)
- focused dashboards for each side
- clean application lifecycle (`Applied -> In Review -> Accepted/Rejected`)

## Core Features

### For Job Seekers
- account creation/login + password reset
- browse and filter jobs (keyword, location, category, type, salary range)
- save/unsave jobs
- apply to jobs using profile resume
- track application status

### For Employers
- create/update/delete job postings
- open/close job listings
- manage posted jobs with applicant counts
- view applicants per role
- update candidate status
- dashboard analytics with trend data

### Platform Features
- JWT-protected APIs
- image upload support (GridFS in MongoDB with local fallback in development)
- public stats endpoint for landing page metrics
- Vercel-ready routing for frontend + serverless backend

## Tech Stack

- Frontend: React 19, Vite 7, TailwindCSS 4, React Router, Axios, Framer Motion
- Backend: Node.js, Express 5, Mongoose, JWT, Bcrypt, Multer
- Database: MongoDB
- Deployment: Vercel

## Project Structure

```text
Job_Portal/
|- frontend/
|  `- Job-Portal/
|     |- src/
|     |- package.json
|     `- vercel.json
|- backend/
|  |- api/index.js
|  |- app.js
|  |- server.js
|  |- controllers/
|  |- routes/
|  |- models/
|  `- package.json
|- Images/
`- vercel.json
```

## Environment Variables

### Backend (`backend/.env`)

```bash
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
PUBLIC_BACKEND_URL=http://localhost:3000
```

### Frontend (`frontend/Job-Portal/.env`)

```bash
VITE_API_BASE_URL=http://localhost:3000
```

Note:
- If `VITE_API_BASE_URL` is not set, frontend defaults to `http://localhost:3000` in development.
- In production, frontend has a fallback backend URL configured in code.

## Local Setup

### 1) Clone

```bash
git clone <your-repo-url>
cd Job_Portal
```

### 2) Install dependencies

```bash
cd backend
npm install

cd ../frontend/Job-Portal
npm install
```

### 3) Start backend

```bash
cd backend
npm run dev
```

### 4) Start frontend

```bash
cd frontend/Job-Portal
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:3000` (or your configured `PORT`).

## API Overview

Base URL (local): `http://localhost:3000`

- Auth: `/api/auth`
- User profile: `/api/user`
- Jobs: `/api/jobs`
- Applications: `/api/applications`
- Saved jobs: `/api/save-jobs`
- Analytics: `/api/analytics`

## Deployment Notes (Vercel)

This repository already contains:
- root `vercel.json` for combined frontend + backend routing
- backend `api/index.js` entry for serverless function handling

Recommended production env vars:
- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `PUBLIC_BACKEND_URL`
- `VITE_API_BASE_URL`

## Future Improvements

- email provider integration for password reset
- tests (unit + API integration)
- admin moderation tools
- notifications for application status updates

---

If you are hiring, post a role.
If you are job hunting, make your next move.
DevHire is built for both.
"# Job-portal-devHire" 
