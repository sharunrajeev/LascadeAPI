import { parse } from "csv-parse";
import fs from "fs";

export default async (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(parse({ columns: true }))
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          //   await YourModel.bulkCreate(results);
          console.log(results);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
  });
};
