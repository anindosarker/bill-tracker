"use client";

import { BillForm } from "@/components/bill-form";
import { BillVersionDisplay } from "@/components/bill-version-display";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { IBill } from "@/types/bill.types";

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
            <Button variant="ghost" size="sm" className="min-h-[44px]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bills
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BillForm
              billId={billId}
              initialData={{
                entries: bill.entries,
                notes: bill.notes || "",
                preparedBy: bill.preparedBy || "",
                checkedBy: bill.checkedBy || "",
                approvedBy: bill.approvedBy || "",
                signatoryName: bill.signatoryName || "Prodip Kumar Sarker",
                duration: bill.duration || "",
              }}
              onSuccess={() => {
                router.push(`/bills/${billId}/print`);
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
