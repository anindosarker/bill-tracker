"use server";

import { billService } from "@/backend/services/bill.service";
import { revalidatePath } from "next/cache";
import { IBillEntry } from "@/backend/models/bill.model";

export async function createBill(data: {
  entries: IBillEntry[];
  duration?: string;
  notes?: string;
  preparedBy?: string;
  checkedBy?: string;
  approvedBy?: string;
  totalTk: number;
}) {
  try {
    const bill = await billService.createBill(data);
    revalidatePath("/");
    revalidatePath("/bills");
    return { success: true, data: JSON.parse(JSON.stringify(bill)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllBills() {
  try {
    const bills = await billService.getAllBills();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(bills)),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBill(id: string) {
  try {
    const bill = await billService.getBill(id);
    if (!bill) {
      return { success: false, error: "Bill not found" };
    }
    return {
      success: true,
      data: JSON.parse(JSON.stringify(bill)),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBill(
  id: string,
  data: {
    entries: IBillEntry[];
    duration?: string;
    notes?: string;
    preparedBy?: string;
    checkedBy?: string;
    approvedBy?: string;
    totalTk: number;
  }
) {
  try {
    const bill = await billService.updateBill(id, data);
    revalidatePath("/");
    revalidatePath("/bills");
    revalidatePath(`/bills/${id}`);
    return { success: true, data: JSON.parse(JSON.stringify(bill)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
