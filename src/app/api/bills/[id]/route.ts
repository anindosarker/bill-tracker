import { NextRequest, NextResponse } from "next/server";
import { billService } from "@/backend/services/bill.service";
import type { UpdateBillDTO } from "@/types/bill.types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bill = await billService.getBill(id);

    if (!bill) {
      return NextResponse.json(
        { success: false, error: "Bill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: JSON.parse(JSON.stringify(bill)) },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching bill:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch bill" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { entries, duration, notes, preparedBy, checkedBy, approvedBy, signatoryName, totalTk } = body;

    // Validate required fields
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one entry is required" },
        { status: 400 }
      );
    }

    if (typeof totalTk !== "number") {
      return NextResponse.json(
        { success: false, error: "totalTk is required and must be a number" },
        { status: 400 }
      );
    }

    const bill = await billService.updateBill(id, {
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
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating bill:", error);
    
    if (error.message === "Bill not found") {
      return NextResponse.json(
        { success: false, error: "Bill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to update bill" },
      { status: 500 }
    );
  }
}
