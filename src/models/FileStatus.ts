import mongoose, { Schema, Document } from "mongoose";

export interface IFileStatus extends Document {
  filename: string;
  filepath: string;
  status: string;
  errorMessage?: string;
}

const fileStatusSchema = new Schema(
  {
    filename: { type: String, required: true },
    filepath: { type: String, required: true },
    status: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
    errorMessage: { type: String },
  },
  { timestamps: true }
);

const FileStatus = mongoose.model<IFileStatus>("FileStatus", fileStatusSchema);

export default FileStatus;
