import dbConnect from "../lib/db";
import Bill, { IBill, IBillEntry, IBillVersion } from "../models/bill.model";

export class BillService {
  async createBill(data: {
    entries: IBillEntry[];
    duration?: string;
    notes?: string;
    preparedBy?: string;
    checkedBy?: string;
    approvedBy?: string;
    totalTk: number;
  }) {
    await dbConnect();
    const bill = await Bill.create(data);
    return bill;
  }

  async getAllBills() {
    await dbConnect();
    return Bill.find().sort({ createdAt: -1 });
  }

  async getBill(id: string) {
    await dbConnect();
    return Bill.findById(id);
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
    await dbConnect();
    const bill = await Bill.findById(id);

    if (!bill) {
      throw new Error("Bill not found");
    }

    // Save current version before updating
    const previousVersion: IBillVersion = {
      entries: bill.entries,
      duration: bill.duration,
      notes: bill.notes,
      preparedBy: bill.preparedBy,
      checkedBy: bill.checkedBy,
      approvedBy: bill.approvedBy,
      totalTk: bill.totalTk,
      updatedAt: bill.updatedAt,
    };

    // Update bill and add previous version to versions array
    bill.versions = [previousVersion, ...(bill.versions || [])];
    Object.assign(bill, data);
    await bill.save();

    return bill;
  }
}

export const billService = new BillService();
