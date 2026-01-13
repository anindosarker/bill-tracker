"use client";

import { BillForm } from "@/components/bill-form";
import { BillVersionDisplay } from "@/components/bill-version-display";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { IBill } from "@/backend/models/bill.model";

interface EditBillClientProps {
  bill: IBill;
  billId: string;
}

export function EditBillClient({ bill, billId }: EditBillClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/bills">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bills
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <BillForm
              billId={billId}
              initialData={{
                workerName: bill.workerName,
                workingHours: bill.workingHours,
                wagePerHour: bill.wagePerHour,
                overtimeHours: bill.overtimeHours,
                overtimeWagePerHour: bill.overtimeWagePerHour,
                paymentStatus: bill.paymentStatus,
                signature: bill.signature || "",
              }}
              onSuccess={() => {
                router.push(`/bills/${billId}`);
              }}
            />
          </div>

          <div>
            <BillVersionDisplay bill={bill} />
          </div>
        </div>
      </div>
    </div>
  );
}
