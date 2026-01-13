"use client";

import { BillVersionDisplay } from "@/components/bill-version-display";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useBillAction } from "@/hooks/actions/useBillAction";
import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EditBillClient } from "@/components/edit-bill-client";

interface EditBillPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBillPage({ params }: EditBillPageProps) {
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
              <Link href="/dashboard/bills">
                <Button className="mt-4">Back to Bills</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <EditBillClient bill={bill} billId={id} />;
}
