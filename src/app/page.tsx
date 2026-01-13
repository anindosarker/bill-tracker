import { BillForm } from "@/components/bill-form";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background min-h-screen p-4 md:p-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-7xl print:max-w-none">
        <div className="mb-8 flex items-center justify-between print:hidden">
          <h1 className="text-3xl font-bold">Bill Tracker</h1>
          <Link href="/bills">
            <Button variant="outline" size="lg" className="min-h-[44px]">
              <FileText className="mr-2 h-5 w-5" />
              View All Bills
            </Button>
          </Link>
        </div>
        <BillForm />
      </div>
    </div>
  );
}
