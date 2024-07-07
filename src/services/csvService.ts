import csv from "csv-parser";
import fs from "fs";
import mongoose from "mongoose";

export const processCSV = async (file: { path: string; name: string }) => {
  const results: any[] = [];
  let headers: string[] = [];
  const filePath = file.path;
  const fileName = file.name;

  try {
    return await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headerList) => {
          headers = headerList;
        })
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          try {
            // Define the schema dynamically based on CSV headers
            const schemaDefinition: any = {};
            headers.forEach((header) => {
              schemaDefinition[header] = { type: String };
            });

            const dynamicSchema = new mongoose.Schema(schemaDefinition, {
              timestamps: true,
            });

            const DynamicModel = mongoose.model(fileName, dynamicSchema);
            // await DynamicModel.insertMany(results);
            const session = await mongoose.startSession();
            session.startTransaction();

            // Insert CSV data into the collection
            await DynamicModel.insertMany(results, { session });

            await session.commitTransaction();
            session.endSession();
            console.log("DB Transaction completed");
            resolve(true);
          } catch (error) {
            reject(error);
          } finally {
            // Remove the file after processing
            fs.unlink(filePath, (err) => {
              if (err) console.error(`Failed to delete file: ${err.message}`);
            });
          }
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  } catch (error: any) {
    console.error("Failed to process CSV data.", error);
  }
};
