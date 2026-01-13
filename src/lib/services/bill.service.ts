import type { IBill, IBillEntry, CreateBillDTO, UpdateBillDTO } from "@/types/bill.types";

class BillService {
  async createBill(data: CreateBillDTO) {
    const response = await fetch("/api/bills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to create bill");
    }

    return result.data;
  }

  async getAllBills() {
    const response = await fetch("/api/bills", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch bills");
    }

    return result.data as IBill[];
  }

  async getBill(id: string) {
    const response = await fetch(`/api/bills/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch bill");
    }

    return result.data as IBill;
  }

  async updateBill(id: string, data: UpdateBillDTO) {
    const response = await fetch(`/api/bills/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to update bill");
    }

    return result.data;
  }
}

export const billServiceFrontend = new BillService();
