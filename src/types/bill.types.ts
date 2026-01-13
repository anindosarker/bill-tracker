import { Document } from "mongoose";

// Base types (without mongoose Document)
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

export interface IBillBase {
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

// Mongoose Document type
export interface IBill extends Document, IBillBase {}

// DTOs for API requests/responses
export interface CreateBillDTO {
  entries: IBillEntry[];
  duration?: string;
  notes?: string;
  preparedBy?: string;
  checkedBy?: string;
  approvedBy?: string;
  signatoryName?: string;
  totalTk: number;
}

export interface UpdateBillDTO extends CreateBillDTO {}
