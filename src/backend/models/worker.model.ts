import mongoose, { Schema } from "mongoose";
import { IWorker } from "@/types/worker.types";

const WorkerSchema = new Schema<IWorker>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.Worker ||
  mongoose.model<IWorker>("Worker", WorkerSchema);
