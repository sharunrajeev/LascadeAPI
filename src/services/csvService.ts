import csv from 'csv-parser';
import fs from 'fs';
import mongoose, { Schema } from 'mongoose';

export const processCSV = async (filePath: string, userId: string) => {
  const results: any[] = [];
  let headers: string[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('headers', (headerList) => {
        headers = headerList;
      })
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          // Define the schema dynamically based on CSV headers
          const schemaDefinition: any = {};
          headers.forEach(header => {
            schemaDefinition[header] = { type: String };
          });

          const dynamicSchema = new Schema(schemaDefinition, { timestamps: true });
          const DynamicModel = mongoose.model('CSVData', dynamicSchema);

          const session = await mongoose.startSession();
          session.startTransaction();

          // Insert CSV data into the collection
          await DynamicModel.insertMany(results, { session });

          await session.commitTransaction();
          session.endSession();
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
      .on('error', (error) => reject(error));
  });
};
