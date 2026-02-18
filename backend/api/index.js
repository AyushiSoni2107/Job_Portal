require("dotenv").config();

const app = require("../app");
const connectDB = require("../config/db");

let initPromise = null;

module.exports = async (req, res) => {
  if (!initPromise) {
    initPromise = connectDB();
  }

  await initPromise;
  return app(req, res);
};
