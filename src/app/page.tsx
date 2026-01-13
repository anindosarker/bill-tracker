import { BillForm } from "@/components/bill-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Bill Tracker</h1>
          <Link href="/bills">
            <Button variant="outline" size="lg" className="min-h-[44px]">
              <FileText className="h-5 w-5 mr-2" />
              View All Bills
            </Button>
          </Link>
        </div>
        <BillForm />
      </div>
    </div>
  );
}
