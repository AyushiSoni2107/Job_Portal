const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");
const User = require('../models/User');

const uploadsDir = process.env.VERCEL
    ? path.join('/tmp', 'uploads')
    : path.join(__dirname, '..', 'uploads');

// @desc    Update user profile (name, avatar, company details)
exports.updateProfile = async (req, res) => {
    try {
        // Implementation for updating profile
        const { name, avatar, companyName, companyDescription, companyLogo, resume } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found "});

        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.resume = resume || user.resume;
 
        // If employer, allow updating company Info
        if (user.role === "employer") {
            user.companyName = companyName || user.companyName;
            user.companyDescription = companyDescription || user.companyDescription;
            user.companyLogo = companyLogo || user.companyLogo;
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            companyName: user.companyName,
            companyDescription: user.companyDescription,
            companyLogo: user.companyLogo,
            resume: user.resume || '',
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete resume file (Jobseeker only)
exports.deleteResume = async (req, res) => {
    try {
        // Implementation for deleting resume
        const { resumeUrl } = req.body; //expect resumeUrl to be the URL of the resume

        const user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({ message: "User not found" });

        if(user.role !== "jobseeker")
            return res.status(403).json({ message: "Only jobseekers can delete resume" });

        // Delete GridFS file when resume URL stores /api/auth/file/:id (or raw ObjectId).
        const extractFileId = (value) => {
            if (!value || typeof value !== "string") return null;
            const trimmed = value.trim();
            if (!trimmed) return null;

            if (mongoose.Types.ObjectId.isValid(trimmed)) {
                return trimmed;
            }

            try {
                const parsed = new URL(trimmed);
                const parts = parsed.pathname.split("/").filter(Boolean);
                const maybeId = parts[parts.length - 1];
                return mongoose.Types.ObjectId.isValid(maybeId) ? maybeId : null;
            } catch {
                const parts = trimmed.split("/").filter(Boolean);
                const maybeId = parts[parts.length - 1];
                return mongoose.Types.ObjectId.isValid(maybeId) ? maybeId : null;
            }
        };

        const fileId = extractFileId(resumeUrl);
        if (fileId) {
            try {
                const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                    bucketName: "uploads",
                });
                await bucket.delete(new mongoose.Types.ObjectId(fileId));
            } catch {
                // Ignore missing files; user profile cleanup should still continue.
            }
        }

        // Backward compatibility: remove only legacy local files under /uploads.
        if (typeof resumeUrl === "string" && resumeUrl.includes("/uploads/")) {
            const fileName = resumeUrl.split('/').pop();
            const filePath = path.join(uploadsDir, fileName);
            if (fileName && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Set the user's resume to an empty string
        user.resume = '';
        await user.save();

        res.json({ message: "resume deleted successfully "});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get user public profile
exports.getPublicProfile = async (req, res) => {
    try {
        // Implementation for getting public profile
        const user = await User.findById(req.params.id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
