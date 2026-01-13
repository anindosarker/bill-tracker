"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBillAction } from "@/hooks/actions/useBillAction";
import { format } from "date-fns";
import { Edit, Printer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
              <Skeleton className="mb-4 h-6 w-48" />
              <Skeleton className="mb-2 h-4 w-full" />
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
        <Card
          key={bill._id.toString()}
          className="transition-shadow hover:shadow-md"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">
                  Bill - {bill.entries.length} worker
                  {bill.entries.length !== 1 ? "s" : ""}
                </CardTitle>
                <p className="text-muted-foreground mt-1 text-sm">
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
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/bills/${bill._id}/print`)}
                  className="min-h-[44px]"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href={`/bills/${bill._id}/edit`}>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
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
                    <p className="text-lg font-semibold">
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
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
