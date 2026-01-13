import dbConnect from "../lib/db";
import Bill, { IBill, IBillVersion } from "../models/bill.model";

export class BillService {
  async createBill(data: {
    workerName: string;
    workingHours: number;
    wagePerHour: number;
    overtimeHours: number;
    overtimeWagePerHour: number;
    paymentStatus: string;
    totalTk: number;
    signature?: string;
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
      workerName: string;
      workingHours: number;
      wagePerHour: number;
      overtimeHours: number;
      overtimeWagePerHour: number;
      paymentStatus: string;
      totalTk: number;
      signature?: string;
    }
  ) {
    await dbConnect();
    const bill = await Bill.findById(id);

    if (!bill) {
      throw new Error("Bill not found");
    }

    // Save current version before updating
    const previousVersion: IBillVersion = {
      workerName: bill.workerName,
      workingHours: bill.workingHours,
      wagePerHour: bill.wagePerHour,
      overtimeHours: bill.overtimeHours,
      overtimeWagePerHour: bill.overtimeWagePerHour,
      paymentStatus: bill.paymentStatus,
      totalTk: bill.totalTk,
      signature: bill.signature,
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
