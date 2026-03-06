const SavedJob = require("../models/SavedJob");
const Application = require("../models/Application");

// @desc Save a job
exports.saveJob = async (req, res) => {
  try {
    const exists = await SavedJob.findOne({
      job: req.params.jobId,
      jobseeker: req.user._id,
    });
    if (exists) return res.status(400).json({ message: "Job already saved" });

    const saved = await SavedJob.create({
      job: req.params.jobId,
      jobseeker: req.user._id,
    });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to save job", error: err.message });
  }
};

// @desc Unsave a job
exports.unsaveJob = async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({
      job: req.params.jobId,
      jobseeker: req.user._id,
    });
    res.json({ message: "Job removed from saved list" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to remove saved job", error: err.message });
  }
};

// @desc Get saved jobs for current user
exports.getMySavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ jobseeker: req.user._id }).populate(
      {
        path: "job",
        populate: {
          path: "company",
          select: "name companyName companyLogo",
        },
      },
    );

    const jobIds = savedJobs
      .map((item) => item?.job?._id)
      .filter(Boolean);

    const applications = await Application.find({
      applicant: req.user._id,
      job: { $in: jobIds },
    }).select("job status");

    const applicationStatusMap = applications.reduce((acc, app) => {
      acc[String(app.job)] = app.status;
      return acc;
    }, {});

    const savedJobsWithStatus = savedJobs.map((item) => {
      const entry = item.toObject();
      if (entry.job?._id) {
        entry.job.applicationStatus = applicationStatusMap[String(entry.job._id)] || null;
      }
      return entry;
    });

    res.json(savedJobsWithStatus);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch saved jobs", error: err.message });
  }
};
