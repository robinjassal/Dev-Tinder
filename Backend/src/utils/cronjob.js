// src/jobs/cleanupRequests.js
const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequests"); // adjust path

const startCleanupJob = () => {
  // runs every day at 02:00
  cron.schedule("0 2 * * *", async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await ConnectionRequest.deleteMany({
        status: { $in: ["ignored", "rejected"] },
        updatedAt: { $lt: thirtyDaysAgo },
      });

      console.log(
        `[CRON] Deleted ${result.deletedCount} old connection requests`,
      );
    } catch (err) {
      console.error("[CRON] Cleanup failed:", err.message);
    }
  });

  // console.log("Cleanup cron job scheduled");
};

module.exports = startCleanupJob;
