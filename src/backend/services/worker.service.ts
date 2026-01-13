import dbConnect from "../lib/db";
import Worker, { IWorker } from "../models/worker.model";

export class WorkerService {
  async createWorker(name: string) {
    await dbConnect();
    const worker = await Worker.create({ name });
    return worker;
  }

  async getAllWorkers() {
    await dbConnect();
    return Worker.find().sort({ name: 1 });
  }

  async getWorker(id: string) {
    await dbConnect();
    return Worker.findById(id);
  }
}

export const workerService = new WorkerService();
