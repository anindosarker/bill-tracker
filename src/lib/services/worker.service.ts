import { IWorker } from "@/backend/models/worker.model";
import {
  createWorker as createWorkerAction,
  getAllWorkers as getAllWorkersAction,
} from "@/app/actions/worker.actions";

class WorkerService {
  async createWorker(name: string) {
    const result = await createWorkerAction(name);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data;
  }

  async getAllWorkers() {
    const result = await getAllWorkersAction();
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data as IWorker[];
  }
}

export const workerServiceFrontend = new WorkerService();
