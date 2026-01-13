"use client";

import { BillVersionDisplay } from "@/components/bill-version-display";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useBillAction } from "@/hooks/actions/useBillAction";
import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Printer } from "lucide-react";
import { BillHeader } from "@/components/bill-header";
import { numberToWords } from "@/lib/utils";
import { format } from "date-fns";

interface ViewBillPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewBillPage({ params }: ViewBillPageProps) {
  const { id } = use(params);
  const { useBillQuery } = useBillAction();
  const { data: bill, isLoading, error } = useBillQuery(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12">
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-8 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                {error?.message || "Bill not found"}
              </p>
              <Link href="/bills">
                <Button className="mt-4">Back to Bills</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const amountInWords = numberToWords(Math.floor(bill.totalTk));

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/bills">
            <Button variant="ghost" size="sm" className="min-h-[44px]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bills
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={`/bills/${id}/edit`}>
              <Button variant="default" size="sm" className="min-h-[44px]">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Link href={`/bills/${id}/print`}>
              <Button variant="outline" size="sm" className="min-h-[44px]">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold mb-2">Bill Details</h1>
                  <p className="text-sm text-muted-foreground">
                    Created: {format(new Date(bill.createdAt), "PPp")}
                    {bill.updatedAt && bill.updatedAt !== bill.createdAt && (
                      <span className="ml-2">
                        • Updated: {format(new Date(bill.updatedAt), "PPp")}
                      </span>
                    )}
                  </p>
                </div>

                <div className="bg-white p-8 border rounded-lg">
                  {/* Header */}
                  <BillHeader
                    date={new Date(bill.createdAt)}
                    duration={bill.duration}
                  />

                  {/* Table */}
                  <table
                    className="w-full border-collapse border border-black mb-6"
                    style={{ fontFamily: "Times New Roman" }}
                  >
                    <thead>
                      <tr>
                        <th className="border-t border-l border-r border-b border-black p-2 text-center font-bold text-sm">
                          Sl.No.
                        </th>
                        <th className="border-t border-l border-r border-b border-black p-2 text-center font-bold text-sm">
                          Worker Name
                        </th>
                        <th className="border-t border-l border-r border-b border-black p-2 text-center font-bold text-sm">
                          Working Hour
                        </th>
                        <th className="border-t border-l border-r border-b border-black p-2 text-center font-bold text-sm">
                          Wages per Hour (Tk)
                        </th>
                        <th className="border-t border-l border-r border-b border-black p-2 text-center font-bold text-sm">
                          Over time (Hour)
                        </th>
                        <th className="border-t border-l border-r border-b border-black p-2 text-center font-bold text-sm">
                          Over time per Hour (Tk)
                        </th>
                        <th className="border-t border-l border-r border-b border-black p-2 text-center font-bold text-sm">
                          Payment status
                        </th>
                        <th className="border-t border-l border-r border-b border-black p-2 text-center font-bold text-sm">
                          Total tk.
                        </th>
                        <th className="border-t border-l border-r border-b border-black p-2 text-center font-bold text-sm">
                          Signature
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bill.entries.map((entry, index) => (
                        <tr key={index}>
                          <td className="border border-black p-2 text-center">
                            {index + 1}
                          </td>
                          <td className="border border-black p-2 text-left">
                            {entry.workerName}
                          </td>
                          <td className="border border-black p-2 text-center">
                            {entry.workingHours}
                          </td>
                          <td className="border border-black p-2 text-center">
                            {entry.wagePerHour}
                          </td>
                          <td className="border border-black p-2 text-center">
                            {entry.overtimeHours}
                          </td>
                          <td className="border border-black p-2 text-center">
                            {entry.overtimeWagePerHour}
                          </td>
                          <td className="border border-black p-2 text-center">
                            {entry.paymentStatus}
                          </td>
                          <td className="border border-black p-2 text-center">
                            {entry.totalTk.toLocaleString("en-BD")}
                          </td>
                          <td className="border border-black p-2 min-h-[44px]">
                            {entry.signature || ""}
                          </td>
                        </tr>
                      ))}
                      {/* Total Row */}
                      <tr>
                        <td className="border border-black p-2"></td>
                        <td
                          className="border border-black p-2 font-bold"
                          colSpan={6}
                        >
                          Total
                        </td>
                        <td className="border border-black p-2 text-center font-bold">
                          {bill.totalTk.toLocaleString("en-BD")}
                        </td>
                        <td className="border border-black p-2"></td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Notes Section */}
                  {bill.notes && (
                    <div className="mb-4">
                      <p className="text-sm" style={{ fontFamily: "Arial" }}>
                        {bill.notes}
                      </p>
                    </div>
                  )}

                  {/* In Words */}
                  <div className="mb-6">
                    <p className="text-sm" style={{ fontFamily: "Times New Roman" }}>
                      <strong>In Words:</strong> {amountInWords} taka only
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between text-sm">
                      {/* Left: Prepared by */}
                      <div className="flex flex-col">
                        <p className="mb-1 text-sm" style={{ fontFamily: "Arial" }}>
                          {bill.preparedBy ? `(${bill.preparedBy})` : ""}
                        </p>
                        <div className="mb-1 w-32 border-t border-black"></div>
                        <p className="text-sm" style={{ fontFamily: "Times New Roman" }}>
                          Prepared by
                        </p>
                      </div>

                      {/* Right: Company info */}
                      <div className="flex flex-col items-end">
                        <p
                          className="mb-1 min-w-[180px] text-right text-sm whitespace-nowrap"
                          style={{ fontFamily: "Arial" }}
                        >
                          ({bill.signatoryName || "Prodip Kumar Sarker"})
                        </p>
                        <div className="mb-1 min-w-[180px] border-t border-black"></div>
                        <p className="mt-1 text-sm" style={{ fontFamily: "Arial" }}>
                          For, Independent Agriscience Factory
                        </p>
                        <p className="mt-1 text-sm" style={{ fontFamily: "Times New Roman" }}>
                          Bogura
                        </p>
                      </div>
                    </div>

                    {/* Checked by and Approved by */}
                    <div className="flex justify-center gap-8 mt-6 text-sm">
                      <div className="flex flex-col">
                        <p className="mb-1 text-sm" style={{ fontFamily: "Arial" }}>
                          {bill.checkedBy || ""}
                        </p>
                        <div className="mb-1 w-32 border-t border-black"></div>
                        <p className="text-sm" style={{ fontFamily: "Arial" }}>
                          Checked by:
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className="mb-1 text-sm" style={{ fontFamily: "Arial" }}>
                          {bill.approvedBy || ""}
                        </p>
                        <div className="mb-1 w-32 border-t border-black"></div>
                        <p className="text-sm" style={{ fontFamily: "Arial" }}>
                          Approved by:
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <BillVersionDisplay bill={bill} />
          </div>
        </div>
      </div>
    </div>
  );
}
