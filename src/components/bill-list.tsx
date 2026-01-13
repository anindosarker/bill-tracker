"use client";

import { useBillAction } from "@/hooks/actions/useBillAction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit, Printer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function BillList() {
  const { useBillsQuery } = useBillAction();
  const { data: bills, isLoading } = useBillsQuery();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!bills || bills.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground text-lg">
            No bills found. Create your first bill to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bills.map((bill) => (
        <Card key={bill._id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">
                  Bill - {bill.entries.length} worker{bill.entries.length !== 1 ? "s" : ""}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(bill.createdAt), "PPp")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/bills/${bill._id}/edit`)}
                  className="min-h-[44px]"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/bills/${bill._id}/print`)}
                  className="min-h-[44px]"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Workers</p>
                  <p className="font-semibold">{bill.entries.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Entries</p>
                  <p className="font-semibold">{bill.entries.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Grand Total</p>
                  <p className="font-semibold text-lg">
                    {bill.totalTk.toLocaleString("en-BD")} Tk
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-semibold">
                    {bill.entries[0]?.paymentStatus || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
