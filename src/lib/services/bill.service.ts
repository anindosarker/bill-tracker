import { IBill } from "@/backend/models/bill.model";
import { IBillEntry } from "@/backend/models/bill.model";
import {
  createBill as createBillAction,
  getAllBills as getAllBillsAction,
  getBill as getBillAction,
  updateBill as updateBillAction,
} from "@/app/actions/bill.actions";

class BillService {
  async createBill(data: {
    entries: IBillEntry[];
    duration?: string;
    notes?: string;
    preparedBy?: string;
    checkedBy?: string;
    approvedBy?: string;
    totalTk: number;
  }) {
    const result = await createBillAction(data);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data;
  }

  async getAllBills() {
    const result = await getAllBillsAction();
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data as IBill[];
  }

  async getBill(id: string) {
    const result = await getBillAction(id);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data as IBill;
  }

  async updateBill(
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
    const result = await updateBillAction(id, data);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data;
  }
}

export const billServiceFrontend = new BillService();
