import mongoose, { Document, Schema } from "mongoose";

export interface IBillVersion {
  workerName: string;
  workingHours: number;
  wagePerHour: number;
  overtimeHours: number;
  overtimeWagePerHour: number;
  paymentStatus: string;
  totalTk: number;
  signature?: string;
  updatedAt: Date;
}

export interface IBill extends Document {
  workerName: string;
  workingHours: number;
  wagePerHour: number;
  overtimeHours: number;
  overtimeWagePerHour: number;
  paymentStatus: string;
  totalTk: number;
  signature?: string;
  versions: IBillVersion[];
  createdAt: Date;
  updatedAt: Date;
}

const BillVersionSchema = new Schema<IBillVersion>(
  {
    workerName: { type: String, required: true },
    workingHours: { type: Number, required: true },
    wagePerHour: { type: Number, required: true },
    overtimeHours: { type: Number, default: 0 },
    overtimeWagePerHour: { type: Number, default: 0 },
    paymentStatus: { type: String, default: "cash" },
    totalTk: { type: Number, required: true },
    signature: { type: String },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const BillSchema = new Schema<IBill>(
  {
    workerName: { type: String, required: true },
    workingHours: { type: Number, required: true },
    wagePerHour: { type: Number, required: true },
    overtimeHours: { type: Number, default: 0 },
    overtimeWagePerHour: { type: Number, default: 0 },
    paymentStatus: { type: String, default: "cash" },
    totalTk: { type: Number, required: true },
    signature: { type: String },
    versions: { type: [BillVersionSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Bill || mongoose.model<IBill>("Bill", BillSchema);
