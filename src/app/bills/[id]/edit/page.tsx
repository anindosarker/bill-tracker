import { BillForm } from "@/components/bill-form";
import { BillVersionDisplay } from "@/components/bill-version-display";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBill } from "@/app/actions/bill.actions";
import { EditBillClient } from "@/components/edit-bill-client";

interface EditBillPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBillPage({ params }: EditBillPageProps) {
  const { id } = await params;
  const result = await getBill(id);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground text-lg">Bill not found</p>
              <Link href="/bills">
                <Button className="mt-4">Back to Bills</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <EditBillClient bill={result.data} billId={id} />;
}
