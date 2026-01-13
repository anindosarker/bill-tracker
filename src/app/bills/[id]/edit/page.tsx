import { redirect } from "next/navigation";

interface EditBillPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBillPage({ params }: EditBillPageProps) {
  const { id } = await params;
  redirect(`/dashboard/bills/${id}/edit`);
}
