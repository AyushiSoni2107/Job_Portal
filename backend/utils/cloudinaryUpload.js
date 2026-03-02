const crypto = require("crypto");

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary config missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
    );
  }

  return { cloudName, apiKey, apiSecret };
};

const getResourceType = (mimetype = "") => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype === "application/pdf") return "raw";
  return "auto";
};

const buildSignature = (folder, timestamp, apiSecret) => {
  const payload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  return crypto.createHash("sha1").update(payload).digest("hex");
};

const uploadToCloudinary = async ({
  buffer,
  mimetype,
  folder = "job-portal",
}) => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = buildSignature(folder, timestamp, apiSecret);
  const resourceType = getResourceType(mimetype);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const fileDataUri = `data:${mimetype};base64,${buffer.toString("base64")}`;

  const formData = new FormData();
  formData.append("file", fileDataUri);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("signature", signature);

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    const cloudinaryMessage = result?.error?.message || "Upload failed";
    throw new Error(cloudinaryMessage);
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
  };
};

module.exports = { uploadToCloudinary };
