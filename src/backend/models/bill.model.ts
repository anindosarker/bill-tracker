import mongoose, { Document, Schema } from "mongoose";

export interface IBillEntry {
  workerName: string;
  workingHours: number;
  wagePerHour: number;
  overtimeHours: number;
  overtimeWagePerHour: number;
  paymentStatus: string;
  totalTk: number;
  signature?: string;
}

export interface IBillVersion {
  entries: IBillEntry[];
  duration?: string;
  notes?: string;
  preparedBy?: string;
  checkedBy?: string;
  approvedBy?: string;
  signatoryName?: string;
  totalTk: number;
  updatedAt: Date;
}

export interface IBill extends Document {
  entries: IBillEntry[];
  duration?: string;
  notes?: string;
  preparedBy?: string;
  checkedBy?: string;
  approvedBy?: string;
  signatoryName?: string;
  totalTk: number;
  versions: IBillVersion[];
  createdAt: Date;
  updatedAt: Date;
}

const BillEntrySchema = new Schema<IBillEntry>(
  {
    workerName: { type: String, required: true },
    workingHours: { type: Number, required: true },
    wagePerHour: { type: Number, required: true },
    overtimeHours: { type: Number, default: 0 },
    overtimeWagePerHour: { type: Number, default: 0 },
    paymentStatus: { type: String, default: "cash" },
    totalTk: { type: Number, required: true },
    signature: { type: String },
  },
  { _id: false }
);

const BillVersionSchema = new Schema<IBillVersion>(
  {
    entries: { type: [BillEntrySchema], required: true },
    duration: { type: String },
    notes: { type: String },
    preparedBy: { type: String },
    checkedBy: { type: String },
    approvedBy: { type: String },
    signatoryName: { type: String },
    totalTk: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const BillSchema = new Schema<IBill>(
  {
    entries: { type: [BillEntrySchema], required: true },
    duration: { type: String },
    notes: { type: String },
    preparedBy: { type: String },
    checkedBy: { type: String },
    approvedBy: { type: String },
    signatoryName: { type: String, default: "Prodip Kumar Sarker" },
    totalTk: { type: Number, required: true },
    versions: { type: [BillVersionSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Bill || mongoose.model<IBill>("Bill", BillSchema);
