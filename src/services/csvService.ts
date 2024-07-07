import csv from "csv-parser";
import fs from "fs";
import mongoose from "mongoose";
import FileStatus from "../models/FileStatus";

export const processCSV = async (
  file: { path: string; name: string },
  userId: string
) => {
  const results: any[] = [];
  let headers: string[] = [];
  const filePath = file.path;
  const fileName = file.name;

  // Create a new file status entry
  const fileStatus = new FileStatus({
    filename: fileName,
    filepath: filePath,
    status: "processing",
    userId: userId,
  });

  console.log('ProcessCSV called');

  try {
    await fileStatus.save(); // Save the initial status

    await new Promise((resolve, reject) => {
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
            const DynamicModel = mongoose.model("CSVData", dynamicSchema);

            const session = await mongoose.startSession();
            session.startTransaction();

            // Insert CSV data into the collection
            await DynamicModel.insertMany(results, { session });

            await session.commitTransaction();
            session.endSession();

            // Update file status upon successful processing
            fileStatus.status = "completed";
            await fileStatus.save();

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
    fileStatus.status = "failed";
    fileStatus.errorMessage = error.message;
    await fileStatus.save();
  }
};
