import Queue from "bull";
import { processCSV } from "../services/csvService";

export const csvQueue = new Queue("csvQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

// Define queue processing
csvQueue.process(async (job) => {
  const { file } = job.data;
  try {
    await processCSV(file); // Process the CSV using your existing function
    return true; // Job succeeded
  } catch (error) {
    console.error(`CSV processing failed for file ${file.name}:`, error);
    throw new Error(`CSV processing failed for file ${file.name}`);
  }
});

// Error handling
csvQueue.on("error", (error) => {
  console.error("Queue error:", error);
});

export default csvQueue;
