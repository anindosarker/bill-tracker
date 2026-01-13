import mongoose, { Document, Schema } from "mongoose";

export interface IWorker extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkerSchema = new Schema<IWorker>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.Worker ||
  mongoose.model<IWorker>("Worker", WorkerSchema);
