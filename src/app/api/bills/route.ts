import { billService } from "@/backend/services/bill.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      entries,
      duration,
      notes,
      preparedBy,
      checkedBy,
      approvedBy,
      signatoryName,
      totalTk,
    } = body;

    // Validate required fields
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one entry is required" },
        { status: 400 },
      );
    }

    if (typeof totalTk !== "number") {
      return NextResponse.json(
        { success: false, error: "totalTk is required and must be a number" },
        { status: 400 },
      );
    }

    const bill = await billService.createBill({
      entries,
      duration,
      notes,
      preparedBy,
      checkedBy,
      approvedBy,
      signatoryName,
      totalTk,
    });

    return NextResponse.json(
      { success: true, data: JSON.parse(JSON.stringify(bill)) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating bill:", error);
    return NextResponse.json(
      { success: false, error: error || "Failed to create bill" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const bills = await billService.getAllBills();
    return NextResponse.json(
      { success: true, data: JSON.parse(JSON.stringify(bills)) },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json(
      { success: false, error: error || "Failed to fetch bills" },
      { status: 500 },
    );
  }
}
