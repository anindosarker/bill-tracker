"use server";

import { workerService } from "@/backend/services/worker.service";
import { revalidatePath } from "next/cache";

export async function createWorker(name: string) {
  try {
    const worker = await workerService.createWorker(name);
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(worker)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllWorkers() {
  try {
    const workers = await workerService.getAllWorkers();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(workers)),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
