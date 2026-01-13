import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthenticatedNavbar } from "@/components/authenticated-navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavbar />
      <main>{children}</main>
    </div>
  );
}
