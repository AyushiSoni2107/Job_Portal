const mongoose = require("mongoose");

let cachedConnection = null;
let cachedPromise = null;

const connectDB = async () => {
  if (cachedConnection) return cachedConnection;

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(process.env.MONGO_URI, {})
      .then((mongooseInstance) => {
        cachedConnection = mongooseInstance.connection;
        console.log("MongoDB connected");
        return cachedConnection;
      })
      .catch((err) => {
        cachedPromise = null;
        throw err;
      });
  }

  return cachedPromise;
};

module.exports = connectDB;
