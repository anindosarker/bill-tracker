import { Document } from "mongoose";

// Base type (without mongoose Document)
export interface IWorkerBase {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Document type
export interface IWorker extends Document, IWorkerBase {}

// DTOs for API requests/responses
export interface CreateWorkerDTO {
  name: string;
}
