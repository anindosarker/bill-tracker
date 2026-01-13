import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PublicNavbar } from "@/components/public-navbar";
import { AuthForm } from "@/components/auth-form";

export default async function Home() {
  const session = await auth();

  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <AuthForm />
      </div>
    </div>
  );
}
