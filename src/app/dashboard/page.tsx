import { BillForm } from "@/components/bill-form";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-7xl print:max-w-none">
        <BillForm />
      </div>
    </div>
  );
}
