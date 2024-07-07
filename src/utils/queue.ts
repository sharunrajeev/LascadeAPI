import Queue from "bull";
import { processCSV } from "../services/csvService";

export const csvQueue = new Queue("csvQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

export const initializeQueue = () => {
  csvQueue.process(async (job) => {
    try {
      await processCSV(job.data.file, job.data.userId);
      job.moveToCompleted("done", true);
    } catch (error) {
      if (job.attemptsMade >= 5) {
        job.moveToFailed({ message: "Job failed after 5 attempts" });
      } else {
        job.retry();
      }
    }
  });

  csvQueue.on("failed", (job, err) => {
    console.error(`Job failed with error ${err.message}`);
  });
};
