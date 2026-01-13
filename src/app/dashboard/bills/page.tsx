import { BillList } from "@/components/bill-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function DashboardBillsPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">All Bills</h1>
          <Link href="/dashboard">
            <Button size="lg" className="min-h-[44px]">
              <Plus className="h-5 w-5 mr-2" />
              Create New Bill
            </Button>
          </Link>
        </div>
        <BillList />
      </div>
    </div>
  );
}
