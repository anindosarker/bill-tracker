import { redirect } from "next/navigation";

interface PrintBillPageProps {
  params: Promise<{ id: string }>;
}

export default async function PrintBillPage({ params }: PrintBillPageProps) {
  const { id } = await params;
  redirect(`/dashboard/bills/${id}/print`);
}
