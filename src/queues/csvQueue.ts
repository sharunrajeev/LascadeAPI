import Queue from "bull";
import csvProcessor from "../workers/csvProcessor";

const csvQueue = new Queue("csvQueue", {
  redis: {
    host: "localhost",
    port: 6379,
  },
});

csvQueue.process(csvProcessor);

export default csvQueue;
